import { useEffect, useState } from 'react'
import { closeDrawer, subscribeDrawer } from '../lib/drawer'
import { useOverlayPosition } from '../embed-context'
import {
  getAllCapabilities,
  subscribeCapabilities,
  toggleCapability as toggleStoreCapability,
  type Capability,
} from '../lib/capabilities'

function CapabilityIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    handshake: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.5 12.5 6 15a2.12 2.12 0 0 0 3 3l2-2m-3-7 2.5-2.5a2.12 2.12 0 0 1 3 0l1.5 1.5m-6 6 2 2a2.12 2.12 0 0 0 3 0l3.5-3.5a2.12 2.12 0 0 0 0-3L16 7m-7 2-2-2a2.12 2.12 0 0 0-3 0l-1 1a2.12 2.12 0 0 0 0 3l3 3"
        />
      </svg>
    ),
    platform: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path strokeLinecap="round" d="M8 8h8M8 12h5M8 16h3" />
      </svg>
    ),
    event: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h4l2-7 4 14 2-7h4" />
      </svg>
    ),
    navigation: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 7 7-7 11-7-11 7-7Z" />
        <path strokeLinecap="round" d="m12 8 2 2m-2-2-2 2" />
      </svg>
    ),
    auth: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path strokeLinecap="round" d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
      </svg>
    ),
    appearance: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" d="M12 2v4M12 18v4M4 12h4M16 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
      </svg>
    ),
    camera: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" />
        <circle cx="12" cy="13.5" r="3.5" />
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    gallery: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8" cy="9" r="1.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 17 5-5 3 3 2-2 6 6" />
      </svg>
    ),
    files: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
        <path strokeLinecap="round" d="M14 3v5h5M9 13h6M9 17h6" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v14M5 12l7 7 7-7M3 21h18" />
      </svg>
    ),
    contact: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="3" />
        <path strokeLinecap="round" d="M6 20c.7-3.2 2.7-5 6-5s5.3 1.8 6 5" />
      </svg>
    ),
    contacts: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="3" />
        <path strokeLinecap="round" d="M6 20c.7-3.2 2.7-5 6-5s5.3 1.8 6 5" />
      </svg>
    ),
    biometric: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="7" />
        <path strokeLinecap="round" d="M12 8v8M8 12h8M9 9a3 3 0 0 1 6 0c0 1.5-1.5 2.2-3 3.5-1.5-1.3-3-2-3-3.5Z" />
      </svg>
    ),
    microphone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path strokeLinecap="round" d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
      </svg>
    ),
    http: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z" />
      </svg>
    ),
    storage: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path strokeLinecap="round" d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    ),
    api: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="8" width="18" height="10" rx="2" />
        <path strokeLinecap="round" d="M7 8V6a5 5 0 0 1 10 0v2M12 12v4M9 15h6" />
      </svg>
    ),
    config: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M16.66 16.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M16.66 7.34l2.12-2.12" />
      </svg>
    ),
    flags: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16M4 4h13l-2 4 2 4H4" />
      </svg>
    ),
    permissions: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" d="M12 3l7 4v6c0 4-3 6-7 7-4-1-7-3-7-7V7l7-4Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
    clipboard: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="6" y="5" width="13" height="16" rx="2" />
        <path strokeLinecap="round" d="M9 5V3h6v2M9 10h7M9 14h5" />
      </svg>
    ),
  }

  return icons[id] ?? null
}

