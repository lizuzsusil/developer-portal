import { createContext, useContext } from 'react'

/**
 * How the playground shell is being rendered.
 *
 * `standalone` — the Vite app at packages/host-playground: the shell owns the
 *   whole viewport, so the config modal and capabilities drawer are `fixed`.
 *
 * `embedded` — dropped into a Docusaurus page via `<HostPlaygroundEmbed />`:
 *   the shell is one block in a scrolling article, so those overlays must be
 *   `absolute` inside the playground's own root or they would cover the docs
 *   navbar and sidebar. Everything else (runtime loader, handshake, mock
 *   handlers, capability store) is identical between the two modes.
 */
export type PlaygroundMode = 'standalone' | 'embedded'

export interface PlaygroundShellContext {
  mode: PlaygroundMode
  /** True while the embedded shell is expanded to cover the viewport. */
  fullscreen: boolean
  toggleFullscreen?: () => void
}

const ShellContext = createContext<PlaygroundShellContext>({
  mode: 'standalone',
  fullscreen: false,
})

export const PlaygroundShellProvider = ShellContext.Provider

export function usePlaygroundShell(): PlaygroundShellContext {
  return useContext(ShellContext)
}

/**
 * Overlays (modal, drawer) escape to the viewport in the standalone app but
 * must stay inside the widget when embedded — unless the widget itself is
 * already covering the viewport, in which case `absolute` on the root is
 * visually identical to `fixed`.
 */
export function useOverlayPosition(): 'fixed' | 'absolute' {
  const { mode } = usePlaygroundShell()
  return mode === 'standalone' ? 'fixed' : 'absolute'
}
