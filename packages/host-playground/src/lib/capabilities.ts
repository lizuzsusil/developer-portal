/**
 * Central capability store - single source of truth for drawer toggles
 * and host RPC gating. Mirrors the shell's capability resolution
 * (packages/host-platform/src/rpc/capabilities.ts) but driven by the
 * playground drawer instead of a signed registry manifest.
 *
 * Drawer toggles `location=true` => `device.location` is advertised in the
 * handshake and `device.location` requests succeed. `false` => handshake
 * omits `device` (if no device sub-capability enabled) and requests get
 * `PERMISSION_DENIED`.
 *
 * Used by:
 *  - RightDrawer.tsx (UI)
 *  - mock-handlers.ts / runtime-loader.ts (host RPC)
 */

export interface Capability {
  id: string
  name: string
  description: string
  enabled: boolean
  locked?: boolean
  /** SDK namespace this toggle controls, e.g. "device", "http" */
  namespace: string
  /** Specific action, e.g. "location" for device.location. Undefined => whole namespace. */
  action?: string
}

// ---------------------------------------------------------------------------
// Definitions (initial state)
// ---------------------------------------------------------------------------

export const CORE_CAPABILITIES: Capability[] = [
  {
    id: 'handshake',
    name: 'Handshake',
    description: 'Establish secure communication with the host.',
    enabled: true,
    locked: true,
    namespace: 'handshake',
  },
  {
    id: 'platform',
    name: 'Platform',
    description: 'Access host platform and runtime information.',
    enabled: true,
    locked: true,
    namespace: 'platform',
  },
  {
    id: 'event',
    name: 'Events',
    description: 'Communicate through host application events.',
    enabled: true,
    locked: true,
    namespace: 'event',
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Read host theme and locale.',
    enabled: true,
    locked: true,
    namespace: 'appearance',
  },
  {
    id: 'navigation',
    name: 'Navigation',
    description: 'Navigate between host and mini-app routes.',
    enabled: true,
    locked: true,
    namespace: 'navigation',
  },
  {
    id: 'auth',
    name: 'Authentication',
    description: 'Use the host authentication session.',
    enabled: true,
    locked: true,
    namespace: 'auth',
  },
]

export const DEVICE_CAPABILITIES: Capability[] = [
  {
    id: 'location',
    name: 'Location',
    description: 'Access the device location when required.',
    enabled: false,
    namespace: 'device',
    action: 'location',
  },
  {
    id: 'camera',
    name: 'Camera',
    description: 'Capture photos and videos using the device camera.',
    enabled: false,
    namespace: 'device',
    action: 'camera',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Select images and videos from the device.',
    enabled: false,
    namespace: 'device',
    action: 'gallery',
  },
  {
    id: 'files',
    name: 'Files',
    description: 'Pick documents and files from the device.',
    enabled: false,
    namespace: 'device',
    action: 'files',
  },
  {
    id: 'download',
    name: 'Download',
    description: 'Download files through the host.',
    enabled: false,
    namespace: 'device',
    action: 'download',
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Access contacts available on the device.',
    enabled: false,
    namespace: 'device',
    action: 'contact',
  },
  {
    id: 'biometric',
    name: 'Biometric',
    description: 'Authenticate with fingerprint / biometrics.',
    enabled: false,
    namespace: 'device',
    action: 'biometric',
  },
]

export const OTHER_CAPABILITIES: Capability[] = [
  {
    id: 'http',
    name: 'HTTP Requests',
    description: 'Make network requests through the host.',
    enabled: true,
    namespace: 'http',
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Store and retrieve app-specific data.',
    enabled: true,
    namespace: 'storage',
  },
  {
    id: 'api',
    name: 'API',
    description: 'Call host-proxied backend APIs.',
    enabled: true,
    namespace: 'api',
  },
  {
    id: 'config',
    name: 'Config',
    description: 'Read host configuration values.',
    enabled: true,
    namespace: 'config',
  },
  {
    id: 'flags',
    name: 'Feature Flags',
    description: 'Check feature flags via host.',
    enabled: true,
    namespace: 'flags',
  },
  {
    id: 'permissions',
    name: 'Permissions [Deprecated]',
    description: '[Deprecated] Query host permissions - will be removed in a future major version.',
    enabled: true,
    namespace: 'permissions',
  },
]

