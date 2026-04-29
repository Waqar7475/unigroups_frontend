import { useEffect, useState }  from 'react'
import { PlusCircle, Search, Users, ArrowRight } from 'lucide-react'
import { useAuth }    from '../context/AuthContext.jsx'
import { useApp }     from '../context/AppContext.jsx'
import { groupsAPI }  from '../api/groups.js'
import GroupCard      from '../components/cards/GroupCard.jsx'
import StatCard       from '../components/cards/StatCard.jsx'
import Button         from '../components/ui/Button.jsx'
import Skeleton       from '../components/ui/Skeleton.jsx'
import EmptyState     from '../components/ui/EmptyState.jsx'
import Badge          from '../components/ui/Badge.jsx'

const DEPT_CONFIG = {
  SE: { label:'Software Engineering', color:'text-orange-400', bar:'bg-orange-400', badge:'se', icon:'💻' },
  CS: { label:'Computer Science',     color:'text-cyan-400',   bar:'bg-cyan-400',   badge:'cs', icon:'🖥️' },
}

function QuickActionCard({ icon, label, desc, onClick }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl bg-surface-800 border border-surface-600 hover:border-accent-500/40 hover:bg-surface-700 transition-all group text-left w-full">
      <div className="w-11 h-11 rounded-xl bg-surface-700 group-hover:bg-accent-500/15 flex items-center justify-center text-2xl shrink-0 transition-all">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white group-hover:text-accent-400 transition-colors">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <ArrowRight size={15} className="text-slate-600 group-hover:text-accent-400 group-hover:translate-x-1 transition-all shrink-0"/>
    </button>
  )
}

function DeptSection({ dept, data, navigate }) {
  const cfg    = DEPT_CONFIG[dept]
  const groups = data?.groups || []

  return (
    <section className="animate-slide-up" style={{ animationFillMode:'both' }}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-5 w-1 rounded-full ${cfg.bar}`}/>
          <h2 className="font-bold text-white">{cfg.label}</h2>
          <Badge variant={cfg.badge}>{cfg.icon} {groups.length}</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('browse-groups')}
          className="text-accent-400 hover:text-accent-300">
          View all <ArrowRight size={13}/>
        </Button>
      </div>

      {groups.length === 0 ? (
        <EmptyState icon={cfg.icon} title={`No ${cfg.label} groups yet`}
          action={<Button variant="outline" size="sm" onClick={() => navigate('create-group')}>
            <PlusCircle size={13}/> Create one
          </Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.slice(0, 4).map(g => (
            <GroupCard key={g.id} group={g} onClick={() => navigate('group-detail', g)}/>
          ))}
        </div>
      )}
    </section>
  )
}

export default function Dashboard() {
  const { user }              = useAuth()
  const { navigate }          = useApp()
  const [byDept,  setByDept]  = useState({ SE:{groups:[]}, CS:{groups:[]} })
  const [all,     setAll]     = useState([])
  const [mine,    setMine]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([groupsAPI.list(), groupsAPI.myGroups()])
      .then(([a, m]) => {
        setAll(a.data.groups || [])
        setByDept(a.data.by_department || { SE:{groups:[]}, CS:{groups:[]} })
        setMine(m.data.groups || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const openCount = all.filter(g => g.status === 'open').length
  const firstName = user?.name?.split(' ')[0] || 'there'
  const myDept    = user?.department

  return (
    <div className="space-y-10">
      {/* ── HERO GREETING ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap animate-slide-up"
        style={{ animationFillMode:'both' }}>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
            Welcome back
          </p>
          <h1 className="text-3xl font-bold text-white">{user?.name} 👋</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs font-mono text-accent-400">{user?.roll_number}</span>
            {myDept && (
              <Badge variant={myDept === 'SE' ? 'se' : 'cs'}>
                {myDept === 'SE' ? '💻' : '🖥️'} {myDept === 'SE' ? 'Software Engineering' : 'Computer Science'}
              </Badge>
            )}
          </div>
        </div>
        <Button onClick={() => navigate('create-group')}>
          <PlusCircle size={15}/> New Group
        </Button>
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_,i) => <Skeleton key={i} className="h-28"/>)
        ) : (
          <>
            <StatCard label="Total Groups"  value={all.length}             icon="🏫" gradient="from-accent-500/20 to-accent-700/10"/>
            <StatCard label="My Groups"     value={mine.length}             icon="👥" gradient="from-amber-500/20 to-amber-700/10"/>
            <StatCard label="Open Groups"   value={openCount}               icon="🟢" gradient="from-green-500/20 to-green-700/10"/>
            <StatCard label="Locked"        value={all.length - openCount}  icon="🔒" gradient="from-red-500/20 to-red-700/10"/>
          </>
        )}
      </div>

      {/* ── QUICK ACTIONS ─────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickActionCard icon="✨" label="Create Group"  desc="Start a new team"       onClick={() => navigate('create-group')}/>
          <QuickActionCard icon="🔍" label="Browse Groups" desc="Find groups to join"     onClick={() => navigate('browse-groups')}/>
          <QuickActionCard icon="👥" label="My Groups"     desc="View your memberships"   onClick={() => navigate('my-groups')}/>
        </div>
      </div>

      {/* ── GROUPS BY DEPARTMENT ──────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_,i) => <Skeleton key={i} className="h-52"/>)}
        </div>
      ) : (
        <div className="space-y-12">
          {myDept !== 'CS' ? (
            <>
              <DeptSection dept="SE" data={byDept.SE} navigate={navigate}/>
              <DeptSection dept="CS" data={byDept.CS} navigate={navigate}/>
            </>
          ) : (
            <>
              <DeptSection dept="CS" data={byDept.CS} navigate={navigate}/>
              <DeptSection dept="SE" data={byDept.SE} navigate={navigate}/>
            </>
          )}
        </div>
      )}
    </div>
  )
}
