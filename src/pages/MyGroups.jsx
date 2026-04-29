import { useEffect, useState } from 'react'
import { PlusCircle, Search, Clock, Crown, Users } from 'lucide-react'
import { useApp }    from '../context/AppContext.jsx'
import { groupsAPI } from '../api/groups.js'
import GroupCard     from '../components/cards/GroupCard.jsx'
import Button        from '../components/ui/Button.jsx'
import Badge         from '../components/ui/Badge.jsx'
import Skeleton      from '../components/ui/Skeleton.jsx'
import EmptyState    from '../components/ui/EmptyState.jsx'
import { extractError } from '../hooks/useApi.js'

export default function MyGroups() {
  const { navigate }            = useApp()
  const [groups, setGroups]     = useState([])
  const [reqs,   setReqs]       = useState([])
  const [loading,setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([groupsAPI.myGroups(), groupsAPI.myRequests()])
      .then(([g, r]) => { setGroups(g.data.groups||[]); setReqs(r.data.requests||[]) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const leading = groups.filter(g => g.my_role === 'leader')
  const member  = groups.filter(g => g.my_role === 'member')

  if (loading) return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-48"/>
      {Array(4).fill(0).map((_,i) => <Skeleton key={i} className="h-20"/>)}
    </div>
  )

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">My Groups</h1>
          <p className="text-sm text-slate-400 mt-1">
            {groups.length === 0
              ? 'You have no groups yet'
              : `${groups.length} group${groups.length!==1?'s':''} · ${leading.length} leading, ${member.length} as member`
            }
          </p>
        </div>
        <Button size="sm" onClick={() => navigate('create-group')}>
          <PlusCircle size={14}/> New Group
        </Button>
      </div>

      {/* Empty state */}
      {groups.length === 0 && (
        <EmptyState icon="👥" title="No groups yet"
          description="Create your own group or browse to find one"
          action={
            <div className="flex gap-3">
              <Button onClick={() => navigate('browse-groups')}><Search size={14}/> Browse</Button>
              <Button variant="secondary" onClick={() => navigate('create-group')}><PlusCircle size={14}/> Create</Button>
            </div>
          }
        />
      )}

      {/* Leading section */}
      {leading.length > 0 && (
        <section className="animate-slide-up" style={{ animationFillMode:'both' }}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-surface-600">
            <Crown size={14} className="text-amber-400"/>
            <h2 className="font-bold text-white text-sm">Leading</h2>
            <Badge variant="leader">{leading.length}</Badge>
          </div>
          <div className="space-y-2">
            {leading.map(g => <GroupCard key={g.id} group={g} compact onClick={() => navigate('group-detail', g)}/>)}
          </div>
        </section>
      )}

      {/* Member section */}
      {member.length > 0 && (
        <section className="animate-slide-up" style={{ animationFillMode:'both' }}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-surface-600">
            <Users size={14} className="text-slate-400"/>
            <h2 className="font-bold text-white text-sm">Member of</h2>
            <Badge variant="member">{member.length}</Badge>
          </div>
          <div className="space-y-2">
            {member.map(g => <GroupCard key={g.id} group={g} compact onClick={() => navigate('group-detail', g)}/>)}
          </div>
        </section>
      )}

      {/* Request history */}
      {reqs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-surface-600">
            <Clock size={14} className="text-slate-400"/>
            <h2 className="font-bold text-white text-sm">Join Request History</h2>
            <Badge variant="brand">{reqs.length}</Badge>
          </div>
          <div className="space-y-2">
            {reqs.map(r => (
              <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-800 border border-surface-600">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{r.group_name || `Group #${r.group}`}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock size={10}/> {r.created_at?.split('T')[0]}
                  </p>
                </div>
                <Badge variant={r.status}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
