/**
 * Mock host implementations for all SDK RPCs.
 * Separate file as requested - pre-defined device APIs and others that
 * only succeed when their capability toggle is true.
 *
 * Mirrors `shell/src/platform/services/device.ts` and `rpc-server.ts:registerMethods`
 * but with deterministic stubs so the playground works without a real shell.
 */

import { isActionAllowed } from './capabilities'
import { getLocale, getTheme, setThemePreference, subscribeEvent, toggleTheme, unsubscribeEvent } from './appearance'

// ---------------------------------------------------------------------------
// In-memory storage (mirrors shell storage service, but local)
// ---------------------------------------------------------------------------

const memoryStorage = new Map<string, string>()

function storageGet(key: string): string | null {
  try {
    return memoryStorage.get(key) ?? localStorage.getItem(`playground:${key}`) ?? null
  } catch (_e) {
    void _e
    return memoryStorage.get(key) ?? null
  }
}
function storageSet(key: string, value: string) {
  memoryStorage.set(key, value)
  try {
    localStorage.setItem(`playground:${key}`, value)
  } catch (_e) {
    void _e
  }
}
function storageRemove(key: string) {
  memoryStorage.delete(key)
  try {
    localStorage.removeItem(`playground:${key}`)
  } catch (_e) {
    void _e
  }
}

// ---------------------------------------------------------------------------
// Helpers: mock blob URLs for device stubs
// ---------------------------------------------------------------------------

function placeholderImageUrl(label = 'mock'): string {
  // 1x1 transparent PNG as blob so <img src> works inside shadow DOM without CORS
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#6366f1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="18" font-family="sans-serif">${label}</text></svg>`
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  return URL.createObjectURL(blob)
}

function placeholderFileUrl(fileName: string, mime = 'application/pdf'): string {
  const blob = new Blob([`Mock file content for ${fileName}`], { type: mime })
  return URL.createObjectURL(blob)
}

function nowIso() {
  return new Date().toISOString()
}

// ---------------------------------------------------------------------------
// Capability-gated error
// ---------------------------------------------------------------------------

class CapabilityError extends Error {
  code = 'PERMISSION_DENIED'
  retryable = false
  constructor(message: string) {
    super(message)
    this.name = 'CapabilityError'
  }
}

