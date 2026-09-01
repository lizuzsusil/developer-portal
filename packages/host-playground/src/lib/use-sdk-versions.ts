import { useEffect, useState } from 'react'
import type { SdkSource } from '../types'
import { SDK_SOURCES, loadSdkSources } from './sdk-sources'

/**
 * Live SDK version list for the config dropdown. Starts with the static
 * fallback so the first paint (and any SSR pass) is deterministic, then swaps
 * in the published list from npm once it arrives.
 */
export function useSdkVersions(): SdkSource[] {
  const [sources, setSources] = useState<SdkSource[]>(SDK_SOURCES)

  useEffect(() => {
    let alive = true
    loadSdkSources().then((next) => {
      if (alive) setSources(next)
    })
    return () => {
      alive = false
    }
  }, [])

  return sources
}
