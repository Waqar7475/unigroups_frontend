/**
 * Card.jsx
 * ========
 * CUSTOMIZE: Change surface color, border, radius, hover effect below.
 *
 * Usage:
 *   <Card>content</Card>
 *   <Card onClick={() => navigate('detail', group)} hover>clickable card</Card>
 *   <Card variant="flat">no shadow</Card>
 */

export default function Card({
  children,
  onClick,
  hover     = !!onClick,
  className = '',
  padding   = true,
  variant   = 'default',
}) {

  /* ── CUSTOMIZE CARD VARIANTS HERE ─────────────────────────────────── */
  const variants = {
    default: 'bg-surface-800 border border-surface-600',
    flat:    'bg-surface-900 border border-surface-600',
    accent:  'bg-accent-500/5 border border-accent-500/20',
    ghost:   'bg-transparent border border-surface-600',
  }

  return (
    <div
      onClick={onClick}
      className={[
        /* ── Base shape ── */
        'rounded-2xl',                           /* ← swap to rounded-xl, rounded-lg etc */
        'transition-all duration-200',

        /* ── Variant ── */
        variants[variant] ?? variants.default,

        /* ── Hover effect (auto-enabled when onClick given) ── */
        hover ? [
          'cursor-pointer',
          'hover:border-accent-500/30',
          'hover:bg-surface-700',
          'hover:-translate-y-0.5',
          'hover:shadow-xl hover:shadow-black/30',
        ].join(' ') : '',

        /* ── Padding ── */
        padding ? 'p-5' : '',

        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