function ensureAllowed(namespace: string, action: string) {
  if (!isActionAllowed(namespace, action)) {
    throw new CapabilityError(
      `${namespace}.${action} not allowed - enable "${namespace}${action ? '.' + action : ''}" in Capabilities drawer`,
    )
  }
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export async function handleMockRequest(
  namespace: string,
  action: string,
  payload: unknown,
  moduleId?: string,
): Promise<unknown> {
  const key = `${namespace}.${action}`
  // Always allow handshake - handled separately - but guard others
  if (namespace !== 'handshake') {
    ensureAllowed(namespace, action)
  }

  switch (key) {
    // ----- platform -----
    case 'platform.getType': {
      return { type: 'web' as const, appearance: null }
    }

    // ----- appearance (delegates to host appearance store - see src/lib/appearance.ts) -----
    case 'appearance.getTheme': {
      return getTheme()
    }
    case 'appearance.getLocale': {
      return getLocale()
    }
    case 'appearance.setThemePreference': {
      // Not part of stock SDK but supported for playground `useTheme().setPreference`
      const pref =
        (payload as { preference?: string; theme?: string })?.preference ??
        (payload as { theme?: string })?.theme
      if (pref === 'light' || pref === 'dark' || pref === 'system') setThemePreference(pref as never)
      return getTheme()
    }
    case 'appearance.toggleTheme': {
      toggleTheme()
      return getTheme()
    }

    // ----- auth -----
    case 'auth.getUser': {
      return { id: 'guest', name: 'Guest', email: 'guest@playground.local', isAuthenticated: true }
    }
    case 'auth.isAuthenticated': {
      return true
    }
    case 'auth.logout': {
      return null
    }

    // ----- config -----
    case 'config.getAll': {
      return { playground: true, env: 'sandbox' }
    }
    case 'config.get': {
      const k = (payload as { key?: string })?.key
      if (!k) return undefined
      const all: Record<string, unknown> = { playground: true, env: 'sandbox', theme: 'light' }
      return all[k]
    }

    // ----- flags -----
    case 'flags.isEnabled': {
      return false
    }
    case 'flags.getAll': {
      return {}
    }

    // ----- permissions (deprecated) -----
    case 'permissions.has': {
      console.warn('[deprecated] permissions.has is deprecated and will be removed in a future major version')
      return false
    }
    case 'permissions.list': {
      console.warn('[deprecated] permissions.list is deprecated and will be removed in a future major version')
      return []
    }

    // ----- navigation -----
    case 'navigation.navigate':
    case 'navigation.router':
    case 'navigation.getCurrent':
    case 'navigation.back':
    case 'navigation.push': {
      if (key === 'navigation.getCurrent') return { app: 'playground', route: '/', params: {} }
      return null
    }

    // ----- device: location -----
    case 'device.location': {
      // Try real geolocation if available, fallback to mock Kathmandu
      try {
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            const opts = payload as { highAccuracy?: boolean; timeout?: number } | undefined
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: opts?.highAccuracy ?? false,
              timeout: opts?.timeout ?? 3000,
            })
          })
          return {
            status: 'granted' as const,
            data: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: new Date(pos.timestamp).toISOString(),
            },
          }
        }
      } catch (_e) {
        void _e
        // fall through to mock
      }
      return {
        status: 'granted' as const,
        data: {
          latitude: 27.7172,
          longitude: 85.324,
          accuracy: 12,
          timestamp: nowIso(),
        },
      }
    }

    // ----- device: camera -----
    case 'device.camera': {
      const url = placeholderImageUrl('camera')
      return {
        status: 'granted' as const,
        data: {
          url,
          fileName: `camera-${Date.now()}.jpg`,
          mimeType: 'image/jpeg',
          byteSize: 42000,
          previewUrl: url,
        },
      }
    }

    // ----- device: gallery -----
    case 'device.gallery': {
      const images = [placeholderImageUrl('gallery-1'), placeholderImageUrl('gallery-2')].map((url, i) => ({
        url,
        previewUrl: url,
        fileName: `gallery-${i + 1}.jpg`,
        mimeType: 'image/jpeg',
        byteSize: 58000 + i * 1000,
      }))
      return {
        status: 'granted' as const,
        data: { images },
      }
    }

    // ----- device: files -----
    case 'device.files': {
      const files = [
        {
          url: placeholderFileUrl('document.pdf'),
          previewUrl: placeholderFileUrl('document.pdf'),
          fileName: 'document.pdf',
          mimeType: 'application/pdf',
          extension: 'pdf',
          byteSize: 12400,
        },
        {
          url: placeholderFileUrl('report.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
          previewUrl: placeholderFileUrl('report.docx'),
          fileName: 'report.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          extension: 'docx',
          byteSize: 9800,
        },
      ]
      return {
        status: 'granted' as const,
        data: { files },
      }
    }

    // ----- device: download -----
    case 'device.download': {
      const p = payload as { url?: string; fileName?: string; mimeType?: string } | undefined
      const fileName = p?.fileName ?? 'download.pdf'
      const url = p?.url ? p.url : placeholderFileUrl(fileName, p?.mimeType)
      // Trigger real download in host if File System Access available? For mock just return.
      return {
        status: 'granted' as const,
        data: {
          file: {
            url,
            previewUrl: url,
            fileName,
            mimeType: p?.mimeType ?? 'application/pdf',
            extension: fileName.split('.').pop() ?? 'pdf',
            byteSize: 2048,
          },
          saved: false,
        },
      }
    }

    // ----- device: contact -----
    case 'device.contact': {
      return {
        status: 'granted' as const,
        data: {
          contactName: 'Playground Contact',
          number: '+977-9800000000',
        },
      }
    }

    // ----- device: biometric -----
    case 'device.biometric': {
      return {
        status: 'granted' as const,
        data: { success: true },
      }
    }

    case 'device.notifications': {
      return { status: 'granted' as const, data: { granted: true } }
    }
    case 'device.network': {
      return {
        status: 'granted' as const,
        data: { online: typeof navigator !== 'undefined' ? navigator.onLine : true, type: 'wifi' as const },
      }
    }
    case 'device.info': {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : 'playground'
      return {
        status: 'granted' as const,
        data: {
          platform: 'WEB' as const,
          osVersion: '',
          appVersion: '1.0.0',
          deviceModel: ua.slice(0, 80),
          locale: typeof navigator !== 'undefined' ? navigator.language : 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }
    }

    // ----- storage -----
    case 'storage.get': {
      const k = (payload as { key?: string })?.key
      if (!k) throw new CapabilityError('Missing key for storage.get')
      return storageGet(k)
    }
    case 'storage.set': {
      const { key, value } = payload as { key?: string; value?: string } | undefined ?? {}
      if (!key) throw new CapabilityError('Missing key for storage.set')
      storageSet(key, value ?? '')
      return null
    }
    case 'storage.remove': {
      const k = (payload as { key?: string })?.key
      if (!k) throw new CapabilityError('Missing key for storage.remove')
      storageRemove(k)
      return null
    }

    // ----- http -----
    case 'http.get':
    case 'http.post':
    case 'http.put':
    case 'http.patch':
    case 'http.delete':
    case 'http.stream':
    case 'http.getStream': {
      const p = payload as { endpoint?: string; url?: string; body?: unknown; headers?: Record<string, string>; query?: Record<string, string> } | undefined
      const endpoint = p?.endpoint ?? p?.url ?? '/api/mock'
      // Try real fetch for http.* so playground can hit real APIs if CORS allows
      try {
        const method = action.toUpperCase() === 'GETSTREAM' ? 'GET' : action.toUpperCase()
        const url = p?.query ? `${endpoint}?${new URLSearchParams(p.query).toString()}` : endpoint
        // Only attempt fetch if endpoint looks like URL
        if (/^https?:\/\//.test(url)) {
          const res = await fetch(url, {
            method: method === 'GET' ? 'GET' : method,
            headers: p?.headers,
            body: p?.body ? JSON.stringify(p.body) : undefined,
          })
          const text = await res.text()
          let data: unknown
          try {
            data = JSON.parse(text)
          } catch (_e) {
            void _e
            data = text
          }
          const headers: Record<string, string> = {}
          res.headers.forEach((v, k) => (headers[k] = v))
          return { status: res.status, data, headers, url, links: { requestUrl: url, self: endpoint } }
        }
      } catch (_e) {
        void _e
        // fall through to mock
      }
      return {
        status: 200,
        data: { message: `mock ${key} response`, endpoint, received: p },
        headers: { 'content-type': 'application/json' },
        url: endpoint,
        links: { requestUrl: endpoint, self: endpoint },
      }
    }

    // ----- api -----
    case 'api.request': {
      const p = payload as { method?: string; path?: string; endpoint?: string; body?: unknown; headers?: Record<string, string> } | undefined
      const path = p?.path ?? p?.endpoint ?? '/api/mock'
      // Mock - echo back
      return { status: 200, data: { mocked: true, path, body: p?.body }, headers: {} }
    }

    // ----- ai -----
    case 'ai.chat':
    case 'ai.cancel': {
      return { reply: 'Mock AI response from host playground' }
    }

    // ----- heartbeat -----
    case 'heartbeat.ping': {
      return 'pong' as const
    }

    // ----- event (host tracks subscriptions so appearance broadcasts reach the mini app) -----
    case 'event.subscribe': {
      const t = (payload as { eventType?: string; type?: string })?.eventType ?? (payload as { type?: string })?.type
      if (t && moduleId) subscribeEvent(moduleId, t)
      return true
    }
    case 'event.unsubscribe': {
      const t = (payload as { eventType?: string })?.eventType ?? ''
      if (t && moduleId) unsubscribeEvent(moduleId, t as string)
      return true
    }
    case 'event.emit': {
      return true
    }

    // ----- notifications / links (stubs) -----
    case 'notifications.register':
    case 'links.open': {
      return { status: 'granted' as const }
    }

    default: {
      // Unknown method - still check capability, then return generic ok
      // so the mini app doesn't hang waiting for a response
      return { status: 'ok' as const, protocolVersion: '1.0.0', capabilities: null }
    }
  }
}

export { CapabilityError }
