import { Lock, Unlock, Crown, ArrowRight } from 'lucide-react'
import { Tag, Progress } from './ui/index.jsx'

const DEPT = {
  SE: { label:'SE', color:'text-se', accent:'accent-se', dot:'dot-se', tag:'se' },
  CS: { label:'CS', color:'text-cs', accent:'accent-cs', dot:'dot-cs', tag:'cs' },
}

export default function GroupCard({ group, onClick, showJoin, onJoin, compact, joinLoading }) {
  const memberCount = group.member_count ?? group.members?.length ?? 0
  const isFull      = memberCount >= group.max_members
  const isMine      = !!group.my_role
  const d           = DEPT[group.department] || DEPT.SE

  if (compact) {
    return (
      <div onClick={onClick}
        className={`card-raw flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors duration-150 hover:border-acid group ${d.accent}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`font-mono text-[10px] font-bold ${d.color}`}>{d.label}</span>
            <span className="text-iron">·</span>
            <h3 className="font-display text-base tracking-wide text-chalk truncate group-hover:text-acid transition-colors">{group.name}</h3>
          </div>
          <div className="flex items-center gap-3">
            {group.my_role && <Tag color={group.my_role}>{group.my_role === 'leader' ? '★ LEADER' : 'MEMBER'}</Tag>}
            <span className="mono-label text-[0.6rem]">{memberCount}/{group.max_members} MEMBERS</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Tag color={group.status === 'open' ? 'open' : 'locked'}>
            {group.status === 'open' ? '● OPEN' : '■ LOCKED'}
          </Tag>
          <ArrowRight size={14} className="text-smoke group-hover:text-acid transition-colors"/>
        </div>
      </div>
    )
  }

  return (
    <div onClick={onClick}
      className={`card-raw flex flex-col cursor-pointer transition-colors duration-150 hover:border-acid group overflow-hidden animate-slide-up`}
      style={{ animationFillMode:'both' }}>

      {/* Top stripe — dept color */}
      <div className={`h-0.5 w-full ${group.department === 'SE' ? 'bg-se' : 'bg-cs'}`}/>

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Dept + status row */}
            <div className="flex items-center gap-2 mb-2">
              <Tag color={d.tag}>{d.label}</Tag>
              <Tag color={group.status === 'open' ? 'open' : 'locked'}>
                {group.status === 'open' ? '● OPEN' : '■ LOCKED'}
              </Tag>
              {isMine && <Tag color={group.my_role}>{group.my_role === 'leader' ? '★' : '◆'} {group.my_role?.toUpperCase()}</Tag>}
            </div>

            {/* Group name — large display font */}
            <h3 className="font-display text-2xl tracking-[0.06em] text-chalk leading-tight group-hover:text-acid transition-colors truncate">
              {group.name}
            </h3>

            {group.description && (
              <p className="text-ash text-xs mt-1 line-clamp-1 font-mono">{group.description}</p>
            )}
          </div>

          <ArrowRight size={16} className="text-smoke group-hover:text-acid transition-all group-hover:translate-x-1 mt-1 shrink-0"/>
        </div>

        {/* Progress */}
        <Progress current={memberCount} max={group.max_members}/>

        {/* Join button */}
        {showJoin && !isMine && !isFull && group.status === 'open' && (
          <button
            onClick={e => { e.stopPropagation(); onJoin?.(group.id) }}
            disabled={joinLoading}
            className="btn-outline w-full justify-center !py-2">
            {joinLoading ? 'SENDING…' : 'REQUEST TO JOIN →'}
          </button>
        )}
        {showJoin && isMine && <Tag color="brand">✓ JOINED</Tag>}
        {showJoin && !isMine && isFull && <Tag color="locked">■ FULL</Tag>}
      </div>
    </div>
  )
}
