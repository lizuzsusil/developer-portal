/**
 * Minimal host appearance controller for the playground.
 * Mirrors `shell/src/platform/appearance-controller.ts` but without
 * cookies/EventBus — it owns theme + locale, writes `data-theme`/`dir`/`lang`
 * to the DOM, and broadcasts `appearance.theme.changed` /
 * `appearance.locale.changed` to mini apps that subscribed via
 * `event.subscribe`. No mini-app code change needed — the SDK's
 * `appearance.getTheme()` + `eventBus.subscribe("appearance.theme.changed")`
 * pattern (the `useTheme()` hook you posted) just works.
 *
 * Host only exposes the event; the mini app's `useTheme` does:
 *   const [theme,setTheme]=useState(()=>appearance.getTheme())
 *   useEffect(()=>eventBus.subscribe("appearance.theme.changed",()=>setTheme(appearance.getTheme())),[])
 * So toggling here immediately updates every mounted mini app.
 */

import { PROTOCOL_VERSION } from './sdk-protocol'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ThemeState = { preference: ThemePreference; mode: 'light' | 'dark' }
export type LocaleState = { locale: string; language: string; direction: 'ltr' | 'rtl' }

const THEME_KEY = 'playground-theme'
const LOCALE_KEY = 'playground-locale'

function prefersDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
}
function resolveMode(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'system') return prefersDark() ? 'dark' : 'light'
  return pref
}
function readThemePreference(): ThemePreference {
  if (typeof localStorage === 'undefined') return 'light'
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch (_e) {
    void _e
  }
  return 'light'
}
function readLocale(): LocaleState {
  if (typeof localStorage === 'undefined') return { locale: 'en', language: 'en', direction: 'ltr' }
  try {
    const v = localStorage.getItem(LOCALE_KEY)
    if (v) return JSON.parse(v) as LocaleState
  } catch (_e) {
    void _e
  }
  return { locale: 'en', language: 'en', direction: 'ltr' }
}

let preference: ThemePreference = readThemePreference()
let themeState: ThemeState = { preference, mode: resolveMode(preference) }
let localeState: LocaleState = readLocale()

/**
 * Element the appearance state is reflected onto.
 *
 * Standalone: `<html>`, exactly like the production shell.
 * Embedded in the docs: the playground's own root element — writing
 * `data-theme` / `dir` / `lang` to `<html>` there would flip the entire
 * Docusaurus site (it drives its own light/dark off `<html data-theme>`),
 * so `HostPlaygroundApp` calls `setAppearanceRoot()` on mount to contain it.
 */
let appearanceRoot: HTMLElement | null = null

export function setAppearanceRoot(el: HTMLElement | null): void {
  appearanceRoot = el
  applyDom()
}

function applyDom() {
  if (typeof document === 'undefined') return
  const el = appearanceRoot ?? document.documentElement
  el.setAttribute('data-theme', themeState.mode)
  el.setAttribute('dir', localeState.direction)
  el.setAttribute('lang', localeState.locale)
  // also reflect on host playground shell for visual feedback
  el.style.colorScheme = themeState.mode
}

// ---------------------------------------------------------------------------
// Event subscription bookkeeping — per mini-app `event.subscribe` payload
// ---------------------------------------------------------------------------

type SubKey = string // moduleId
const subs = new Map<SubKey, Set<string>>()

export function subscribeEvent(moduleId: string, eventType: string) {
  if (!subs.has(moduleId)) subs.set(moduleId, new Set())
  subs.get(moduleId)!.add(eventType)
}
export function unsubscribeEvent(moduleId: string, eventType: string) {
  subs.get(moduleId)?.delete(eventType)
}
function isSubscribed(moduleId: string, type: string): boolean {
  const s = subs.get(moduleId)
  if (!s) return false
  if (s.has(type) || s.has('*')) return true
  // wildcard "appearance.*"
  for (const pat of s) if (pat.endsWith('*') && type.startsWith(pat.slice(0, -1))) return true
  return false
}

function genId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return Math.random().toString(36).slice(2, 10)
  }
}
function broadcast(type: string, payload: unknown) {
  const [namespace, ...rest] = type.split(".");
  const action = rest.join(".");

  if (!namespace || !action) return;

  for (const moduleId of subs.keys()) {
    if (!isSubscribed(moduleId, type)) continue;

    const msg = {
      channel: "gov-platform-sdk",
      requestId: genId(),
      type: "event" as const,
      namespace,
      action,
      source: "shell" as const,
      target: moduleId,
      gsaProtocolVersion: PROTOCOL_VERSION,
      traceId: genId(),
      timestamp: Date.now(),
      payload,
    };

    try {
      window.postMessage(msg, "*");
    } catch (_e) {
      void _e;
    }
  }
}

// ---------------------------------------------------------------------------
// Public API — mirrors AppearanceController
// ---------------------------------------------------------------------------

export function getTheme(): ThemeState {
  return { ...themeState }
}
export function getLocale(): LocaleState {
  return { ...localeState }
}
export function setThemePreference(next: ThemePreference) {
  preference = next
  try {
    localStorage?.setItem(THEME_KEY, next)
  } catch (_e) {
    void _e
  }
  themeState = { preference, mode: resolveMode(preference) }
  applyDom()
  notifyAppearance()
  broadcast('appearance.theme.changed', getTheme())
}
export function toggleTheme() {
  setThemePreference(themeState.mode === 'dark' ? 'light' : 'dark')
}
export function setLocale(next: Partial<LocaleState> & { locale: string }) {
  localeState = {
    locale: next.locale,
    language: next.language ?? next.locale.split('-')[0] ?? 'en',
    direction: next.direction ?? localeState.direction,
  }
  try {
    localStorage?.setItem(LOCALE_KEY, JSON.stringify(localeState))
  } catch (_e) {
    void _e
  }
  applyDom()
  notifyAppearance()
  broadcast('appearance.locale.changed', getLocale())
}

// system sync
if (typeof window !== 'undefined' && window.matchMedia) {
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (preference === 'system') {
        themeState = { preference, mode: resolveMode(preference) }
        applyDom()
        notifyAppearance()
        broadcast('appearance.theme.changed', getTheme())
      }
    })
  } catch (_e) {
    void _e
  }
}

// ---------------------------------------------------------------------------
// Local subscribers — the playground header keeps its toggle in sync without
// polling `getTheme()` on an interval.
// ---------------------------------------------------------------------------

type AppearanceListener = () => void
const appearanceListeners = new Set<AppearanceListener>()

export function subscribeAppearance(listener: AppearanceListener): () => void {
  appearanceListeners.add(listener)
  return () => {
    appearanceListeners.delete(listener)
  }
}

function notifyAppearance() {
  for (const l of appearanceListeners) l()
}

// initial apply
applyDom()
