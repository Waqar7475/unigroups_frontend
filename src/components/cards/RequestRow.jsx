/**
 * RequestRow.jsx
 * ==============
 * Single pending join request row (leader/admin view).
 * CUSTOMIZE: Row bg, button styles, layout.
 */
import { useState } from 'react'
import { Check, X } from 'lucide-react'
import Avatar  from '../ui/Avatar.jsx'
import Button  from '../ui/Button.jsx'

export default function RequestRow({ request, onAccept, onReject }) {
  const [accepting, setAccepting] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const initials = request.user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2) || '??'

  return (
    /* ── ROW CONTAINER — customize bg/border here ── */
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-900 border border-surface-600">
      <Avatar initials={initials} dept={request.user?.department} size="sm"/>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{request.user?.name}</p>
        <p className="text-[10px] font-mono text-accent-400/70">{request.user?.roll_number}</p>
        {request.message && (
          <p className="text-xs text-slate-500 italic mt-0.5 truncate">"{request.message}"</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 shrink-0">
        <Button variant="success" size="sm" loading={accepting}
          onClick={async () => { setAccepting(true); await onAccept(request.id); setAccepting(false) }}>
          <Check size={12}/> Accept
        </Button>
        <Button variant="danger" size="sm" loading={rejecting}
          onClick={async () => { setRejecting(true); await onReject(request.id); setRejecting(false) }}>
          <X size={12}/>
        </Button>
      </div>
    </div>
  )
}
