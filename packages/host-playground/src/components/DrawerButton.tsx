import { useEffect, useState } from 'react'
import { isDrawerOpen, subscribeDrawer, toggleDrawer } from '../lib/drawer'
import { Settings2Icon } from 'lucide-react'

export default function DrawerButton() {
  // Mirror the shared drawer state instead of tracking a private copy - the
  // drawer also closes via Escape and its own X button, and a private copy
  // would drift out of sync and need two clicks to reopen.
  const [open, setOpen] = useState(() => isDrawerOpen())

  useEffect(() => subscribeDrawer(setOpen), [])

  return (
    <button
      onClick={toggleDrawer}
      title="Toggle capabilities drawer"
      aria-expanded={open}
      className={`relative inline-flex items-center gap-2 rounded-xl border px-3.5 py-1 text-sm font-medium transition-all ${
        open
          ? 'border-indigo-400/60 bg-neutral-800 text-white'
          : 'border-neutral-700/70 bg-neutral-800/50 text-neutral-200 hover:border-indigo-400/60 hover:bg-neutral-800 hover:text-white'
      }`}
    >
      <Settings2Icon size={18} />
      <span className="hidden sm:inline">Capabilities</span>
    </button>
  )
}
