import type { PlaygroundConfig, SdkSource } from '../types'
import { sdkSourceFor } from './sdk-sources'
import { buildSdkGlobalConfig, parseMessage, PROTOCOL_VERSION } from './sdk-protocol'
import { getHandshakeCapabilities } from './capabilities'
import { handleMockRequest } from './mock-handlers'

export interface LoadProgress {
  stage: string
  /** 0-100 */
  percent: number
}

export type ProgressHandler = (p: LoadProgress) => void

export interface LoadResult {
  ok: boolean
  sdkVersion: string
  error?: string
}

const DB_NAME = 'sewa-host-playground'
const STORE = 'modules'

// Keep evaluated blob URLs alive while mounted, revoke on unload/navigation
const blobURLs = new Map<string, string>()
const assetURLs = new Map<string, string[]>()

function mimeTypeFor(file: string): string {
  const lower = file.toLowerCase()
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.woff2')) return 'font/woff2'
  if (lower.endsWith('.woff')) return 'font/woff'
  if (lower.endsWith('.ttf')) return 'font/ttf'
  if (lower.endsWith('.css')) return 'text/css'
  if (lower.endsWith('.js')) return 'application/javascript'
  return 'application/octet-stream'
}

function rewriteAssetReferences(code: string, urls: Record<string, string>): string {
  let out = code
  for (const [name, url] of Object.entries(urls)) {
    // Replace quoted asset paths: "file.svg", '/file.svg', "/assets/file.svg"
    const base = name.split('/').pop() ?? name
    for (const key of [name, base, `/${name}`, `/${base}`]) {
      if (!key) continue
      out = out.split(`"${key}"`).join(`"${url}"`)
      out = out.split(`'${key}'`).join(`'${url}'`)
      out = out.split(`\`${key}\``).join(`\`${url}\``)
      out = out.split(`(${key})`).join(`(${url})`)
    }
  }
  return out
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function idbGet(db: IDBDatabase, id: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const g = tx.objectStore(STORE).get(id)
    g.onsuccess = () => resolve((g.result as { body?: string } | undefined)?.body ?? null)
    g.onerror = () => reject(g.error)
  })
}

