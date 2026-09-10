import HostPlaygroundApp from './HostPlaygroundApp'

/**
 * Standalone entry.
 *
 * The router is gone: the app only ever had two views (setup + sandbox) and
 * `HashRouter` made the shell unembeddable - Docusaurus owns the router on the
 * docs site, and a second one fights it for the URL hash. Both views are state
 * inside `HostPlaygroundApp` now, so this app and `docs/host-playground.mdx`
 * render byte-for-byte the same tree.
 */
export default function App() {
  return <HostPlaygroundApp mode="standalone" autoOpenSetup />
}
