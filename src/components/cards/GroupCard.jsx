/**
 * GroupCard.jsx
 * =============
 * CUSTOMIZE THIS FILE to change how groups look in lists.
 *
 * Easy changes:
 *   - Card shape/shadow: find Card component props below
 *   - Dept colors: change `deptConfig` object
 *   - Font sizes: change text-* classes on name/subject
 *   - Progress bar: edit Progress component in ui/Progress.jsx
 *   - Join button: find "JOIN BUTTON" comment
 *
 * Props:
 *   group       object   — group data from API
 *   onClick     fn       — navigate to detail
 *   showJoin    bool     — show join button (Browse page)
 *   onJoin      fn       — join handler
 *   compact     bool     — horizontal layout (My Groups page)
 *   joinLoading bool     — loading state for join button
 */
import { Lock, Unlock, Crown, Calendar, ChevronRight } from 'lucide-react'
import Card     from '../ui/Card.jsx'
import Badge    from '../ui/Badge.jsx'
import Button   from '../ui/Button.jsx'
import Progress from '../ui/Progress.jsx'

/* ── DEPT COLORS — change here to restyle SE/CS ────────────────────── */
const deptConfig = {
  SE: {
    label:    'Software Engineering',
    short:    'SE',
    topBar:   'bg-orange-400',
    chip:     'bg-orange-400/10 text-orange-400 border border-orange-400/20',
    icon:     '💻',
  },
  CS: {
    label:    'Computer Science',
    short:    'CS',
    topBar:   'bg-cyan-400',
    chip:     'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20',
    icon:     '🖥️',
  },
}

export default function GroupCard({ group, onClick, showJoin = false, onJoin, compact = false, joinLoading = false }) {
  const memberCount = group.member_count ?? group.members?.length ?? 0
  const isFull      = memberCount >= group.max_members
  const isMine      = !!group.my_role
  const dept        = deptConfig[group.department] ?? deptConfig.SE

  /* ── COMPACT LAYOUT (My Groups list view) ─────────────────────────── */
  if (compact) {
    return (
      <Card onClick={onClick} className="flex items-center gap-4 !py-3.5 group">
        {/* Dept icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${dept.chip}`}>
          {dept.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <h3 className="font-bold text-sm text-white truncate group-hover:text-accent-400 transition-colors">
              {group.name}
            </h3>
            {group.my_role && (
              <Badge variant={group.my_role}>
                {group.my_role === 'leader' && <Crown size={9}/>}
                {group.my_role}
              </Badge>
            )}
            <Badge variant={group.status}>
              {group.status === 'open' ? <Unlock size={9}/> : <Lock size={9}/>}
              {group.status}
            </Badge>
          </div>
          <p className={`text-xs font-medium ${group.department === 'SE' ? 'text-orange-400' : 'text-cyan-400'}`}>
            {dept.label} · {memberCount}/{group.max_members} members
          </p>
        </div>
        <ChevronRight size={15} className="text-slate-600 group-hover:text-slate-300 transition-colors shrink-0"/>
      </Card>
    )
  }

  /* ── FULL CARD LAYOUT (Dashboard / Browse grid) ───────────────────── */
  return (
    <Card onClick={onClick} className="flex flex-col gap-0 overflow-hidden !p-0 group animate-slide-up"
      style={{ animationFillMode: 'both' }}>

      {/* ── DEPT TOP BAR — change height/color in deptConfig ── */}
      <div className={`h-1 w-full ${dept.topBar}`}/>

      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Dept chip */}
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md mb-2 ${dept.chip}`}>
              <span>{dept.icon}</span> {dept.label}
            </span>
            {/* Group name — CUSTOMIZE FONT SIZE HERE */}
            <h3 className="font-bold text-base text-white leading-snug truncate group-hover:text-accent-400 transition-colors">
              {group.name}
            </h3>
            {group.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{group.description}</p>
            )}
          </div>
          <Badge variant={group.status}>
            {group.status === 'open' ? <Unlock size={9}/> : <Lock size={9}/>}
            {group.status === 'open' ? 'Open' : 'Locked'}
          </Badge>
        </div>

        {/* Progress bar */}
        <Progress current={memberCount} max={group.max_members}/>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-surface-600">
          {/* Left: role badge or date */}
          {isMine ? (
            <Badge variant={group.my_role}>
              {group.my_role === 'leader' && <Crown size={9}/>}
              {group.my_role}
            </Badge>
          ) : (
            <span className="text-[11px] text-slate-600 flex items-center gap-1">
              <Calendar size={10}/> {group.created_at?.split('T')[0]}
            </span>
          )}

          {/* ── JOIN BUTTON — customize variant/size here ── */}
          {showJoin && !isMine && !isFull && group.status === 'open' && (
            <Button variant="outline" size="sm" loading={joinLoading}
              onClick={e => { e.stopPropagation(); onJoin?.(group.id) }}>
              Request to Join
            </Button>
          )}
          {showJoin && isMine  && <Badge variant="success">✓ Joined</Badge>}
          {showJoin && !isMine && isFull && <Badge variant="default">Full</Badge>}
          {showJoin && !isMine && group.status === 'locked' && !isFull && <Badge variant="locked">Locked</Badge>}
        </div>
      </div>
    </Card>
  )
}
