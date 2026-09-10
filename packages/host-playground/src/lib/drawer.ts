/**
 * Capabilities drawer open/close state.
 *
 * Holds the current value (not just an event stream) so late subscribers -
 * the header's toggle button, which mounts independently of the drawer -
 * start in sync instead of guessing.
 */
let open = false
let listeners: ((open: boolean) => void)[] = []

export function openDrawer(next: boolean) {
  open = next
  for (const l of listeners) l(open)
}

export function toggleDrawer() {
  openDrawer(!open)
}

export function closeDrawer() {
  openDrawer(false)
}

export function isDrawerOpen(): boolean {
  return open
}

export function subscribeDrawer(l: (open: boolean) => void): () => void {
  listeners.push(l)
  l(open)
  return () => {
    listeners = listeners.filter((x) => x !== l)
  }
}
