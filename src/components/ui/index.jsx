import { Loader2 } from 'lucide-react'

// ── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ initials = '?', dept, size = 'md' }) {
  const s = { xs:'w-6 h-6 text-[9px]', sm:'w-8 h-8 text-xs', md:'w-10 h-10 text-sm', lg:'w-14 h-14 text-base', xl:'w-20 h-20 text-xl' }
  const accent = dept === 'SE' ? 'border-se text-se' : dept === 'CS' ? 'border-cs text-cs' : 'border-smoke text-ash'
  return (
    <div className={`${s[size]||s.md} ${accent} border flex items-center justify-center font-mono font-bold shrink-0`}>
      {String(initials).slice(0,2).toUpperCase()}
    </div>
  )
}

// ── Tag / Badge ──────────────────────────────────────────────────────────────
export function Tag({ children, color = 'default' }) {
  const colors = {
    open:     'text-ok border-ok/40',
    locked:   'text-ash border-smoke',
    leader:   'text-yellow-400 border-yellow-400/40',
    member:   'text-ash border-smoke',
    admin:    'text-danger border-danger/40',
    se:       'text-se border-se/40',
    cs:       'text-cs border-cs/40',
    pending:  'text-yellow-400 border-yellow-400/40',
    accepted: 'text-ok border-ok/40',
    rejected: 'text-danger border-danger/40',
    brand:    'text-acid border-acid/40',
    default:  'text-ash border-smoke',
    success:  'text-ok border-ok/40',
    danger:   'text-danger border-danger/40',
  }
  return <span className={`tag ${colors[color]||colors.default}`}>{children}</span>
}

// ── Buttons ──────────────────────────────────────────────────────────────────
export function Btn({ children, variant='acid', size='md', loading, disabled, onClick, type='button', className='' }) {
  const cls = { acid:'btn-acid', outline:'btn-outline', ghost:'btn-ghost', danger:'btn-danger', ok:'btn-ok' }
  const sz  = { sm:'!py-1.5 !px-3 !text-[0.65rem]', md:'', lg:'!py-3 !px-8 !text-sm' }
  return (
    <button type={type} disabled={disabled||loading} onClick={onClick}
      className={`${cls[variant]||cls.outline} ${sz[size]||''} ${className}`}>
      {loading ? <><Loader2 size={13} className="animate-spin"/> Loading…</> : children}
    </button>
  )
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Field({ label, hint, mono, type='text', placeholder, value, onChange, required, min, max, disabled, icon }) {
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="mono-label">{label}{required&&<span className="text-danger ml-1">*</span>}</span>
          {hint && <span className="mono-label text-[0.6rem]">{hint}</span>}
        </div>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ash pointer-events-none">{icon}</span>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          required={required} min={min} max={max} disabled={disabled}
          className={`field ${mono?'field-mono':''} ${icon?'pl-9':''} disabled:opacity-40`}
        />
      </div>
    </div>
  )
}

// ── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ type='error', message, onClose }) {
  if (!message) return null
  const s = type === 'error'
    ? 'border-l-2 border-danger bg-danger/5 text-danger'
    : 'border-l-2 border-ok bg-ok/5 text-ok'
  return (
    <div className={`${s} px-4 py-3 flex items-start justify-between gap-3 animate-fade font-mono text-xs`}>
      <span>{message}</span>
      {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100 text-base leading-none">×</button>}
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
export function Skel({ className='' }) {
  return <div className={`bg-iron animate-pulse ${className}`}/>
}

// ── Progress ─────────────────────────────────────────────────────────────────
export function Progress({ current, max, showLabel=true }) {
  const pct  = Math.round((current/max)*100)
  const full = current >= max
  return (
    <div>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="mono-label">Members</span>
          <span className="font-mono text-xs font-bold text-chalk">{current}<span className="text-ash">/{max}</span></span>
        </div>
      )}
      <div className="progress-track">
        <div className={`progress-fill ${full?'danger':''}`} style={{width:`${pct}%`}}/>
      </div>
      <p className="mono-label mt-1">{full ? '// FULL' : `// ${max-current} SLOT${max-current!==1?'S':''} OPEN`}</p>
    </div>
  )
}

// ── Empty ─────────────────────────────────────────────────────────────────────
export function Empty({ label='NO DATA FOUND', sub, action }) {
  return (
    <div className="py-16 text-center border border-dashed border-iron">
      <p className="font-display text-5xl text-iron tracking-widest mb-2">{label}</p>
      {sub && <p className="mono-label text-[0.65rem]">{sub}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
export function SectionLabel({ children, count, right }) {
  return (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-iron">
      <div className="flex items-center gap-3">
        <span className="font-display text-xl tracking-wider text-chalk">{children}</span>
        {count !== undefined && (
          <span className="font-mono text-xs text-acid font-bold">[ {count} ]</span>
        )}
      </div>
      {right}
    </div>
  )
}

// ── Stats Box ─────────────────────────────────────────────────────────────────
export function StatBox({ label, value, accent }) {
  const colors = { acid:'text-acid', se:'text-se', cs:'text-cs', ok:'text-ok', danger:'text-danger', chalk:'text-chalk' }
  return (
    <div className="card-raw p-5 border transition-colors duration-200">
      <p className="mono-label mb-2">{label}</p>
      <p className={`stat-number text-6xl ${colors[accent]||'text-chalk'}`}>{value}</p>
    </div>
  )
}
