import { useEffect, useRef, useState } from 'react'
import type { PlaygroundConfig, SdkSource } from '../types'
import { loadAndMountMiniApp, installHandshakeListener } from '../lib/runtime-loader'
import type { LoadProgress } from '../lib/runtime-loader'
import { isValidConfig } from '../lib/config'

interface Props {
  config: PlaygroundConfig
  sdk: SdkSource
  /** Opens the setup modal from the empty state. */
  onConfigure?: () => void
  /** Bypass the IndexedDB copy of the bundle - see `LoadOptions.refresh`. */
  refresh?: boolean
}

function shadowClear(node: HTMLElement): void {
  if (node.shadowRoot) node.shadowRoot.innerHTML = ''
}

export default function MiniAppBoard({ config, sdk, onConfigure, refresh = false }: Props) {
  void sdk
  const ref = useRef<HTMLDivElement>(null)
  // `configured` is derived, not stored: with no manifest URL there is nothing
  // to load, so the effect never runs and the empty state renders straight from
  // props rather than being pushed in through setState.
  const configured = isValidConfig(config)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [progress, setProgress] = useState<LoadProgress | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    installHandshakeListener()
  }, [])

  useEffect(() => {
    const node = ref.current
    // Nothing configured yet - the empty state renders instead, and we avoid
    // fetching an empty URL only to report it back as a load failure.
    if (!node || !configured) return
    let cancelled = false
    setStatus('loading')
    setError('')
    setProgress({ stage: 'Fetching manifest.json', percent: 5 })
    shadowClear(node)

    const onReady = () => {
      if (cancelled) return
      setStatus('ready')
      setProgress({ stage: 'Ready', percent: 100 })
    }
    loadAndMountMiniApp(node, config, setProgress, onReady, { refresh })
      .then((res) => {
        if (cancelled) return
        if (!res.ok) {
          setStatus('error')
          setError(res.error ?? 'failed to load mini app')
        }
        // `ok: true` only means the bundle was injected; the mini app may
        // still be initializing (SDK handshake). `onReady` flips to 'ready'
        // once real content shows up.
      })
      .catch((e: Error) => {
        if (cancelled) return
        setStatus('error')
        setError(e.message)
      })
    return () => {
      cancelled = true
      shadowClear(node)
    }
  }, [config, configured, refresh])

  const isCorsError = /failed to fetch|cors|networkerror/i.test(error)

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-neutral-800 bg-[#0d0d12]">
      <div ref={ref} className="h-full w-full overflow-auto" data-module="playground" />

      {!configured && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-900/40">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
              <path strokeLinecap="round" d="M12 3v13.5M4 7.5l8 4.5 8-4.5" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-neutral-200">No mini app loaded yet</p>
          <p className="max-w-90 text-xs leading-relaxed text-neutral-500">
            Point the sandbox at the folder that serves your <span className="font-mono text-neutral-400">manifest.json</span>,
            pick an SDK version, and grant the capabilities you want to exercise.
          </p>
          {onConfigure && (
            <button
              onClick={onConfigure}
              className="mt-1 inline-flex h-9 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
            >
              Configure mini app
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      )}

      {configured && status === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0d0d12]/95 px-6">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-700 border-t-indigo-400" />
          <p className="text-sm text-neutral-200">{progress?.stage ?? 'Loading'}</p>
          <p className="text-xs text-neutral-500">
            {refresh ? 'Downloading' : 'Loading'} {config.name || 'mini app'} on SDK {config.sdkVersion}
          </p>
          {progress && (
            <div className="mt-1 h-1.5 w-56 overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          )}
        </div>
      )}

      {configured && status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-auto px-6 py-8">
          <p className="text-sm font-semibold text-red-300">Failed to load mini app</p>
          <p className="max-w-125 break-words text-center font-mono text-xs text-red-200/80">{error}</p>
          {isCorsError && (
            <p className="max-w-125 text-center text-xs leading-relaxed text-neutral-400">
              This usually means <span className="font-semibold text-neutral-200">CORS</span>. The origin serving your mini app
              must allow cross-origin reads of <span className="font-mono">manifest.json</span> and the bundle files. On Vercel,
              add an <span className="font-mono">Access-Control-Allow-Origin</span> header in{' '}
              <span className="font-mono">vercel.json</span> and redeploy.
            </p>
          )}
          {onConfigure && (
            <button
              onClick={onConfigure}
              className="mt-1 inline-flex h-9 items-center rounded-full border border-neutral-700 px-5 text-sm font-medium text-neutral-200 transition-colors hover:border-neutral-500 hover:text-white"
            >
              Edit configuration
            </button>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute right-4 top-2 flex items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-600">Preview</span>
        <span className="rounded-full border border-neutral-700/70 bg-neutral-900/60 px-2 text-[11px] font-medium text-neutral-300">
          {config.sdkVersion}
        </span>
        {configured && status === 'ready' && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            mounted
          </span>
        )}
      </div>
    </div>
  )
}
