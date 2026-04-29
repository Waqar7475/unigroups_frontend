/**
 * Navbar.jsx
 * ==========
 * CUSTOMIZE THIS FILE to change the top navigation bar.
 *
 * Easy changes:
 *   - Logo: find "LOGO AREA" comment → swap icon or text
 *   - Height: change `h-16` → `h-14` or `h-20`
 *   - Background: change `bg-surface-950/80` → any color
 *   - Border: change `border-b border-surface-600` → remove or restyle
 */
import { Sun, Moon, LogOut, Layers, Menu, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useApp }  from '../../context/AppContext.jsx'
import Avatar      from '../ui/Avatar.jsx'
import Badge       from '../ui/Badge.jsx'

export default function Navbar({ onMenuToggle }) {
  const { user, logout, isAdmin } = useAuth()
  const { dark, toggleDark }      = useApp()

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || '?'

  return (
    /* ── OUTER BAR — change height/bg/border here ────────────────────── */
    <header className="
      fixed top-0 left-0 right-0 z-50
      h-16
      bg-surface-950/85 backdrop-blur-xl
      border-b border-surface-600/60
      flex items-center px-5 gap-4
    ">

      {/* ── HAMBURGER (mobile only) ──────────────────────────────────── */}
      <button onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-700 transition-all">
        <Menu size={20}/>
      </button>

      {/* ── LOGO AREA ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 mr-auto">
        {/* Icon box — change bg color or swap the icon */}
        <div className="w-8 h-8 rounded-xl bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/25">
          <Layers size={15} className="text-white"/>
        </div>
        {/* App name */}
        <span className="font-bold text-base text-white tracking-tight hidden sm:block">
          UniGroups
        </span>
        {/* Admin badge */}
        {isAdmin && <Badge variant="admin">Admin</Badge>}
      </div>

      {/* ── RIGHT SIDE CONTROLS ──────────────────────────────────────── */}
      <div className="flex items-center gap-1">

        {/* Dark mode toggle */}
        <button onClick={toggleDark}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-700 transition-all"
          aria-label="Toggle theme">
          {dark ? <Sun size={17}/> : <Moon size={17}/>}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-surface-600 mx-1"/>

        {/* User pill — shows name + roll number */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-800 border border-surface-600">
          <Avatar initials={initials} dept={user?.department} size="xs"/>
          <div className="hidden sm:block leading-tight">
            <p className="text-xs font-bold text-white">{user?.name}</p>
            <p className="text-[10px] font-mono text-accent-400 tracking-wide">{user?.roll_number}</p>
          </div>
        </div>

        {/* Logout button */}
        <button onClick={logout}
          className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all ml-1"
          title="Logout">
          <LogOut size={17}/>
        </button>
      </div>
    </header>
  )
}
