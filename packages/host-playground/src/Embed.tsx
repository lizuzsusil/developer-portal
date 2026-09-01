import { useCallback, useEffect, useState } from 'react'
import HostPlaygroundApp from './HostPlaygroundApp'

/**
 * The Host Playground as a block inside a documentation page.
 *
 * Renders exactly the same shell as the standalone app — header, sandbox
 * board, capabilities drawer, setup modal, runtime loader, handshake listener
 * and mock handlers — just sized to a frame in the article instead of the
 * viewport, with a full-screen toggle for when a vendor wants the standalone
 * proportions without leaving the docs.
 *
 * Must only be rendered in the browser: the shell reads `localStorage` for the
 * last config and installs a `message` listener on mount. `src/components/
 * HostExplorer` wraps it in Docusaurus' `<BrowserOnly>`.
 */
export interface HostPlaygroundEmbedProps {
  /** Show the "press F for full screen" line under the frame. */
  hint?: boolean
}

export default function HostPlaygroundEmbed({ hint = true }: HostPlaygroundEmbedProps) {
  const [fullscreen, setFullscreen] = useState(false)

  const toggleFullscreen = useCallback(() => setFullscreen((f) => !f), [])

  // Escape leaves full screen. The drawer and modal also listen for Escape,
  // so only act once nothing is stacked above the shell.
  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fullscreen])

  // Lock the article behind the overlay so a scroll inside the sandbox does
  // not scroll the docs page underneath it.
  useEffect(() => {
    if (!fullscreen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [fullscreen])

  return (
    <div className="hp-embed">
      <HostPlaygroundApp
        mode="embedded"
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        className={`hp-root hp-embed__frame${fullscreen ? ' hp-fullscreen' : ''}`}
      />
      {hint && (
        <p className="hp-embed__hint">
          Everything runs in your browser — the bundle is fetched from the URL you provide, the SDK from jsDelivr, and the
          host side is mocked locally. Use the expand button in the sandbox header for the full-screen view
          {fullscreen ? ' (Escape to exit)' : ''}.
        </p>
      )}
    </div>
  )
}
