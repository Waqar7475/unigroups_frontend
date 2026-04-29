import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [dark,          setDark]          = useState(true)
  const [currentPage,   setCurrentPage]   = useState('dashboard')
  const [selectedGroup, setSelectedGroup] = useState(null)

  const toggleDark = () => setDark(p => !p)

  const navigate = (page, group = null) => {
    if (group) setSelectedGroup(group)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AppContext.Provider value={{ dark, toggleDark, currentPage, setCurrentPage, selectedGroup, navigate }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const c = useContext(AppContext)
  if (!c) throw new Error('useApp must be within AppProvider')
  return c
}
