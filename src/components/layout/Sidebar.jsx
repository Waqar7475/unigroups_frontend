/**
 * Sidebar.jsx
 * ===========
 * CUSTOMIZE THIS FILE to change the left navigation sidebar.
 *
 * Easy changes:
 *   - Width: change `w-64` in the <aside> tag
 *   - Background: change `bg-surface-950`
 *   - Active item color: find `active ?` and change accent colors
 *   - Add/remove nav items: edit NAV_ITEMS array at the top
 */
import { LayoutDashboard, PlusCircle, Search, Users, ChevronRight, ShieldCheck } from 'lucide-react'
import { useApp }  from '../../context/AppContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import Avatar      from '../ui/Avatar.jsx'
import Badge       from '../ui/Badge.jsx'

/* ── ADD/REMOVE NAV ITEMS HERE ────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',     Icon: LayoutDashboard },
  { id: 'create-group',  label: 'Create Group',  Icon: PlusCircle      },
  { id: 'browse-groups', label: 'Browse Groups', Icon: Search          },
  { id: 'my-groups',     label: 'My Groups',     Icon: Users           },
]

const ADMIN_ITEMS = [
  { id: 'admin-users', label: 'Manage Students', Icon: ShieldCheck },
]

export default function Sidebar({ open, setOpen }) {
  const { currentPage, navigate } = useApp()
  const { isAdmin, user }         = useAuth()

  const go = (id) => { navigate(id); setOpen(false) }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}/>
      )}

      {/* ── SIDEBAR PANEL ─────────────────────────────────────────────── */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-40
        w-64
        bg-surface-950
        border-r border-surface-600/60
        flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* ── NAV LINKS ───────────────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">

          {/* Section label */}
          <p className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            Navigation
          </p>

          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = currentPage === id
            return (
              <button key={id} onClick={() => go(id)}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                  'text-sm font-medium transition-all duration-150 group',
                  /* ── ACTIVE ITEM STYLE — customize here ── */
                  active
                    ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-surface-800 border border-transparent',
                ].join(' ')}>
                {/* Icon box */}
                <div className={[
                  'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all',
                  active ? 'bg-accent-500/20' : 'bg-surface-800 group-hover:bg-surface-700',
                ].join(' ')}>
                  <Icon size={14} className={active ? 'text-accent-400' : 'text-slate-500 group-hover:text-slate-300'}/>
                </div>
                {label}
                {active && <ChevronRight size={13} className="ml-auto text-accent-400 opacity-60"/>}
              </button>
            )
          })}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="px-3 pt-5 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Admin</p>
              </div>
              {ADMIN_ITEMS.map(({ id, label, Icon }) => {
                const active = currentPage === id
                return (
                  <button key={id} onClick={() => go(id)}
                    className={[
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
                      'text-sm font-medium transition-all duration-150 group',
                      active
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-surface-800 border border-transparent',
                    ].join(' ')}>
                    <div className={[
                      'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                      active ? 'bg-red-500/20' : 'bg-surface-800 group-hover:bg-surface-700',
                    ].join(' ')}>
                      <Icon size={14} className={active ? 'text-red-400' : 'text-slate-500 group-hover:text-slate-300'}/>
                    </div>
                    {label}
                  </button>
                )
              })}
            </>
          )}
        </nav>

        {/* ── FOOTER — user card ──────────────────────────────────────── */}
        <div className="px-3 py-4 border-t border-surface-600/60">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-800 border border-surface-600">
            {/* Online dot */}
            <div className="relative shrink-0">
              <Avatar initials={user?.name?.slice(0,2)} dept={user?.department} size="sm"/>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-surface-800"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] font-mono text-accent-400 tracking-wide truncate">{user?.roll_number}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