// ---------------------------------------------------------------------------
// Store (in-memory, pub/sub)
// ---------------------------------------------------------------------------

type Listener = () => void

const capabilityMap = new Map<string, Capability>()

function seed() {
  for (const c of [...CORE_CAPABILITIES, ...DEVICE_CAPABILITIES, ...OTHER_CAPABILITIES]) {
    capabilityMap.set(c.id, { ...c })
  }
}
seed()

const listeners = new Set<Listener>()

function notify() {
  for (const l of listeners) l()
}

export function getAllCapabilities(): {
  core: Capability[]
  device: Capability[]
  other: Capability[]
} {
  const core: Capability[] = []
  const device: Capability[] = []
  const other: Capability[] = []
  for (const c of CORE_CAPABILITIES) core.push({ ...capabilityMap.get(c.id)! })
  for (const c of DEVICE_CAPABILITIES) device.push({ ...capabilityMap.get(c.id)! })
  for (const c of OTHER_CAPABILITIES) other.push({ ...capabilityMap.get(c.id)! })
  return { core, device, other }
}

export function getCapability(id: string): Capability | undefined {
  const c = capabilityMap.get(id)
  return c ? { ...c } : undefined
}

export function isCapabilityEnabled(id: string): boolean {
  return capabilityMap.get(id)?.enabled ?? false
}

export function setCapabilityEnabled(id: string, enabled: boolean): void {
  const cur = capabilityMap.get(id)
  if (!cur || cur.locked) return
  if (cur.enabled === enabled) return
  capabilityMap.set(id, { ...cur, enabled })
  notify()
}

export function toggleCapability(id: string): void {
  const cur = capabilityMap.get(id)
  if (!cur || cur.locked) return
  setCapabilityEnabled(id, !cur.enabled)
}

export function subscribeCapabilities(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// ---------------------------------------------------------------------------
// Gating helpers - used by mock-handlers / runtime-loader
// ---------------------------------------------------------------------------

const CORE_NAMESPACES = new Set(CORE_CAPABILITIES.map((c) => c.namespace))

/**
 * Returns true if the given namespace.action is allowed by current toggles.
 * Core namespaces are always allowed. For others, check if any capability
 * with matching namespace (and action if specified) is enabled.
 */
export function isActionAllowed(namespace: string, action: string): boolean {
  const ns = namespace.trim().toLowerCase()
  const act = action.trim().toLowerCase()
  if (CORE_NAMESPACES.has(ns)) return true

  for (const cap of capabilityMap.values()) {
    if (cap.namespace !== ns) continue
    if (cap.locked && cap.enabled) return true
    if (!cap.enabled) continue
    // If capability has no specific action, it grants whole namespace
    if (!cap.action) return true
    if (cap.action.toLowerCase() === act) return true
    // wildcard like "device.*" not needed here, but support
    if (cap.action === '*') return true
  }
  return false
}

/**
 * Capabilities to advertise in the handshake `capabilities` payload.
 * Returns a deduped list of namespaces/actions that are currently enabled.
 * Core are always included. For device, if any sub-action enabled, the
 * host advertises "device" plus granular "device.location" etc., so the
 * SDK's dev warning respects it and the shell's `isCapabilityGranted` style
 * check passes.
 */
export function getHandshakeCapabilities(): string[] {
  const out = new Set<string>()
  // core always
  for (const c of CORE_CAPABILITIES) out.add(c.namespace)
  // add enabled capabilities
  for (const cap of capabilityMap.values()) {
    if (!cap.enabled) continue
    if (cap.locked) continue // already added
    if (cap.action) {
      out.add(cap.namespace) // top-level namespace for SDK warning
      out.add(`${cap.namespace}.${cap.action}`)
    } else {
      out.add(cap.namespace)
    }
  }
  // always include heartbeat/event helpers expected by SDK
  out.add('heartbeat')
  out.add('event')
  // extra namespaces the playground always serves when their toggle on
  return Array.from(out)
}

export function getEnabledCapabilityIds(): string[] {
  return Array.from(capabilityMap.values())
    .filter((c) => c.enabled)
    .map((c) => c.id)
}
