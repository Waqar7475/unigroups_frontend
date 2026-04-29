import { useEffect, useState } from 'react'
import { ArrowLeft, Lock, Unlock, UserPlus, RefreshCw, ShieldAlert, Pencil, Trash2, Check, X } from 'lucide-react'
import { useApp }     from '../context/AppContext.jsx'
import { useAuth }    from '../context/AuthContext.jsx'
import { groupsAPI }  from '../api/groups.js'
import MemberRow      from '../components/cards/MemberRow.jsx'
import RequestRow     from '../components/cards/RequestRow.jsx'
import Button         from '../components/ui/Button.jsx'
import Badge          from '../components/ui/Badge.jsx'
import Card           from '../components/ui/Card.jsx'
import Alert          from '../components/ui/Alert.jsx'
import Skeleton       from '../components/ui/Skeleton.jsx'
import Progress       from '../components/ui/Progress.jsx'
import { extractError } from '../hooks/useApi.js'

export default function GroupDetails() {
  const { selectedGroup, navigate } = useApp()
  const { user, isAdmin }           = useAuth()
  const [group,   setGroup]  = useState(null)
  const [loading, setLoad]   = useState(true)
  const [error,   setError]  = useState('')
  const [ok,      setOk]     = useState('')
  const [locking, setLock]   = useState(false)
  const [deleting,setDel]    = useState(false)
  const [confirm, setConfirm]= useState(false)

  const groupId = selectedGroup?.id

  const load = () => {
    if (!groupId) return
    setLoad(true)
    groupsAPI.detail(groupId)
      .then(r => setGroup(r.data.group))
      .catch(e => setError(extractError(e)))
      .finally(() => setLoad(false))
  }

  useEffect(() => { load() }, [groupId])

  if (!groupId) return (
    <div className="py-20 text-center">
      <p className="text-slate-500 mb-4">No group selected.</p>
      <Button variant="outline" onClick={() => navigate('browse-groups')}>Browse Groups</Button>
    </div>
  )
  if (loading) return <div className="max-w-2xl space-y-4">{Array(3).fill(0).map((_,i)=><Skeleton key={i} className="h-36"/>)}</div>
  if (!group) return <Alert type="error" message={error || 'Group not found.'}/>

  const isLeader    = group.members?.some(m => m.user?.id === user?.id && m.role === 'leader')
  const isMember    = group.members?.some(m => m.user?.id === user?.id)
  const pending     = group.pending_requests || []
  const memberCount = group.member_count ?? group.members?.length ?? 0
  const deptBar     = group.department === 'SE' ? 'bg-orange-400' : 'bg-cyan-400'
  const deptBadge   = group.department === 'SE' ? 'se' : 'cs'

  const toggleLock = async () => {
    setLock(true); setError(''); setOk('')
    try { const r = await (group.is_locked ? groupsAPI.unlock : groupsAPI.lock)(group.id); setOk(r.data.message); load() }
    catch (e) { setError(extractError(e)) }
    finally { setLock(false) }
  }

  const handleAccept = async (rid) => {
    setError(''); setOk('')
    try { const r = await groupsAPI.acceptRequest(rid); setOk(r.data.message); load() }
    catch (e) { setError(extractError(e)) }
  }

  const handleReject = async (rid) => {
    setError(''); setOk('')
    try { const r = await groupsAPI.rejectRequest(rid); setOk(r.data.message); load() }
    catch (e) { setError(extractError(e)) }
  }

  const handleDelete = async () => {
    setDel(true)
    try { await groupsAPI.delete(group.id); navigate('my-groups') }
    catch (e) { setError(extractError(e)); setDel(false) }
  }

  const handleJoin = async () => {
    setError(''); setOk('')
    try { const r = await groupsAPI.sendRequest({ group_id: group.id }); setOk(r.data.message) }
    catch (e) { setError(extractError(e)) }
  }

  return (
    <div className="max-w-2xl space-y-5 animate-slide-up" style={{ animationFillMode:'both' }}>
      {/* Back button */}
      <button onClick={() => navigate('browse-groups')}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform"/>
        Back to groups
      </button>

      {ok    && <Alert type="success" message={ok}/>}
      {error && <Alert type="error"   message={error} onClose={() => setError('')}/>}

      {/* ── HERO CARD ─────────────────────────────────────────────────── */}
      <Card padding={false} className="overflow-hidden">
        {/* Dept color top strip */}
        <div className={`h-1 w-full ${deptBar}`}/>

        <div className="p-6">
          {/* Tags + controls row */}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={deptBadge}>
                {group.department === 'SE' ? '💻' : '🖥️'} {group.department}
              </Badge>
              <Badge variant={group.is_locked ? 'locked' : 'open'}>
                {group.is_locked ? <Lock size={9}/> : <Unlock size={9}/>}
                {group.is_locked ? 'Locked' : 'Open'}
              </Badge>
              {isLeader  && <Badge variant="leader">⭐ Leader</Badge>}
              {!isLeader && isMember && <Badge variant="member">◆ Member</Badge>}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={load}>
                <RefreshCw size={13}/>
              </Button>
              {(isLeader || isAdmin) && (
                <Button variant={group.is_locked ? 'success' : 'outline'} size="sm"
                  loading={locking} onClick={toggleLock}>
                  {group.is_locked ? <><Unlock size={13}/> Unlock</> : <><Lock size={13}/> Lock</>}
                </Button>
              )}
            </div>
          </div>

          {/* Group name */}
          <h1 className="text-2xl font-bold text-white mb-1">{group.name}</h1>
          {group.description && <p className="text-sm text-slate-400 mb-4">{group.description}</p>}

          {/* Progress */}
          <div className="mt-4">
            <Progress current={memberCount} max={group.max_members}/>
          </div>
        </div>
      </Card>

      {/* ── ADMIN CONTROLS ────────────────────────────────────────────── */}
      {isAdmin && (
        <Card className="border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={15} className="text-red-400"/>
            <h2 className="font-bold text-sm text-red-400">Admin Controls</h2>
            <Badge variant="admin">Admin Only</Badge>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="ghost" size="sm" className="border border-surface-600">
              <Pencil size={13}/> Edit
            </Button>
            {!confirm ? (
              <Button variant="danger" size="sm" onClick={() => setConfirm(true)}>
                <Trash2 size={13}/> Delete Group
              </Button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-red-400 font-medium">Permanently delete?</span>
                <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
                  <Check size={12}/> Yes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>Cancel</Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ── MEMBERS LIST ──────────────────────────────────────────────── */}
      <Card>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-bold text-white">Members</h2>
          <span className="text-xs font-bold text-accent-400">[ {memberCount} ]</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          {group.max_members - memberCount} slot{group.max_members - memberCount !== 1 ? 's' : ''} remaining
        </p>
        <div>
          {group.members?.map(m => (
            <MemberRow key={m.id} member={m} groupId={group.id}
              isLeader={isLeader} isAdmin={isAdmin}
              currentUser={user} onRemoved={load}/>
          ))}
        </div>
      </Card>

      {/* ── JOIN REQUESTS (leader/admin only) ─────────────────────────── */}
      {(isLeader || isAdmin) && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={15} className="text-accent-400"/>
            <h2 className="font-bold text-white">Join Requests</h2>
            {pending.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-accent-500/15 text-accent-400 text-xs font-bold border border-accent-500/20">
                {pending.length} pending
              </span>
            )}
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500">No pending requests.</p>
          ) : (
            <div className="space-y-2">
              {pending.map(r => (
                <RequestRow key={r.id} request={r} onAccept={handleAccept} onReject={handleReject}/>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ── NON-MEMBER JOIN CTA ───────────────────────────────────────── */}
      {!isMember && !group.is_locked && memberCount < group.max_members && (
        <Button size="lg" fullWidth onClick={handleJoin}>
          <UserPlus size={16}/> Request to Join Group
        </Button>
      )}
      {!isMember && (group.is_locked || memberCount >= group.max_members) && (
        <div className="text-center py-4 rounded-xl bg-surface-800 border border-surface-600">
          <p className="text-sm text-slate-500">
            {group.is_locked ? '🔒 This group is locked.' : '👥 This group is full.'}
          </p>
        </div>
      )}
    </div>
  )
}
