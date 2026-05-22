import Icon from '../ui/Icons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useApp }  from '../../context/AppContext.jsx'
import { Avatar }  from '../ui/misc.jsx'
import Badge       from '../ui/Badge.jsx'
import NotificationBell from '../ui/NotificationBell.jsx'

export default function Navbar({ onMenuToggle }) {
  const { user, logout, isAdmin } = useAuth()
  const { dark, toggleDark }      = useApp()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border)] flex items-center px-5 gap-4">
      <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-all">
        <Icon name="menu" size={20}/>
      </button>
      <div className="flex items-center gap-2.5 mr-auto">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-sm shadow-indigo-500/25">
          <Icon name="layers" size={15} className="text-white"/>
        </div>
        <span className="font-bold text-base text-[var(--text-primary)] tracking-tight hidden sm:block">UniGroups</span>
        {isAdmin && <Badge variant="admin">Admin</Badge>}
      </div>
      <div className="flex items-center gap-1">
        <NotificationBell/>
        <button onClick={toggleDark}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-all"
          title={dark ? 'Switch to light' : 'Switch to dark'}>
          {dark ? <Icon name="sun" size={17}/> : <Icon name="moon" size={17}/>}
        </button>
        <div className="w-px h-5 bg-[var(--border)] mx-1"/>
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
          <Avatar initials={user?.name?.slice(0,2)} dept={user?.department} size="xs"/>
          <div className="hidden sm:block leading-tight">
            <p className="text-xs font-bold text-[var(--text-primary)]">{user?.name}</p>
            <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 tracking-wide">{user?.roll_number}</p>
          </div>
        </div>
        <button onClick={logout}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-all ml-1"
          title="Logout">
          <Icon name="logout" size={17}/>
        </button>
      </div>
    </header>
  )
}
