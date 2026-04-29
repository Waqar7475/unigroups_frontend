/**
 * MemberRow.jsx
 * =============
 * Single member row inside Group Details.
 * CUSTOMIZE: Avatar size, name style, remove button style.
 */
import { useState }   from 'react'
import { X, Crown }   from 'lucide-react'
import Avatar   from '../ui/Avatar.jsx'
import Badge    from '../ui/Badge.jsx'
import Button   from '../ui/Button.jsx'
import { groupsAPI }  from '../../api/groups.js'
import { extractError } from '../../hooks/useApi.js'

export default function MemberRow({ member, groupId, isLeader, isAdmin, currentUser, onRemoved }) {
  const [loading, setLoading] = useState(false)
  const isMe      = member.user?.id === currentUser?.id
  const initials  = member.user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || '??'
  const canRemove = isAdmin || (isLeader && !isMe && member.role !== 'leader')

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${member.user?.name} from this group?`)) return
    setLoading(true)
    try   { await groupsAPI.removeMember(groupId, member.user?.id); onRemoved() }
    catch (e) { alert(extractError(e)) }
    finally   { setLoading(false) }
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-surface-600 last:border-0">
      {/* Avatar */}
      <Avatar initials={initials} dept={member.user?.department} size="md"/>

      {/* Name + roll */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-white truncate">{member.user?.name}</p>
          {isMe && <span className="text-[10px] text-accent-400 font-medium">(you)</span>}
        </div>
        <p className="text-[11px] font-mono text-accent-400/70 mt-0.5">{member.user?.roll_number}</p>
      </div>

      {/* Role badge */}
      <Badge variant={member.role}>
        {member.role === 'leader' && <Crown size={9}/>}
        {member.role}
      </Badge>

      {/* Remove button */}
      {canRemove && (
        <Button variant="danger" size="xs" loading={loading} onClick={handleRemove}>
          <X size={12}/>
        </Button>
      )}
    </div>
  )
}
