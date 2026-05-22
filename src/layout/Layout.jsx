import { useState } from 'react'
import Navbar  from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import { useApp } from '../context/AppContext.jsx'
export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { currentPage } = useApp()
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Navbar onMenuToggle={() => setOpen(p=>!p)}/>
      <Sidebar open={open} setOpen={setOpen}/>
      <main className="lg:pl-64 pt-16 min-h-screen">
        <div key={currentPage} className="p-6 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
