import { useState, useEffect, useRef, useCallback } from 'react'
import Icon from './Icons.jsx'
import { notifAPI } from '../../api/notifications.js'

const TYPE_ICON = {
  join_request:      { icon:'userPlus',   color:'text-indigo-600 dark:text-indigo-400',  bg:'bg-indigo-50 dark:bg-indigo-500/10' },
  request_accepted:  { icon:'checkCircle',color:'text-green-600 dark:text-green-400',    bg:'bg-green-50 dark:bg-green-500/10'   },
  request_rejected:  { icon:'x',          color:'text-red-600 dark:text-red-400',        bg:'bg-red-50 dark:bg-red-500/10'       },
  member_removed:    { icon:'x',          color:'text-red-600 dark:text-red-400',        bg:'bg-red-50 dark:bg-red-500/10'       },
  member_added:      { icon:'userPlus',   color:'text-green-600 dark:text-green-400',    bg:'bg-green-50 dark:bg-green-500/10'   },
  group_locked:      { icon:'lock',       color:'text-amber-600 dark:text-amber-400',    bg:'bg-amber-50 dark:bg-amber-500/10'   },
  group_unlocked:    { icon:'unlock',     color:'text-cyan-600 dark:text-cyan-400',      bg:'bg-cyan-50 dark:bg-cyan-500/10'     },
  general:           { icon:'fileText',   color:'text-slate-600 dark:text-slate-400',    bg:'bg-slate-50 dark:bg-slate-500/10'   },
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

export default function NotificationBell() {
  const [open,    setOpen]    = useState(false)
  const [notifs,  setNotifs]  = useState([])
  const [unread,  setUnread]  = useState(0)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  const load = useCallback(async (showLoad=false) => {
    if (showLoad) setLoading(true)
    try {
      const r = await notifAPI.list()
      setNotifs(r.data.notifications || [])
      setUnread(r.data.unread || 0)
    } catch (_) {}
    finally { setLoading(false) }
  }, [])

  // Poll every 30 seconds
  useEffect(() => {
    load()
    const t = setInterval(() => load(), 30000)
    return () => clearInterval(t)
  }, [load])

  // Close on outside click
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const openPanel = () => { setOpen(p=>!p); if (!open) load(true) }

  const markRead = async (id) => {
    await notifAPI.markRead(id)
    setNotifs(p => p.map(n => n.id===id ? {...n, is_read:true} : n))
    setUnread(p => Math.max(0, p-1))
  }

  const markAll = async () => {
    await notifAPI.markRead()
    setNotifs(p => p.map(n => ({...n, is_read:true})))
    setUnread(0)
  }

  const remove = async (id, e) => {
    e.stopPropagation()
    await notifAPI.delete(id)
    const n = notifs.find(x=>x.id===id)
    setNotifs(p => p.filter(x=>x.id!==id))
    if (n && !n.is_read) setUnread(p=>Math.max(0,p-1))
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button onClick={openPanel}
        className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-all">
        <Icon name="bell" size={17}/>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Icon name="bell" size={15} className="text-[var(--text-muted)]"/>
              <span className="font-bold text-sm text-[var(--text-primary)]">Notifications</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{unread}</span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAll}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center">
                <Icon name="loader" size={20} className="animate-spin text-[var(--text-muted)] mx-auto"/>
              </div>
            ) : notifs.length === 0 ? (
              <div className="py-10 text-center">
                <Icon name="bell" size={28} className="text-[var(--text-faint)] mx-auto mb-2"/>
                <p className="text-sm text-[var(--text-muted)] font-medium">No notifications</p>
                <p className="text-xs text-[var(--text-faint)] mt-0.5">You're all caught up!</p>
              </div>
            ) : (
              notifs.map(n => {
                const t = TYPE_ICON[n.type] || TYPE_ICON.general
                return (
                  <div key={n.id}
                    onClick={() => !n.is_read && markRead(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 transition-all cursor-pointer
                      ${!n.is_read ? 'bg-indigo-50/50 dark:bg-indigo-500/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10' : 'hover:bg-[var(--bg-raised)]'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${t.bg}`}>
                      <Icon name={t.icon} size={14} className={t.color}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-semibold leading-snug ${!n.is_read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {n.title}
                        </p>
                        {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1"/>}
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-[var(--text-faint)] mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    <button onClick={e=>remove(n.id,e)}
                      className="shrink-0 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-hover)] text-[var(--text-faint)] hover:text-red-500 transition-all mt-0.5">
                      <Icon name="x" size={10}/>
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