function Toggle({
  enabled,
  disabled = false,
  onChange,
}: {
  enabled: boolean
  disabled?: boolean
  onChange?: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        enabled ? 'bg-emerald-500' : 'bg-neutral-700'
      } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function CapabilityRow({
  capability,
  onToggle,
}: {
  capability: Capability
  onToggle?: () => void
}) {
  return (
    <div
      className={`group flex items-center gap-3 border-b border-neutral-800/70 px-4 py-3 last:border-b-0 ${
        capability.locked ? 'bg-neutral-900/20' : 'hover:bg-neutral-900/50'
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          capability.enabled
            ? 'bg-emerald-500/10 text-emerald-400'
            : 'bg-neutral-800/70 text-neutral-500'
        }`}
      >
        <div className="h-4.5 w-4.5">
          <CapabilityIcon id={capability.id} />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-medium text-neutral-200">
            {capability.name}
          </p>

          {capability.locked && (
            <span className="flex items-center gap-1 rounded bg-neutral-800 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-neutral-500">
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path strokeLinecap="round" d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Core
            </span>
          )}
        </div>

        <p className="mt-0.5 line-clamp-1 text-[11px] leading-4 text-neutral-600">
          {capability.description}
        </p>
      </div>

      <Toggle
        enabled={capability.enabled}
        disabled={capability.locked}
        onChange={onToggle}
      />
    </div>
  )
}

function Section({
  title,
  description,
  capabilities,
  onToggle,
}: {
  title: string
  description: string
  capabilities: Capability[]
  onToggle?: (id: string) => void
}) {
  return (
    <section>
      <div className="mb-2 px-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          {title}
        </h3>
        <p className="mt-0.5 text-[10px] text-neutral-700">{description}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/40">
        {capabilities.map((capability) => (
          <CapabilityRow
            key={capability.id}
            capability={capability}
            onToggle={
              capability.locked
                ? undefined
                : () => onToggle?.(capability.id)
            }
          />
        ))}
      </div>
    </section>
  )
}

export default function RightDrawer() {
  // Slides in over the viewport standalone, over the widget when embedded.
  const overlay = useOverlayPosition()
  const [open, setOpen] = useState(false)
  const [caps, setCaps] = useState(() => getAllCapabilities())

  useEffect(() => subscribeDrawer(setOpen), [])

  useEffect(() => subscribeCapabilities(() => setCaps(getAllCapabilities())), [])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <aside
      aria-hidden={!open}
      className={`${overlay} inset-y-0 right-0 z-40 flex w-97.5 max-w-[92%] flex-col bg-[#101014] shadow-2xl ring-1 ring-black/20 transition-transform duration-300 ease-out ${
        open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex h-17 shrink-0 items-center border-b border-neutral-800/80 px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3a2 2 0 0 1 2 2v1.1a6.5 6.5 0 0 1 2.7 1.55l.95-.55a2 2 0 1 1 2 3.46l-.95.55c.16.63.24 1.28.24 1.94s-.08 1.31-.24 1.94l.95.55a2 2 0 1 1-2 3.46l-.95-.55A6.5 6.5 0 0 1 14 16.9V18a2 2 0 1 1-4 0v-1.1a6.5 6.5 0 0 1-2.7-1.55l-.95.55a2 2 0 1 1-2-3.46l.95-.55A7.8 7.8 0 0 1 5.06 10c0-.66.08-1.31.24-1.94l-.95-.55a2 2 0 1 1 2-3.46l.95.55A6.5 6.5 0 0 1 10 6.1V5a2 2 0 0 1 2-2Z"
              />
              <circle cx="12" cy="11.5" r="2.5" />
            </svg>
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">
              Capabilities
            </h2>
            <p className="mt-0.5 text-[10px] text-neutral-600">
              Control what this mini-app can access
            </p>
          </div>
        </div>

        <button
          onClick={closeDrawer}
          className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
          aria-label="Close drawer"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6l12 12M18 6L6 18"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-6">
          {/* Core */}
          <Section
            title="Core capabilities"
            description="Required capabilities provided by the host."
            capabilities={caps.core}
          />

          {/* Device */}
          <Section
            title="Device capabilities"
            description="Optional access to device hardware and data."
            capabilities={caps.device}
            onToggle={(id) => toggleStoreCapability(id)}
          />

          {/* Other */}
          <Section
            title="Other capabilities"
            description="Optional services available through the host."
            capabilities={caps.other}
            onToggle={(id) => toggleStoreCapability(id)}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-neutral-800/80 bg-[#101014] px-5 py-3">
        <div className="flex items-center gap-2 text-[10px] text-neutral-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Changes apply to next request - reload mini-app to re-handshake
        </div>
      </div>
    </aside>
  )
}
