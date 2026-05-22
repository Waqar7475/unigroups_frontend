import Icon from '../ui/Icons.jsx'
import { useApp }  from '../../context/AppContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar }  from '../ui/misc.jsx'

const NAV = [
  { id:'dashboard',     label:'Dashboard',     icon:'dashboard'  },
  { id:'create-group',  label:'Create Group',  icon:'plus'       },
  { id:'browse-groups', label:'Browse Groups', icon:'search'     },
  { id:'my-groups',     label:'My Groups',     icon:'users'      },
]
const ADMIN_NAV = [
  { id:'admin-groups', label:'All Groups',      icon:'layers'      },
  { id:'admin-users',  label:'Manage Students', icon:'shieldCheck' },
]

export default function Sidebar({ open, setOpen }) {
  const { currentPage, navigate } = useApp()
  const { isAdmin, user }         = useAuth()
  const go = id => { navigate(id); setOpen(false) }
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}/>}
      <aside className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col transition-transform duration-300 ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Navigation</p>
          {NAV.map(({ id, label, icon }) => {
            const active = currentPage === id
            return (
              <button key={id} onClick={() => go(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                  ${active
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/20'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] border border-transparent'}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all
                  ${active
                    ? 'bg-indigo-100 dark:bg-indigo-500/20'
                    : 'bg-[var(--bg-raised)] group-hover:bg-[var(--bg-hover)]'}`}>
                  <Icon name={icon} size={14} className={active ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-muted)]'}/>
                </div>
                {label}
                {active && <Icon name="chevronRight" size={13} className="ml-auto text-indigo-400 opacity-60"/>}
              </button>
            )
          })}
          {isAdmin && (<>
            <div className="px-3 pt-5 pb-2"><p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Admin</p></div>
            {ADMIN_NAV.map(({ id, label, icon }) => {
              const active = currentPage === id
              return (
                <button key={id} onClick={() => go(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                    ${active
                      ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] border border-transparent'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-red-100 dark:bg-red-500/20' : 'bg-[var(--bg-raised)]'}`}>
                    <Icon name={icon} size={14} className={active ? 'text-red-600 dark:text-red-400' : 'text-[var(--text-muted)]'}/>
                  </div>
                  {label}
                </button>
              )
            })}
          </>)}
        </nav>
        <div className="px-3 py-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
            <div className="relative shrink-0">
              <Avatar initials={user?.name?.slice(0,2)} dept={user?.department} size="sm"/>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--bg-raised)]"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 tracking-wide truncate">{user?.roll_number}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
