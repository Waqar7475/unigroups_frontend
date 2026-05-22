import Icon     from '../ui/Icons.jsx'
import Card     from '../ui/Card.jsx'
import Badge    from '../ui/Badge.jsx'
import Button   from '../ui/Button.jsx'
import { Progress } from '../ui/misc.jsx'

const DEPT = {
  SE:{ label:'Software Engineering', bar:'bg-orange-400', chip:'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-400/10 dark:text-orange-400 dark:border-orange-400/20', icon:'monitor' },
  CS:{ label:'Computer Science',     bar:'bg-cyan-400',   chip:'bg-cyan-50 text-cyan-600 border border-cyan-200 dark:bg-cyan-400/10 dark:text-cyan-400 dark:border-cyan-400/20',           icon:'code2' },
}

export default function GroupCard({ group, onClick, showJoin=false, onJoin, compact=false, joinLoading=false }) {
  const mc   = group.member_count ?? group.members?.length ?? 0
  const full = mc >= group.max_members
  const isMine = !!group.my_role
  const d    = DEPT[group.department] || DEPT.SE

  if (compact) return (
    <Card onClick={onClick} className="flex items-center gap-4 !py-3.5 group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${d.chip}`}>{d.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h3 className="font-bold text-sm text-[var(--text-primary)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{group.name}</h3>
          {group.my_role && <Badge variant={group.my_role}>{group.my_role==='leader'&&<Icon name="crown" size={9}/>}{group.my_role}</Badge>}
          <Badge variant={group.status}>{group.status==='open'?<Icon name="unlock" size={9}/>:<Icon name="lock" size={9}/>}{group.status}</Badge>
        </div>
        <p className={`text-xs font-medium ${group.department==='SE'?'text-orange-600 dark:text-orange-400':'text-cyan-600 dark:text-cyan-400'}`}>{d.label} · {mc}/{group.max_members}</p>
      </div>
      <Icon name="chevronRight" size={15} className="text-[var(--text-faint)] group-hover:text-[var(--text-muted)] transition-colors shrink-0"/>
    </Card>
  )

  return (
    <Card onClick={onClick} className="flex flex-col overflow-hidden !p-0 group">
      <div className={`h-1 w-full ${d.bar}`}/>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md mb-2 ${d.chip}`}><span>{d.icon}</span>{d.label}</span>
            <h3 className="font-bold text-base text-[var(--text-primary)] leading-snug truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{group.name}</h3>
            {group.description && <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">{group.description}</p>}
          </div>
          <Badge variant={group.status}>{group.status==='open'?<Icon name="unlock" size={9}/>:<Icon name="lock" size={9}/>}{group.status==='open'?'Open':'Locked'}</Badge>
        </div>
        <Progress current={mc} max={group.max_members}/>
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border)]">
          {isMine
            ? <Badge variant={group.my_role}>{group.my_role==='leader'&&<Icon name="crown" size={9}/>}{group.my_role}</Badge>
            : <span className="text-[11px] text-[var(--text-faint)] flex items-center gap-1"><Icon name="calendar" size={10}/>{group.created_at?.split('T')[0]}</span>}
          {showJoin && !isMine && !full && group.status==='open' && <Button variant="outline" size="sm" loading={joinLoading} onClick={e=>{e.stopPropagation();onJoin?.(group.id)}}>Request to Join</Button>}
          {showJoin && isMine && <Badge variant="success">Joined</Badge>}
          {showJoin && !isMine && full && <Badge variant="default">Full</Badge>}
          {showJoin && !isMine && group.status==='locked' && !full && <Badge variant="locked">Locked</Badge>}
        </div>
      </div>
    </Card>
  )
}
