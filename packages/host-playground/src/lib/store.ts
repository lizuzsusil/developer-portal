import type { PlaygroundConfig } from '../types'

const STORAGE_KEY = 'host-playground:lastConfig'

/**
 * Last config the vendor submitted, remembered across reloads.
 *
 * Read lazily rather than at module scope: this module is imported by the
 * docs-embedded playground, which is also evaluated during the static build
 * where `localStorage` either does not exist or is a Node experimental stub.
 */
let last: PlaygroundConfig | null = null
let hydrated = false

function readStored(): PlaygroundConfig | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PlaygroundConfig) : null
  } catch (_e) {
    void _e
    return null
  }
}

export function setLastConfig(v: PlaygroundConfig) {
  last = v
  hydrated = true
  try {
    localStorage?.setItem(STORAGE_KEY, JSON.stringify(v))
  } catch (_e) {
    void _e
  }
}

export function getLastConfig(): PlaygroundConfig | null {
  if (!hydrated) {
    last = readStored()
    hydrated = typeof localStorage !== 'undefined'
  }
  return last
}

export function clearLastConfig() {
  last = null
  hydrated = true
  try {
    localStorage?.removeItem(STORAGE_KEY)
  } catch (_e) {
    void _e
  }
}
