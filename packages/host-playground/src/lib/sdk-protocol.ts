import type { SdkSource } from '../types'

/**
 * The Mini App SDK (v1) hands the host an object-shaped config
 * `window.__GSA_SDK__` that it reads at boot. The required field is
 * `miniAppId`; the SDK pins its host origin via `targetOrigin` (see
 * `et = {allowedOrigin: ve.targetOrigin}` in the minified bundle), and the
 * RPC client uses `window.parent.postMessage`.
 *
 * Mirrors `shell/src/platform/sdk/bootstrap/core.ts:33 seedSdkConfig`:
 *  - `window.__GSA_SDK__` = { miniAppId, timeout, retryAttempts, retryDelayMs, maxRetryDelayMs, targetOrigin }
 *  - `window.__GSA_HOST_DESCRIPTOR__` = { type, version, capabilities, sdkVersion }
 * The SDK overwrites `window.__GSA_SDK__` with the live instance after load
 * and reads the descriptor separately — do not merge them.
 */

export const MESSAGE_CHANNEL = 'gov-platform-sdk'
export const PROTOCOL_VERSION = '1.0.0'
export const HOST_TARGET = 'shell'

export interface HostHandshakeResponse {
  miniAppId: string
  sdkVersion: string
  capabilities: string[]
  protocolVersion: string
  allowedOrigin: string
  devMode: boolean
}

export function buildSdkGlobalConfig(
  miniAppId: string,
  _sdk: SdkSource,
  _protocolVersion: string,
): Record<string, unknown> {
  void _sdk
  void _protocolVersion
  return {
    miniAppId,
    timeout: 10_000,
    retryAttempts: 5,
    retryDelayMs: 500,
    maxRetryDelayMs: 10_000,
    targetOrigin: typeof window !== 'undefined' ? window.location.origin : '*',
  }
}

export function buildHostDescriptor(
  sdk: SdkSource,
  protocolVersion: string,
): Record<string, unknown> {
  return {
    type: 'web' as const,
    version: protocolVersion,
    capabilities: [
      'auth',
      'permissions',
      'flags',
      'config',
      'navigation',
      'platform',
      'device',
      'api',
      'storage',
      'http',
      'appearance',
      'ai',
      'notifications',
      'links',
      'event',
      'heartbeat',
    ],
    sdkVersion: sdk.version,
  }
}

/**
 * The SDK's handshake response expects these fields (pulled from the
 * minified code — `completeHandshake`/`Y` validators):
 *   - status: 'ok' or 'rejected'
 *   - capabilities: string[] (a subset of the SDK's NAMESPACES)
 *   - protocolVersion: string (major version must match "1")
 * The mini app then manually probes `config.getAll`, `platform.getType`,
 * then `appearance.getTheme` — the host should respond to those, otherwise
 * the SDK's `runInitializeSequence` hangs on `getTheme`.
 */
export function parseMessage(data: unknown): {
  valid: boolean
  message?: {
    channel?: string
    requestId?: string
    type?: string
    namespace?: string
    action?: string
    source?: string
    target?: string
    payload?: unknown
    error?: { code?: string; message?: string; retryable?: boolean }
    gsaProtocolVersion?: string
    traceId?: string
    timestamp?: number
  }
} {
  if (typeof data !== 'object' || data === null) {
    return { valid: false, message: undefined }
  }
  const m = data as {
    channel?: string
    requestId?: string
    type?: string
    namespace?: string
    action?: string
    source?: string
    target?: string
    payload?: unknown
    error?: { code?: string; message?: string; retryable?: boolean }
    gsaProtocolVersion?: string
    traceId?: string
    timestamp?: number
  }
  const error = m.error as { code?: string; message?: string; retryable?: boolean } | undefined
  m.error = error
  const isNonEmpty = (s: unknown): s is string => typeof s === 'string' && s.length > 0
  if (!isNonEmpty(m.channel) || m.channel !== MESSAGE_CHANNEL) {
    return { valid: false, message: m }
  }
  if (!isNonEmpty(m.requestId)) {
    return { valid: false, message: m }
  }
  const validTypes = new Set(['request', 'response', 'event', 'handshake', 'stream'])
  if (!isNonEmpty(m.type) || !validTypes.has(m.type)) {
    return { valid: false, message: m }
  }
  if (!isNonEmpty(m.namespace) || !isNonEmpty(m.action)) {
    return { valid: false, message: m }
  }
  if (!isNonEmpty(m.source) || !isNonEmpty(m.target)) {
    return { valid: false, message: m }
  }
  if (!isNonEmpty(m.gsaProtocolVersion) || !isNonEmpty(m.traceId)) {
    return { valid: false, message: m }
  }
  if (typeof m.timestamp !== 'number' || !Number.isFinite(m.timestamp)) {
    return { valid: false, message: m }
  }
  return { valid: true, message: m }
}
