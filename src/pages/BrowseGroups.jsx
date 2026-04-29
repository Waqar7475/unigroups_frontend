import { useEffect, useState, useCallback } from 'react'
import { Search, SlidersHorizontal }        from 'lucide-react'
import { useApp }    from '../context/AppContext.jsx'
import { useAuth }   from '../context/AuthContext.jsx'
import { groupsAPI } from '../api/groups.js'
import GroupCard     from '../components/cards/GroupCard.jsx'
import Input         from '../components/ui/Input.jsx'
import Skeleton      from '../components/ui/Skeleton.jsx'
import Alert         from '../components/ui/Alert.jsx'
import EmptyState    from '../components/ui/EmptyState.jsx'
import Button        from '../components/ui/Button.jsx'
import Badge         from '../components/ui/Badge.jsx'
import { extractError } from '../hooks/useApi.js'

const DEPT_TABS   = [{ k:'all', l:'All Depts', icon:'🏫' }, { k:'SE', l:'Software Engineering', icon:'💻' }, { k:'CS', l:'Computer Science', icon:'🖥️' }]
const STATUS_TABS = [{ k:'all', l:'All' }, { k:'open', l:'Open 🟢' }, { k:'locked', l:'Locked 🔒' }]

export default function BrowseGroups() {
  const { navigate }          = useApp()
  const { user }              = useAuth()
  const myDept                = user?.department
  const [groups,  setGroups]  = useState([])
  const [loading, setLoading] = useState(true)
  const [query,   setQuery]   = useState('')
  const [dept,    setDept]    = useState(myDept || 'all')
  const [status,  setStatus]  = useState('all')
  const [joining, setJoining] = useState(null)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')

  const load = useCallback(() => {
    setLoading(true)
    const p = {}
    if (dept !== 'all')   p.dept   = dept
    if (status !== 'all') p.status = status
    if (query.trim())     p.search = query.trim()
    groupsAPI.list(p)
      .then(r => setGroups(r.data.groups || []))
      .catch(e => setError(extractError(e)))
      .finally(() => setLoading(false))
  }, [dept, status, query])

  useEffect(() => { load() }, [dept, status])
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t) }, [query])

  const join = async (id) => {
    setJoining(id); setError(''); setSuccess('')
    try { const r = await groupsAPI.sendRequest({ group_id:id }); setSuccess(r.data.message); load() }
    catch (e) { setError(extractError(e)) }
    finally { setJoining(null) }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Browse Groups</h1>
        <p className="text-sm text-slate-400 mt-1">
          Find and join study or project groups
          {myDept && <span className="text-accent-400 font-medium"> · Your department shown first</span>}
        </p>
      </div>

      {success && <Alert type="success" message={success}/>}
      {error   && <Alert type="error"   message={error} onClose={() => setError('')}/>}

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input icon={<Search size={15}/>} placeholder="Search groups…" value={query} onChange={e => setQuery(e.target.value)}/>
        </div>
        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-800 border border-surface-600 shrink-0">
          {STATUS_TABS.map(t => (
            <button key={t.k} onClick={() => setStatus(t.k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === t.k ? 'bg-accent-500/20 text-accent-400 border border-accent-500/25' : 'text-slate-400 hover:text-white hover:bg-surface-700'
              }`}>{t.l}</button>
          ))}
        </div>
      </div>

      {/* Dept tabs */}
      <div className="flex gap-2 flex-wrap">
        {DEPT_TABS.map(({ k, l, icon }) => {
          const isMyDept = k !== 'all' && k === myDept
          return (
            <button key={k} onClick={() => setDept(k)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                dept === k
                  ? 'bg-accent-500 border-accent-500 text-white shadow-lg shadow-accent-500/20'
                  : 'bg-surface-800 border-surface-600 text-slate-400 hover:text-white hover:border-accent-500/30'
              }`}>
              <span>{icon}</span> {l}
              {isMyDept && <Badge variant={k==='SE'?'se':'cs'} className="text-[9px] !px-1.5 !py-0">Mine</Badge>}
            </button>
          )
        })}
      </div>

      {!loading && (
        <p className="text-xs text-slate-500 font-medium">
          {groups.length} group{groups.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_,i) => <Skeleton key={i} className="h-52"/>)
        ) : groups.length === 0 ? (
          <div className="col-span-full">
            <EmptyState icon="🔍" title="No groups found"
              description={query ? `No results for "${query}"` : 'Try a different filter'}
              action={<Button variant="outline" size="sm" onClick={() => { setQuery(''); setDept('all'); setStatus('all') }}>
                Clear filters
              </Button>}
            />
          </div>
        ) : (
          groups.map(g => (
            <GroupCard key={g.id} group={g} showJoin
              joinLoading={joining === g.id} onJoin={join}
              onClick={() => navigate('group-detail', g)}/>
          ))
        )}
      </div>
    </div>
  )
}
