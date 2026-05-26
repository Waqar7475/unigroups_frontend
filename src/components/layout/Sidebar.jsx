import { motion, AnimatePresence } from 'framer-motion'
import Icon from '../ui/Icons.jsx'
import { useApp }  from '../../context/AppContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar }  from '../ui/misc.jsx'
import { spring, staggerContainer, fadeUp } from '../../utils/animations.js'

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

function NavItem({ item, active, onClick, isAdmin }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x:3, transition:spring.snappy }}
      whileTap={{ scale:0.97, transition:spring.instant }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group
        ${active
          ? isAdmin
            ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
            : 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/20'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] border border-transparent'}`}>
      <motion.div
        animate={active ? { scale:1.1 } : { scale:1 }}
        transition={spring.bouncy}
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors
          ${active
            ? isAdmin ? 'bg-red-100 dark:bg-red-500/20' : 'bg-indigo-100 dark:bg-indigo-500/20'
            : 'bg-[var(--bg-raised)] group-hover:bg-[var(--bg-hover)]'}`}>
        <Icon name={item.icon} size={14}
          className={active
            ? isAdmin ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'
            : 'text-[var(--text-muted)]'}/>
      </motion.div>
      {item.label}
      {active && (
        <motion.div initial={{opacity:0,x:-5}} animate={{opacity:1,x:0}} transition={spring.snappy} className="ml-auto">
          <Icon name="chevronRight" size={13} className={isAdmin ? 'text-red-400 opacity-60' : 'text-indigo-400 opacity-60'}/>
        </motion.div>
      )}
    </motion.button>
  )
}

export default function Sidebar({ open, setOpen }) {
  const { currentPage, navigate } = useApp()
  const { isAdmin, user }         = useAuth()
  const go = id => { navigate(id); setOpen(false) }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            transition={{duration:0.2}}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}/>
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : undefined }}
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col transition-transform duration-300 ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>

        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          <motion.p
            initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}
            className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">
            Navigation
          </motion.p>

          <motion.div variants={staggerContainer} initial="animate" animate="animate" className="space-y-0.5">
            {NAV.map((item, i) => (
              <motion.div key={item.id} variants={fadeUp} custom={i}>
                <NavItem item={item} active={currentPage===item.id} onClick={()=>go(item.id)} isAdmin={false}/>
              </motion.div>
            ))}
          </motion.div>

          {isAdmin && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
              <div className="px-3 pt-5 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Admin</p>
              </div>
              <div className="space-y-0.5">
                {ADMIN_NAV.map((item, i) => (
                  <motion.div key={item.id}
                    initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}}
                    transition={{...spring.smooth, delay: 0.35 + i*0.07}}>
                    <NavItem item={item} active={currentPage===item.id} onClick={()=>go(item.id)} isAdmin={true}/>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </nav>

        <motion.div
          initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{...spring.smooth, delay:0.4}}
          className="px-3 py-4 border-t border-[var(--border)]">
          <motion.div whileHover={{scale:1.01}} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
            <div className="relative shrink-0">
              <Avatar initials={user?.name?.slice(0,2)} dept={user?.department} size="sm"/>
              <motion.div
                animate={{ scale:[1,1.2,1] }} transition={{ repeat:Infinity, duration:2, delay:1 }}
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--bg-raised)]"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 tracking-wide truncate">{user?.roll_number}</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.aside>
    </>
  )
}
