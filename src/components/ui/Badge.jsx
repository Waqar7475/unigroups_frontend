/**
 * Badge.jsx
 * =========
 * CUSTOMIZE: Add/edit variants in the `variants` object.
 *
 * Usage:
 *   <Badge variant="open">Open</Badge>
 *   <Badge variant="leader"><Crown size={10}/> Leader</Badge>
 */

export default function Badge({ children, variant = 'default', className = '' }) {

  /* ── CUSTOMIZE BADGE COLORS HERE ──────────────────────────────────── */
  const variants = {
    // Status
    open:     'text-green-400  bg-green-400/10  border-green-400/25',
    locked:   'text-slate-400  bg-slate-400/10  border-slate-400/20',
    // Roles
    leader:   'text-amber-400  bg-amber-400/10  border-amber-400/25',
    member:   'text-slate-400  bg-slate-400/10  border-slate-400/20',
    admin:    'text-red-400    bg-red-400/10    border-red-400/25',
    // Departments
    se:       'text-orange-400 bg-orange-400/10 border-orange-400/25',
    cs:       'text-cyan-400   bg-cyan-400/10   border-cyan-400/25',
    // States
    success:  'text-green-400  bg-green-400/10  border-green-400/25',
    danger:   'text-red-400    bg-red-400/10    border-red-400/25',
    warning:  'text-amber-400  bg-amber-400/10  border-amber-400/25',
    pending:  'text-amber-400  bg-amber-400/10  border-amber-400/25',
    accepted: 'text-green-400  bg-green-400/10  border-green-400/25',
    rejected: 'text-red-400    bg-red-400/10    border-red-400/25',
    brand:    'text-accent-400 bg-accent-400/10 border-accent-400/25',
    default:  'text-slate-400  bg-slate-400/10  border-slate-400/20',
  }

  return (
    <span className={[
      'inline-flex items-center gap-1',
      'px-2 py-0.5 rounded-md',                  /* ← change rounded-md to taste */
      'text-xs font-semibold',
      'border',
      variants[variant] ?? variants.default,
      className,
    ].join(' ')}>
      {children}
    </span>
  )
}