async function idbSet(db: IDBDatabase, id: string, body: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put({ id, body })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Cache key suffix for a bundle.
 *
 * Keying the cache on `application.id` alone was a trap: bundlers emit
 * content-hashed filenames, but the id never changes, so a vendor who rebuilt
 * and redeployed kept being served the copy we downloaded the first time —
 * silently testing an old build. Folding the manifest's entry/styles/files
 * into the key means a rebuild produces a new key and refetches on its own.
 */
function bundleFingerprint(entry: string, styles: string[], files: string[]): string {
  const material = [entry, ...styles, ...files].join('|')
  // djb2 — we only need change detection, not cryptographic strength.
  let h = 5381
  for (let i = 0; i < material.length; i++) {
    h = ((h << 5) + h + material.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(36)
}

/** Drop this module's superseded bundles so old builds do not pile up. */
async function idbPruneOtherVersions(db: IDBDatabase, moduleId: string, keep: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite')
      const store = tx.objectStore(STORE)
      const cursor = store.openKeyCursor()
      cursor.onsuccess = () => {
        const c = cursor.result
        if (!c) return
        const key = String(c.key)
        if (key !== keep && key.startsWith(`${moduleId}@`)) store.delete(c.key)
        c.continue()
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    } catch (_e) {
      void _e
      resolve()
    }
  })
}

function normalizeBaseUrl(url: string): string {
  let u = (url ?? '').trim()
  if (!u) return ''
  if (!u.startsWith('http://') && !u.startsWith('https://') && !u.startsWith('/')) {
    u = 'https://' + u
  }
  while (u.endsWith('/')) u = u.slice(0, -1)
  return u
}

// --- module evaluation helpers (mirrors packages/runtime-loader/src/loader.ts:931 + utils.ts:85) ---

interface MiniAppModuleExports {
  mount: (container: HTMLElement, runtime?: unknown) => void
  unmount?: (container: HTMLElement) => void
}

/**
 * Import a module the bundler must not touch.
 *
 * The mini-app bundle only exists at runtime, behind a `blob:` URL. Both
 * bundlers try to resolve a dynamic `import()` at build time and need to be
 * told not to:
 *   - Vite (the standalone app) honours `@vite-ignore`.
 *   - Rspack/webpack (the Docusaurus portal) honours `webpackIgnore`; without
 *     it the call is compiled into a context module and every load fails with
 *     "Cannot find module 'blob:http://…'".
 * Both comments must stay — the same file is compiled by both bundlers.
 */
function importModuleUrl(url: string): Promise<MiniAppModuleExports> {
  return import(/* webpackIgnore: true */ /* @vite-ignore */ url) as Promise<MiniAppModuleExports>
}

async function evaluateModule(moduleId: string, code: string): Promise<MiniAppModuleExports> {
  const processShim = 'self.process = self.process || { env: { NODE_ENV: "production" } };'
  const blob = new Blob([processShim + code], { type: 'application/javascript' })
  const blobUrl = URL.createObjectURL(blob)
  const prev = blobURLs.get(moduleId)
  if (prev) URL.revokeObjectURL(prev)
  blobURLs.set(moduleId, blobUrl)
  try {
    return await importModuleUrl(blobUrl)
  } catch (err) {
    blobURLs.delete(moduleId)
    URL.revokeObjectURL(blobUrl)
    throw err
  }
}

function mountWithIsolation(
  moduleExports: MiniAppModuleExports,
  container: HTMLElement,
  styles: string[],
): { cleanup: () => void } {
  const shadow = container.shadowRoot ?? container.attachShadow({ mode: 'open' })
  shadow.innerHTML = ''
  for (const css of styles) {
    const style = document.createElement('style')
    style.setAttribute('data-mini-app-style', 'true')
    style.textContent = css
    shadow.appendChild(style)
  }
  const inner = document.createElement('div')
  inner.setAttribute('data-mini-app-container', 'true')
  inner.style.minHeight = '100%'
  shadow.appendChild(inner)
  moduleExports.mount(inner, undefined)
  return {
    cleanup: () => {
      try {
        moduleExports.unmount?.(inner)
      } catch (_e) {
        void _e
      }
      shadow.innerHTML = ''
    },
  }
}

function destroyPreviousSdkIfNeeded(): void {
  try {
    const w = window as unknown as Record<string, unknown>
    const cur = w['__GSA_SDK__'] as { destroy?: () => void; initialize?: unknown } | undefined
    if (cur && typeof cur.destroy === 'function' && typeof cur.initialize === 'function') {
      cur.destroy()
    }
  } catch (_e) {
    void _e
  }
}

export interface LoadOptions {
  /**
   * Ignore the cached bundle and pull every file from the network again.
   *
   * Backs the "Reload" button. Normal loads read the cache, which is keyed on
   * the manifest's file list (see {@link bundleFingerprint}) so a rebuild
   * invalidates itself; this is the escape hatch for the case that fingerprint
   * cannot catch — a vendor redeploying different code under unchanged,
   * unhashed filenames.
   */
  refresh?: boolean
}

/**
 * Loads and mounts the vendor mini app:
 *  1. fetch <base>/manifest.json
 *  2. download each listed file into IndexedDB (per module id) — via manifest.bundle.files
 *  3. inject the chosen SDK version's CDN script (handshake channel ready)
 *  4. evaluate entry via Blob URL + mount into Shadow DOM (isolated scope, no CSS clash)
 *
 * Mirrors the directory flow in packages/runtime-loader/src/loader.ts:126 load() -> loadPlugin:377
 * instead of the previous playground's `innerHTML<script>` which never executes.
 */
export async function loadAndMountMiniApp(
  container: HTMLElement,
  cfg: PlaygroundConfig,
  onProgress?: ProgressHandler,
  onReady?: () => void,
  opts: LoadOptions = {},
): Promise<LoadResult> {
  const base = normalizeBaseUrl(cfg.manifestUrl)

  const report = (stage: string, percent: number) => {
    onProgress?.({ stage, percent })
  }

  const db = await openDb()

  if (!base) {
    return { ok: false, sdkVersion: cfg.sdkVersion, error: 'Manifest URL is empty' }
  }

  report('Fetching manifest.json', 5)
  const mres = await fetch(`${base}/manifest.json`, { cache: 'no-store' })
  if (!mres.ok) {
    return { ok: false, sdkVersion: cfg.sdkVersion, error: `manifest.json not found (${mres.status})` }
  }
  const manifest = (await mres.json()) as {
    application?: { id?: string }
    bundle?: { entry?: string; styles?: string[]; files?: string[] }
  }
  const moduleId = manifest.application?.id || slugify(cfg.name || 'mini-app')
  const entry = manifest.bundle?.entry
  const styles = manifest.bundle?.styles ?? []
  const files = manifest.bundle?.files ?? []
  if (!entry) {
    return { ok: false, sdkVersion: cfg.sdkVersion, error: 'manifest missing bundle.entry' }
  }

  // Try cache (new format: JSON {entryCode, styles:[css]}) — fallback to legacy bundleText
  const cacheId = `${moduleId}@${bundleFingerprint(entry, styles, files)}`
  const cached = opts.refresh ? null : await idbGet(db, cacheId)
  let entryCode: string | null = null
  let styleContents: string[] = []

  if (cached != null) {
    try {
      const parsed = JSON.parse(cached) as { entryCode?: string; styles?: string[] }
      if (parsed && typeof parsed.entryCode === 'string') {
        entryCode = parsed.entryCode
        styleContents = parsed.styles ?? []
        report('Bundle restored from cache', 62)
      } else {
        // legacy HTML bundleText — invalidate
        throw new Error('legacy cache')
      }
    } catch {
      // legacy or corrupted cache — force re-download below
      entryCode = null
      styleContents = []
    }
  }

  // Keep frecords for asset blob URL publishing on fresh download
  let frecordsForAssets: { ref: string; bytes: ArrayBuffer | null }[] | null = null

  if (entryCode == null) {
    const total = files.length
    const frecords: { ref: string; bytes: ArrayBuffer | null }[] = []
    for (let i = 0; i < total; i++) {
      const file = files[i]
      report(`Downloading ${file}`, 10 + Math.round((i / Math.max(total, 1)) * 50))
      const fr = await fetch(`${base}/${file}`, { cache: 'no-store' })
      if (!fr.ok) {
        return { ok: false, sdkVersion: cfg.sdkVersion, error: `Failed to fetch ${file} (${fr.status})` }
      }
      frecords.push({ ref: file, bytes: await fr.arrayBuffer() })
    }
    const decode = (buf: ArrayBuffer | null) => (buf ? new TextDecoder().decode(buf) : '')
    const entryRec = frecords.find((f) => f.ref === entry)
    entryCode = decode(entryRec?.bytes ?? null)
    if (!entryCode) {
      return { ok: false, sdkVersion: cfg.sdkVersion, error: `Entry ${entry} empty or missing` }
    }
    styleContents = styles
      .map((s) => {
        const rec = frecords.find((f) => f.ref === s)
        return rec?.bytes ? decode(rec.bytes) : ''
      })
      .filter(Boolean)

    await idbSet(db, cacheId, JSON.stringify({ entryCode, styles: styleContents }))
    await idbPruneOtherVersions(db, moduleId, cacheId)
    report('Caching bundle to IndexedDB', 62)
    frecordsForAssets = frecords
  }

  // Publish assets as blob URLs and rewrite references (mirrors loader.ts:522).
  // Only for fresh download where we have bytes; cached loads skip (raw cache has no asset bytes).
  if (frecordsForAssets) {
    for (const u of assetURLs.get(moduleId) ?? []) URL.revokeObjectURL(u)
    const published: string[] = []
    const assetMap: Record<string, string> = {}
    const isText = (f: string) => /\.(svg|css|js|json|html|txt)$/i.test(f)
    for (const rec of frecordsForAssets) {
      if (rec.ref === entry || styles.includes(rec.ref)) continue
      if (!rec.bytes) continue
      const blob = isText(rec.ref)
        ? new Blob([new TextDecoder().decode(rec.bytes)], { type: mimeTypeFor(rec.ref) })
        : new Blob([rec.bytes], { type: mimeTypeFor(rec.ref) })
      const url = URL.createObjectURL(blob)
      assetMap[rec.ref] = url
      published.push(url)
    }
    assetURLs.set(moduleId, published)
    if (Object.keys(assetMap).length) {
      entryCode = rewriteAssetReferences(entryCode!, assetMap)
      styleContents = styleContents.map((c) => rewriteAssetReferences(c, assetMap))
    }
  } else {
    // Cached path: revoke stale asset URLs for this module (no rewrite)
    for (const u of assetURLs.get(moduleId) ?? []) URL.revokeObjectURL(u)
    assetURLs.delete(moduleId)
  }

  report('Booting SDK', 90)
  const sdk = sdkSourceFor(cfg.sdkVersion)
  // Ensure handshake listener is installed before SDK script runs (idempotent)
  installHandshakeListener()
  // Destroy previous SDK instance if hot-reloading same moduleId
  destroyPreviousSdkIfNeeded()
  // Remove any previous blob URL for this module before re-evaluating
  const prevBlob = blobURLs.get(moduleId)
  if (prevBlob) {
    URL.revokeObjectURL(prevBlob)
    blobURLs.delete(moduleId)
  }
  setSdkGlobalConfig(moduleId, sdk)
  try {
    await injectScript(sdk.url)
  } catch (e) {
    return { ok: false, sdkVersion: cfg.sdkVersion, error: e instanceof Error ? e.message : String(e) }
  }

  report('Mounting in Shadow DOM', 96)

  // Clean previous mount
  const existingShadow = container.shadowRoot
  if (existingShadow) existingShadow.innerHTML = ''

  let mountExports: MiniAppModuleExports
  try {
    mountExports = await evaluateModule(moduleId, entryCode)
  } catch (e) {
    return { ok: false, sdkVersion: cfg.sdkVersion, error: `Failed to evaluate ${entry}: ${e instanceof Error ? e.message : String(e)}` }
  }

  if (typeof mountExports.mount !== 'function') {
    return {
      ok: false,
      sdkVersion: cfg.sdkVersion,
      error: `Bundle ${entry} must export mount(container) — got ${Object.keys(mountExports).join(', ') || '(none)'}`,
    }
  }

  try {
    mountWithIsolation(mountExports, container, styleContents)
  } catch (e) {
    return { ok: false, sdkVersion: cfg.sdkVersion, error: `Mount failed: ${e instanceof Error ? e.message : String(e)}` }
  }

  report('Waiting for mini app to render', 96)

  // The bundle is mounted, but the mini app's React tree (and its SDK
  // handshake) still need to finish. Watch the shadow root so we can
  // surface it as "mounted" only once real content appears.
  if (onReady) {
    const shadow = container.shadowRoot!
    let done = false
    const markReady = () => {
      if (done) return
      done = true
      onReady()
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
    const observer = new MutationObserver((mutations) => {
      for (const mu of mutations) {
        for (const node of mu.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Most mini-apps render a top-level <div> with children
            if ((node as Element).children.length > 0 || shadow.querySelector('main, [data-ready], #root, div')) {
              markReady()
              return
            }
          }
        }
      }
      // Also check synchronously after each batch - some apps render synchronously
      if (shadow.querySelector('main, [data-ready], div[data-mini-app-container] > *')) {
        markReady()
      }
    })
    observer.observe(shadow, { childList: true, subtree: true })

    // Fallback: if no new nodes are added within 30 s (e.g., the mini
    // app renders synchronously during evaluate), consider it ready.
    const fallbackTimer = window.setTimeout(() => {
      if (shadow.querySelector('main, [data-ready], div[data-mini-app-container] > *')) {
        markReady()
      } else {
        // Still mark ready to hide loading overlay even if selector not matched
        markReady()
      }
    }, 3000)
  }

  return { ok: true, sdkVersion: cfg.sdkVersion }
}

/**
 * The Mini App SDK reads globals `window.__GSA_SDK__` and
 * `window.__GSA_HOST_DESCRIPTOR__` that must be in place *before* the SDK
 * script is injected. Mirrors shell/src/platform/sdk/bootstrap/core.ts:33 seedSdkConfig.
 * Host descriptor capabilities are now derived from the drawer toggles via
 * getHandshakeCapabilities() so the mini app only sees what the vendor enabled.
 */
function setSdkGlobalConfig(miniAppId: string, sdk: SdkSource): void {
  const cfg = buildSdkGlobalConfig(miniAppId, sdk, PROTOCOL_VERSION)
  const caps = getHandshakeCapabilities()
  const hostDesc = {
    type: 'web' as const,
    version: PROTOCOL_VERSION,
    capabilities: caps,
    sdkVersion: sdk.version,
  }
  const w = window as unknown as Record<string, unknown>
  w['__GSA_SDK__'] = cfg
  w['__GSA_HOST_DESCRIPTOR__'] = hostDesc
  const g = globalThis as unknown as Record<string, unknown>
  g['__GSA_SDK__'] = cfg
  g['__GSA_HOST_DESCRIPTOR__'] = hostDesc
}

function injectScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Remove previous SDK script tag for same URL to allow re-injection
    const prev = document.querySelector(`script[src="${url}"]`) as HTMLScriptElement | null
    if (prev) prev.remove()
    const s = document.createElement('script')
    s.src = url
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load SDK from ${url}`))
    document.head.appendChild(s)
  })
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'mini-app'
}

/**
 * Host-side handshake listener. The mini app (via its SDK) posts an object
 * message on `window`; the host must respond with a matching `requestId`
 * carrying `payload` (success) or `error` (failure), otherwise the SDK's
 * `pending` hashmap never resolves and the handshake times out.
 *
 * SDK transport (sewa-sdk.min.js: G class) sends via `window.parent.postMessage`
 * and listens via `window.addEventListener("message")` filtered by
 * `isFromAllowedOrigin` and `Y(t.data)` (Le validator). The reply must have:
 *  channel="gov-platform-sdk", type="response", namespace, action, source="shell",
 *  target=miniAppId, requestId, gsaProtocolVersion, traceId, timestamp, payload
 * and pass `Le` validation or `handleIncomingMessage` drops it and times out.
 */
let handshakeInstalled = false

export function installHandshakeListener(): void {
  if (handshakeInstalled) return
  handshakeInstalled = true
  window.addEventListener('message', async (e: MessageEvent) => {
    const parsed = parseMessage(e.data)
    if (!parsed.valid) return
    const m = parsed.message!
    // Only handle messages targeted to the host. SDK sends target="shell".
    if (typeof m.target === 'string' && m.target !== '*' && m.target !== 'shell') {
      return
    }
    // Same-window (Shadow DOM, not an iframe): the SDK's DefaultTransport
    // posts via `window.parent` (which IS this window). `e.source` may
    // be `window` itself (same-window postMessage sets source = the sender
    // Window) or `null` for certain cross-origin / synthetic messages.
    const source = (e.source as Window | null) || (window as unknown as Window)
    console.info('[host:listener] message received:', m.namespace + '.' + m.action, 'from', e.origin)

    // Handshake is always allowed (core) but advertises current drawer toggles
    if (m.type === 'handshake' && m.action === 'connect') {
      const caps = getHandshakeCapabilities()
      try {
        source.postMessage(
          {
            channel: 'gov-platform-sdk',
            requestId: m.requestId,
            type: 'response',
            namespace: m.namespace,
            action: m.action,
            source: 'shell',
            target: m.source,
            gsaProtocolVersion: PROTOCOL_VERSION,
            traceId: m.traceId,
            timestamp: Date.now(),
            payload: { status: 'ok', protocolVersion: PROTOCOL_VERSION, capabilities: caps },
          },
          '*',
        )
      } catch (err) {
        console.error('[host] failed to respond to handshake', err)
      }
      return
    }

    // All other namespaces/actions go through the mock handlers which check
    // the drawer toggle via isActionAllowed(). Separate file as requested.
    try {
      const payload = await handleMockRequest(m.namespace!, m.action!, m.payload, m.source)
      source.postMessage(
        {
          channel: 'gov-platform-sdk',
          requestId: m.requestId,
          type: 'response',
          namespace: m.namespace,
          action: m.action,
          source: 'shell',
          target: m.source,
          gsaProtocolVersion: PROTOCOL_VERSION,
          traceId: m.traceId,
          timestamp: Date.now(),
          payload,
        },
        '*',
      )
    } catch (err) {
      const ce = err as Error & { code?: string }
      source.postMessage(
        {
          channel: 'gov-platform-sdk',
          requestId: m.requestId,
          type: 'response',
          namespace: m.namespace,
          action: m.action,
          source: 'shell',
          target: m.source,
          gsaProtocolVersion: PROTOCOL_VERSION,
          traceId: m.traceId,
          timestamp: Date.now(),
          error: {
            code: ce.code ?? 'PERMISSION_DENIED',
            message: ce.message ?? String(err),
            retryable: false,
          },
        },
        '*',
      )
    }
  })
}
