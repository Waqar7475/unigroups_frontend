/**
 * Layout.jsx
 * ==========
 * Main authenticated layout — Navbar + Sidebar + Content.
 * CUSTOMIZE: padding, max-width of content area below.
 */
import { useState } from 'react'
import Navbar  from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentPage } = useApp()

  return (
    <div className="min-h-screen bg-surface-950 text-slate-100">
      <Navbar onMenuToggle={() => setSidebarOpen(p => !p)}/>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}/>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────── */}
      <main className="lg:pl-64 pt-16 min-h-screen">
        {/* Change max-w-5xl to max-w-6xl or max-w-full to widen content */}
        <div key={currentPage}
          className="p-6 max-w-5xl mx-auto animate-fade-in"
          style={{ animationFillMode: 'both' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
