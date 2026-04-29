import { useApp }  from '../context/AppContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const NAV = [
  { id:'dashboard',     label:'DASHBOARD',      num:'01' },
  { id:'create-group',  label:'CREATE GROUP',   num:'02' },
  { id:'browse-groups', label:'BROWSE GROUPS',  num:'03' },
  { id:'my-groups',     label:'MY GROUPS',      num:'04' },
]
const ADMIN_NAV = [
  { id:'admin-users',   label:'STUDENTS',       num:'05' },
]

export default function Sidebar({ open, setOpen }) {
  const { currentPage, navigate } = useApp()
  const { isAdmin, user }         = useAuth()

  const handleNav = (id) => { navigate(id); setOpen(false) }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-carbon/90 lg:hidden" onClick={() => setOpen(false)}/>
      )}

      <aside className={`
        fixed top-14 left-0 bottom-0 z-40 w-56
        bg-carbon border-r border-iron
        flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Nav items */}
        <nav className="flex-1 pt-6">
          {/* Vertical label */}
          <div className="px-4 mb-4">
            <span className="mono-label text-[0.6rem]">// NAVIGATION</span>
          </div>

          {NAV.map(({ id, label, num }) => {
            const active = currentPage === id
            return (
              <button key={id} onClick={() => handleNav(id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5
                  text-left border-l-2 transition-all duration-150 group
                  ${active
                    ? 'border-acid bg-acid/5'
                    : 'border-transparent hover:border-iron hover:bg-steel'
                  }
                `}>
                <span className={`font-mono text-[10px] font-bold transition-colors ${active ? 'text-acid' : 'text-smoke group-hover:text-ash'}`}>
                  {num}
                </span>
                <span className={`font-display text-sm tracking-[0.12em] transition-colors ${active ? 'text-acid' : 'text-ash group-hover:text-chalk'}`}>
                  {label}
                </span>
                {active && <span className="ml-auto text-acid font-mono text-[10px]">→</span>}
              </button>
            )
          })}

          {isAdmin && (
            <>
              <div className="px-4 mt-6 mb-4 flex items-center gap-3">
                <span className="mono-label text-[0.6rem]">// ADMIN</span>
                <div className="flex-1 h-px bg-iron"/>
              </div>
              {ADMIN_NAV.map(({ id, label, num }) => {
                const active = currentPage === id
                return (
                  <button key={id} onClick={() => handleNav(id)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5
                      text-left border-l-2 transition-all duration-150 group
                      ${active ? 'border-danger bg-danger/5' : 'border-transparent hover:border-iron hover:bg-steel'}
                    `}>
                    <span className={`font-mono text-[10px] font-bold transition-colors ${active ? 'text-danger' : 'text-smoke group-hover:text-ash'}`}>{num}</span>
                    <span className={`font-display text-sm tracking-[0.12em] transition-colors ${active ? 'text-danger' : 'text-ash group-hover:text-chalk'}`}>{label}</span>
                  </button>
                )
              })}
            </>
          )}
        </nav>

        {/* Footer — dept indicator */}
        <div className="p-4 border-t border-iron">
          <div className={`flex items-center gap-3 ${user?.department==='SE'?'accent-se':user?.department==='CS'?'accent-cs':'border-l border-iron'} pl-3`}>
            <div>
              <p className="mono-label text-[0.6rem] mb-0.5">DEPARTMENT</p>
              <p className={`font-display text-base tracking-wider ${user?.department==='SE'?'text-se':user?.department==='CS'?'text-cs':'text-ash'}`}>
                {user?.department || 'UNSET'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
