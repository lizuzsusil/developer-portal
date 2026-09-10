import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PlaygroundConfig } from './types'
import { closeDrawer } from './lib/drawer'
import { sdkSourceFor } from './lib/sdk-sources'
import { EMPTY_CONFIG, isValidConfig } from './lib/config'
import { installHandshakeListener } from './lib/runtime-loader'
import { setAppearanceRoot } from './lib/appearance'
import { getLastConfig, setLastConfig } from './lib/store'
import { PlaygroundShellProvider, type PlaygroundMode } from './embed-context'
import ConfigModal from './components/ConfigModal'
import MiniAppBoard from './components/MiniAppBoard'
import PlaygroundHeader from './components/PlaygroundHeader'
import RightDrawer from './components/RightDrawer'

/**
 * The playground shell - header, sandbox board, capabilities drawer and setup
 * modal - with no router involved.
 *
 * The standalone app used to drive this through `HashRouter` (`/` -> Home,
 * `/playground` -> board) and passed the config through `location.state`.
 * That made the shell impossible to embed: Docusaurus already owns the router,
 * and a second `HashRouter` fights it for the URL hash (anchor links, the
 * `#capabilities` deep links in the docs, back/forward). The two views are
 * plain state now, so the exact same component tree renders in the Vite app
 * and inside `docs/host-playground.mdx`.
 */

interface Props {
  mode?: PlaygroundMode
  /**
   * Prefills the setup form. Nothing is loaded until it is submitted - the
   * sandbox always starts empty. Falls back to the last submitted config.
   */
  initialConfig?: PlaygroundConfig
  /** Open the setup modal on mount. Standalone does; the docs embed does not. */
  autoOpenSetup?: boolean
  fullscreen?: boolean
  onToggleFullscreen?: () => void
  className?: string
}

export default function HostPlaygroundApp({
  mode = 'standalone',
  initialConfig,
  autoOpenSetup = mode === 'standalone',
  fullscreen = false,
  onToggleFullscreen,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  /**
   * The mini app currently in the sandbox. Always starts empty, even when a
   * previous session is remembered: reloading the page must not silently
   * remount whatever was last tested - you would be looking at a bundle you
   * did not ask for, possibly from a different app or an older build.
   */
  const [activeConfig, setActiveConfig] = useState<PlaygroundConfig>(EMPTY_CONFIG)

  /**
   * The last config the vendor submitted, read once from localStorage. It only
   * prefills the setup form, so returning to the page is still a single click
   * ("Load app" -> "Test & load app") without anything loading behind your back.
   */
  const [remembered] = useState<PlaygroundConfig>(
    () => initialConfig ?? getLastConfig() ?? EMPTY_CONFIG,
  )

  const [modalOpen, setModalOpen] = useState(autoOpenSetup)

  /**
   * Remount trigger for the board. `token` forces a fresh `MiniAppBoard`;
   * `refresh` re-downloads the bundle instead of reading the cached copy.
   * Submitting the form uses the cache - it is keyed on the manifest's file
   * list, so a rebuild invalidates it by itself - while "Reload" always
   * refetches, for vendors whose filenames are not content-hashed.
   */
  const [reload, setReload] = useState({ token: 0, refresh: false })
  const reloadNow = useCallback(
    () => setReload((r) => ({ token: r.token + 1, refresh: true })),
    [],
  )
  const loadNow = useCallback(
    () => setReload((r) => ({ token: r.token + 1, refresh: false })),
    [],
  )

  const sdk = useMemo(() => sdkSourceFor(activeConfig.sdkVersion), [activeConfig.sdkVersion])

  useEffect(() => {
    closeDrawer()
    installHandshakeListener()
  }, [])

  // Embedded: keep `data-theme` / `dir` / `lang` on the playground root so the
  // in-playground theme toggle does not repaint the surrounding docs site.
  useEffect(() => {
    if (mode !== 'embedded') return
    setAppearanceRoot(rootRef.current)
    return () => setAppearanceRoot(null)
  }, [mode])

  const testAndLoad = useCallback(
    (c: PlaygroundConfig) => {
      setLastConfig(c)
      setActiveConfig(c)
      setModalOpen(false)
      loadNow()
    },
    [loadNow],
  )

  const shell = useMemo(
    () => ({ mode, fullscreen, toggleFullscreen: onToggleFullscreen }),
    [mode, fullscreen, onToggleFullscreen],
  )

  const layout =
    mode === 'standalone'
      ? 'relative flex min-h-screen flex-col overflow-hidden'
      : 'relative flex h-full min-h-0 flex-col overflow-hidden'

  return (
    <PlaygroundShellProvider value={shell}>
      <div ref={rootRef} className={[layout, className].filter(Boolean).join(' ')}>
        <PlaygroundHeader
          config={activeConfig}
          onLoadApp={() => setModalOpen(true)}
          onReload={isValidConfig(activeConfig) ? reloadNow : undefined}
        />

        <main className="relative flex min-h-0 flex-1 gap-5 p-4 sm:p-5">
          <MiniAppBoard
            key={reload.token}
            config={activeConfig}
            sdk={sdk}
            refresh={reload.refresh}
            onConfigure={() => setModalOpen(true)}
          />
        </main>

        <RightDrawer />

        <ConfigModal
          open={modalOpen}
          initial={isValidConfig(activeConfig) ? activeConfig : remembered}
          onSubmit={testAndLoad}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </PlaygroundShellProvider>
  )
}
