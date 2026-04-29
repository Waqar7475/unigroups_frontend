import { LogOut, Sun, Moon, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useApp }  from '../context/AppContext.jsx'

export default function Navbar({ onMenuToggle }) {
  const { user, logout, isAdmin } = useAuth()
  const { dark, toggleDark }      = useApp()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-carbon border-b border-iron h-14 flex items-center px-4 gap-4">
      {/* Mobile toggle */}
      <button onClick={onMenuToggle} className="lg:hidden text-ash hover:text-acid transition-colors">
        <Menu size={20}/>
      </button>

      {/* Logo — editorial style */}
      <div className="flex items-center gap-3 mr-auto">
        <div className="w-7 h-7 bg-acid flex items-center justify-center">
          <span className="font-display text-carbon text-sm leading-none">U</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="font-display text-xl tracking-[0.15em] text-chalk">UNIGROUPS</span>
          {isAdmin && <span className="tag text-danger border-danger/40">ADMIN</span>}
        </div>
      </div>

      {/* Ticker — scrolling info */}
      <div className="hidden md:block flex-1 max-w-xs overflow-hidden">
        <div className="animate-ticker whitespace-nowrap font-mono text-[10px] text-smoke">
          SUPERIOR UNIVERSITY &nbsp;·&nbsp; GROUP MANAGEMENT SYSTEM &nbsp;·&nbsp; {user?.roll_number} &nbsp;·&nbsp; {user?.department || 'NO DEPT'} &nbsp;·&nbsp;
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button onClick={toggleDark} className="btn-ghost !px-2 !py-1.5">
          {dark ? <Sun size={14}/> : <Moon size={14}/>}
        </button>

        {/* User chip */}
        <div className="hidden sm:flex items-center gap-2 border border-iron px-3 py-1.5">
          <div className={`w-1.5 h-1.5 ${user?.department==='SE'?'dot-se':user?.department==='CS'?'dot-cs':'bg-ash'}`}/>
          <span className="font-mono text-[10px] text-chalk font-semibold">{user?.name?.split(' ')[0]?.toUpperCase()}</span>
          <span className="roll-id">{user?.roll_number}</span>
        </div>

        <button onClick={logout} className="btn-ghost !px-2 !py-1.5" title="Logout">
          <LogOut size={14}/>
        </button>
      </div>
    </header>
  )
}
