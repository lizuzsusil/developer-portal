import { useEffect, useState } from 'react'
import type { PlaygroundConfig } from '../types'
import DrawerButton from './DrawerButton'
import { getTheme, subscribeAppearance, toggleTheme } from '../lib/appearance'
import type { ThemeState } from '../lib/appearance'
import { LanguageSwitcher } from './LanguageSwitcher'
import { usePlaygroundShell } from '../embed-context'

interface Props {
  config?: PlaygroundConfig
  /** Opens the setup modal, to point the sandbox at a different mini app. */
  onLoadApp(): void
  /** Re-downloads and remounts the current bundle with the current toggles. */
  onReload?(): void
}

function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeState>(() => getTheme())

  useEffect(() => {
    const sync = () => setTheme(getTheme())
    // `setThemePreference` notifies directly - no polling needed. `storage`
    // and `focus` still cover changes made in another tab.
    const unsubscribe = subscribeAppearance(sync)
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    return () => {
      unsubscribe()
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  const isDark = theme.mode === 'dark'

  return (
    <button
      onClick={() => {
        toggleTheme()
        setTheme(getTheme())
      }}
      title={`Switch to ${isDark ? 'light' : 'dark'} - mini app will receive appearance.theme.changed`}
      aria-label={`Toggle theme, current ${theme.mode}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700/70 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
    >
      <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${isDark ? 'bg-neutral-800 text-yellow-400' : 'bg-white text-amber-500'}`}>
        {isDark ? (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="4" />
            <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        )}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  )
}

function FullscreenToggle() {
  const { fullscreen, toggleFullscreen } = usePlaygroundShell()
  if (!toggleFullscreen) return null
  return (
    <button
      onClick={toggleFullscreen}
      title={fullscreen ? 'Exit full screen' : 'Expand to full screen'}
      aria-label={fullscreen ? 'Exit full screen' : 'Expand to full screen'}
      aria-pressed={fullscreen}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700/70 bg-neutral-900/60 text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
    >
      {fullscreen ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </svg>
      )}
    </button>
  )
}

export default function PlaygroundHeader({ config, onLoadApp, onReload }: Props) {
  const loaded = Boolean(config?.manifestUrl?.trim())

  return (
    <header className="relative z-20 shrink-0 border-b border-neutral-800 bg-[#0b0b0f]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-neutral-300">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-700/60 bg-neutral-900 text-indigo-300">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
              <path strokeLinecap="round" d="M12 3v13.5M4 7.5l8 4.5 8-4.5" />
            </svg>
          </span>
          <span className="hidden pr-1 sm:inline">Sandbox</span>
          <span className="truncate text-neutral-500">/ {config?.name?.trim() || 'untitled mini app'}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {config?.sdkVersion && (
            <span className="hidden items-center gap-1.5 rounded-full border border-neutral-700/70 bg-neutral-900/60 px-3 py-1 text-xs font-medium text-neutral-300 xl:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SDK {config.sdkVersion}
            </span>
          )}

          {/* Primary action: point the sandbox at a different mini app. */}
          <button
            onClick={onLoadApp}
            title="Load a different mini app - change the URL, SDK version or capabilities"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-semibold text-black transition-colors hover:bg-neutral-200"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h13m0 0-3-3m3 3-3 3M20 16H7m0 0 3-3m-3 3 3 3" />
            </svg>
            <span>{loaded ? 'Load another app' : 'Load app'}</span>
          </button>

          {onReload && (
            <button
              onClick={onReload}
              title="Re-download this mini app and remount it with the current capability toggles"
              aria-label="Reload mini app"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700/70 bg-neutral-900/60 text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 11a8 8 0 1 0-.6 4M20 4v6h-6" />
              </svg>
            </button>
          )}
          <LanguageSwitcher />
          <ThemeToggle />
          <DrawerButton />
          <FullscreenToggle />
        </div>
      </div>
    </header>
  )
}
