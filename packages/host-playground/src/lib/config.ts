import type { PlaygroundConfig } from '../types'
import { DEFAULT_SDK_VERSION } from './sdk-sources'

/** Nothing configured yet — the sandbox shows its empty state. */
export const EMPTY_CONFIG: PlaygroundConfig = {
  name: '',
  manifestUrl: '',
  sdkVersion: DEFAULT_SDK_VERSION,
}

/** A config the runtime loader can actually act on. */
export function isValidConfig(c: PlaygroundConfig | null | undefined): boolean {
  return Boolean(c?.name?.trim() && c?.manifestUrl?.trim())
}
