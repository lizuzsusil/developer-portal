/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import type { PlaygroundConfig } from '../types'
import { DEFAULT_SDK_VERSION } from '../lib/sdk-sources'
import { useSdkVersions } from '../lib/use-sdk-versions'
import { useOverlayPosition } from '../embed-context'
import {
  CORE_CAPABILITIES,
  DEVICE_CAPABILITIES,
  OTHER_CAPABILITIES,
  getEnabledCapabilityIds,
  setCapabilityEnabled,
} from '../lib/capabilities'

interface Props {
  open: boolean
  initial?: Partial<PlaygroundConfig>
  onSubmit(cfg: PlaygroundConfig): void
  onClose(): void
}

function CapPill({
  label,
  selected,
  locked = false,
  onToggle,
}: {
  label: string
  selected: boolean
  locked?: boolean
  onToggle?: () => void
}) {
  if (locked) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-800/60 px-2.5 py-1 text-xs font-medium text-neutral-400">
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path strokeLinecap="round" d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        {label}
      </span>
    )
  }
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selected
        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
        : 'border-neutral-700 bg-neutral-800/50 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
        }`}
    >
      {selected ? (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span className="h-3 w-3 rounded-full border border-neutral-600" />
      )}
      {label}
    </button>
  )
}

export default function ConfigModal({ open, initial, onSubmit, onClose }: Props) {
  // `fixed` in the standalone app, `absolute` when embedded in the docs so the
  // modal covers the playground instead of the whole documentation page.
  const overlay = useOverlayPosition()
  const sdkSources = useSdkVersions()
  const [form, setForm] = useState<Partial<PlaygroundConfig>>(() => initial ?? {})
  const [capSelected, setCapSelected] = useState<Set<string>>(() => {
    const enabled = new Set(getEnabledCapabilityIds())
    const s = new Set<string>()
    for (const c of [...DEVICE_CAPABILITIES, ...OTHER_CAPABILITIES]) if (enabled.has(c.id)) s.add(c.id)
    return s
  })
  const [capsOpen, setCapsOpen] = useState(false)

  // Keep form + capabilities in sync when modal re-opens or initial changes
  useEffect(() => {
    if (open) {
      setForm(initial ?? {})
      const enabled = new Set(getEnabledCapabilityIds())
      const s = new Set<string>()
      for (const c of [...DEVICE_CAPABILITIES, ...OTHER_CAPABILITIES]) if (enabled.has(c.id)) s.add(c.id)
      setCapSelected(s)
      setCapsOpen(false)
    }
  }, [open, initial?.name, initial?.manifestUrl, initial?.sdkVersion])

  const name = form.name ?? ''
  const manifestUrl = form.manifestUrl ?? ''
  const sdkVersion = form.sdkVersion || DEFAULT_SDK_VERSION
  const valid = name.trim().length > 0 && manifestUrl.trim().length > 0

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const update = <K extends keyof PlaygroundConfig>(key: K, value: PlaygroundConfig[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleCap = (id: string) => {
    setCapSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    // Apply capabilities to global store before mounting (separate file as requested)
    for (const c of [...DEVICE_CAPABILITIES, ...OTHER_CAPABILITIES]) {
      setCapabilityEnabled(c.id, capSelected.has(c.id))
    }
    onSubmit({
      name: name.trim(),
      manifestUrl: manifestUrl.trim(),
      iconUrl: undefined,
      sdkVersion,
    })
  }

  return (
    <div className={`${overlay} inset-0 z-50 flex items-center justify-center p-4`}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-[#06060a]/75 backdrop-blur-xs" onClick={onClose} />

      {/* card — larger, minimal */}
      <div className="relative flex max-h-full w-full max-w-160 flex-col overflow-hidden rounded-[20px] border border-neutral-800 bg-[#0f0f12] shadow-[0_24px_64px_-16px_rgba(0,0,0,0.9)]">
        {/* subtle top accent */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-indigo-500/40 to-transparent" />

        {/* header */}
        <div className="relative px-7 pb-0 pt-6">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-500 transition-colors hover:border-neutral-700 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                <path strokeLinecap="round" d="M12 3v13.5M4 7.5l8 4.5 8-4.5" />
              </svg>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Sandbox Setup
            </p>
          </div>

          <h2 className="mt-3 text-[20px] font-semibold leading-tight tracking-tight text-white">
            Configure your mini app
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
            Point to your built app, pick an SDK version, and choose which permissions to grant.
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-7 py-6">
            <div className="space-y-6">
              {/* row: name + sdk */}
              <div className="grid gap-4 sm:grid-cols-5">
                <div className="sm:col-span-3">
                  <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                    Display name <span className="font-normal text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    required
                    placeholder="My Mini App"
                    onChange={(e) => update('name', e.target.value)}
                    className="h-10.5 w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                    SDK version <span className="font-normal text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={sdkVersion}
                      onChange={(e) => update('sdkVersion', e.target.value)}
                      className="h-10.5 w-full appearance-none rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 pr-8 text-sm text-white focus:border-indigo-500/50 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                    >
                      {sdkSources.map((s) => (
                        <option key={s.version} value={s.version} className="bg-[#0f0f12] text-white">
                          {s.version}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* frontend url */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  Frontend URL <span className="font-normal text-indigo-400">*</span>
                </label>
                <input
                  type="url"
                  inputMode="url"
                  value={manifestUrl}
                  required
                  placeholder="https://your-mini-app.vercel.app/"
                  onChange={(e) => update('manifestUrl', e.target.value)}
                  className="h-10.5 w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                />
                <p className="mt-1.5 flex items-center gap-1 text-[11px] leading-relaxed text-neutral-500">
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                  </svg>
                  Base directory of the built app — we fetch <span className="font-mono text-neutral-400">manifest.json</span> from here
                </p>
              </div>

              {/* capabilities multiselect — dropdown to hide/show */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/30">
                <button
                  type="button"
                  onClick={() => setCapsOpen((o) => !o)}
                  aria-expanded={capsOpen}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <div>
                    <p className="text-xs font-medium text-neutral-300">Capabilities</p>
                    <p className="mt-0.5 text-[11px] text-neutral-500">
                      {capSelected.size} selected • Core always enabled • {capsOpen ? 'tap to hide' : 'tap to customize'}
                    </p>
                  </div>
                  <span
                    className={`ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${capsOpen
                      ? 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300'
                      : 'border-neutral-700 bg-neutral-800 text-neutral-500'
                      }`}
                  >
                    <svg
                      className={`h-4 w-4 transition-transform ${capsOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>

                {!capsOpen && capSelected.size > 0 && (
                  <div className="flex flex-wrap gap-1.5 border-t border-neutral-800/50 px-4 py-2.5">
                    {[...DEVICE_CAPABILITIES, ...OTHER_CAPABILITIES]
                      .filter((c) => capSelected.has(c.id))
                      .slice(0, 6)
                      .map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
                        >
                          {c.name}
                        </span>
                      ))}
                    {capSelected.size > 6 && (
                      <span className="inline-flex items-center rounded-full bg-neutral-800 px-2 py-0.5 text-[11px] font-medium text-neutral-400">
                        +{capSelected.size - 6} more
                      </span>
                    )}
                  </div>
                )}

                {capsOpen && (
                  <div className="border-t border-neutral-800 px-4 pb-4 pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {CORE_CAPABILITIES.map((c) => (
                        <CapPill key={c.id} label={c.name} selected locked />
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">Device</p>
                      <div className="flex flex-wrap gap-2">
                        {DEVICE_CAPABILITIES.map((c) => (
                          <CapPill
                            key={c.id}
                            label={c.name}
                            selected={capSelected.has(c.id)}
                            onToggle={() => toggleCap(c.id)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">Other</p>
                      <div className="flex flex-wrap gap-2">
                        {OTHER_CAPABILITIES.map((c) => (
                          <CapPill
                            key={c.id}
                            label={c.name}
                            selected={capSelected.has(c.id)}
                            onToggle={() => toggleCap(c.id)}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-neutral-600">
                      Toggle off to simulate <span className="text-neutral-400">PERMISSION_DENIED</span>. You can also adjust these live in the Capabilities drawer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between border-t border-neutral-800/80 bg-neutral-900/20 px-7 py-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                Cancel
              </button>
              {/* The form opens pre-filled with the app currently in the
                  sandbox, which is what you want when tweaking the SDK version
                  or capabilities. Switching to a different mini app instead
                  starts here. */}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, name: '', manifestUrl: '' }))}
                disabled={!name && !manifestUrl}
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-500 transition-colors enabled:hover:bg-neutral-800 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            </div>

            <button
              type="submit"
              disabled={!valid}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black shadow-sm transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Test & load app
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
