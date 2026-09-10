import type { SdkSource } from '../types'

/**
 * Available SDK versions for the dropdown. Every version resolves to the
 * jsDelivr CDN and the version is injected into the URL template at runtime.
 *
 * IMPORTANT: this module must stay free of top-level `await`. It is imported
 * by the Docusaurus-embedded playground, where a top-level await turns the
 * whole chunk into an async module - a registry hiccup (offline, rate limit,
 * blocked network) would then take the entire docs page down, and the static
 * build would hit the network on every render. Instead we ship a static list
 * and refresh it lazily in the browser via `loadSdkSources()`.
 */
const CDN_TEMPLATE = 'https://cdn.jsdelivr.net/npm/@lizuz/sewa-sdk@{version}/dist/sewa-sdk.min.js'
const REGISTRY_URL = 'https://registry.npmjs.org/@lizuz%2Fsewa-sdk'

/** Newest first - same ordering `loadSdkSources()` produces once npm answers. */
export const FALLBACK_SDK_VERSIONS = ['1.0.9', '1.0.8', '1.0.7', '1.0.6', '1.0.4']

export function sdkSourceFor(version: string): SdkSource {
  return { version, url: CDN_TEMPLATE.replace('{version}', version) }
}

/** Synchronous default list. Safe during SSR and before the registry responds. */
export const SDK_SOURCES: SdkSource[] = FALLBACK_SDK_VERSIONS.map(sdkSourceFor)

/** Newest version the UI preselects. */
export const DEFAULT_SDK_VERSION = FALLBACK_SDK_VERSIONS[0]

/**
 * npm returns `versions` in publish order (oldest first) and mixes in
 * prereleases, so sort descending and rank a release above its prereleases.
 */
function compareVersionsDesc(a: string, b: string): number {
  const split = (v: string) => {
    const [core, pre = ''] = v.split('-')
    return { nums: core.split('.').map((n) => Number.parseInt(n, 10) || 0), pre }
  }
  const va = split(a)
  const vb = split(b)
  for (let i = 0; i < Math.max(va.nums.length, vb.nums.length); i++) {
    const d = (vb.nums[i] ?? 0) - (va.nums[i] ?? 0)
    if (d !== 0) return d
  }
  if (va.pre === vb.pre) return 0
  if (!va.pre) return -1
  if (!vb.pre) return 1
  return vb.pre.localeCompare(va.pre)
}

export async function getSdkPublishedVersions(): Promise<string[]> {
  const response = await fetch(REGISTRY_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch SDK versions: ${response.status}`)
  }
  const data = (await response.json()) as { versions?: Record<string, unknown> }
  return Object.keys(data.versions ?? {}).sort(compareVersionsDesc)
}

let pending: Promise<SdkSource[]> | null = null

/**
 * Live version list, fetched once per page and cached. Never rejects - falls
 * back to {@link SDK_SOURCES} so the dropdown always has something usable.
 */
export function loadSdkSources(): Promise<SdkSource[]> {
  if (typeof window === 'undefined') return Promise.resolve(SDK_SOURCES)
  if (!pending) {
    pending = getSdkPublishedVersions()
      .then((versions) => (versions.length ? versions.map(sdkSourceFor) : SDK_SOURCES))
      .catch(() => SDK_SOURCES)
  }
  return pending
}

export function resolveSdkSource(version: string): SdkSource {
  return sdkSourceFor(version)
}
