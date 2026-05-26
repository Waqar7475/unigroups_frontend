import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar  from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'
import { useApp } from '../context/AppContext.jsx'
import { pageVariants } from '../utils/animations.js'

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { currentPage } = useApp()
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Navbar onMenuToggle={() => setOpen(p=>!p)}/>
      <Sidebar open={open} setOpen={setOpen}/>
      <main className="lg:pl-64 pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-6 max-w-5xl mx-auto">
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
