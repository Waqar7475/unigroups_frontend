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
import AdminGroups  from './pages/AdminGroups.jsx'
import Icon         from './components/ui/Icons.jsx'

const PAGES = {
  'dashboard':Dashboard, 'create-group':CreateGroup, 'browse-groups':BrowseGroups,
  'my-groups':MyGroups, 'group-detail':GroupDetails, 'admin-users':AdminUsers,
  'admin-groups':AdminGroups,
}

function PageRouter() { const { currentPage } = useApp(); const Page = PAGES[currentPage]||Dashboard; return <Page/> }
function AuthShell()  { const [mode,setMode] = useState('login'); return mode==='login'?<Login onSwitch={()=>setMode('signup')}/>:<Signup onSwitch={()=>setMode('login')}/> }

function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <Icon name="layers" size={20} className="text-white"/>
      </div>
      <Icon name="loader" size={24} className="animate-spin text-indigo-500"/>
      <p className="text-xs text-[var(--text-muted)]">Connecting…</p>
    </div>
  )
}

function AppShell() {
  const { isAuth, loading } = useAuth()
  if (loading) return <Loading/>
  if (!isAuth)  return <AuthShell/>
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
