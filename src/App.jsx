import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { AppProvider, useApp }   from './context/AppContext.jsx'
import Layout       from './layout/Layout.jsx'
import Login        from './pages/Login.jsx'
import Signup       from './pages/Signup.jsx'
import Dashboard    from './pages/Dashboard.jsx'
import CreateGroup  from './pages/CreateGroup.jsx'
import BrowseGroups from './pages/BrowseGroups.jsx'
import MyGroups     from './pages/MyGroups.jsx'
import GroupDetails from './pages/GroupDetails.jsx'
import AdminUsers   from './pages/AdminUsers.jsx'
import Spinner      from './components/ui/Spinner.jsx'

const PAGE_MAP = {
  'dashboard':     Dashboard,
  'create-group':  CreateGroup,
  'browse-groups': BrowseGroups,
  'my-groups':     MyGroups,
  'group-detail':  GroupDetails,
  'admin-users':   AdminUsers,
}

function PageRouter() {
  const { currentPage } = useApp()
  const Page = PAGE_MAP[currentPage] || Dashboard
  return <Page/>
}

function AuthShell() {
  const [mode, setMode] = useState('login')
  return mode === 'login'
    ? <Login  onSwitch={() => setMode('signup')}/>
    : <Signup onSwitch={() => setMode('login')}/>
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/30">
        <span className="text-white text-xl">🎓</span>
      </div>
      <Spinner size={22} className="text-accent-400"/>
      <p className="text-xs text-slate-500 font-medium">Connecting to backend…</p>
    </div>
  )
}

function AppShell() {
  const { isAuth, loading } = useAuth()
  if (loading) return <LoadingScreen/>
  if (!isAuth) return <AuthShell/>
  return <Layout><PageRouter/></Layout>
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppShell/>
      </AppProvider>
    </AuthProvider>
  )
}
