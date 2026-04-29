/**
 * Avatar.jsx
 * ==========
 * CUSTOMIZE: Change shape, colors, sizes below.
 *
 * Usage:
 *   <Avatar initials="AH" dept="SE" size="md" />
 */

export default function Avatar({ initials = '?', dept, size = 'md', className = '' }) {

  /* ── CUSTOMIZE SIZES HERE ─────────────────────────────────────────── */
  const sizes = {
    xs: 'w-6  h-6  text-[9px]',
    sm: 'w-8  h-8  text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }

  /* ── CUSTOMIZE DEPT COLORS HERE ───────────────────────────────────── */
  const deptStyle = {
    SE: 'bg-orange-400/15 text-orange-400 ring-1 ring-orange-400/20',
    CS: 'bg-cyan-400/15   text-cyan-400   ring-1 ring-cyan-400/20',
  }

  const defaultStyle = 'bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/20'

  return (
    <div className={[
      sizes[size] ?? sizes.md,
      'rounded-xl',                              /* ← change to rounded-full for circle */
      'flex items-center justify-center',
      'font-bold font-mono tracking-wide shrink-0',
      deptStyle[dept] ?? defaultStyle,
      className,
    ].join(' ')}>
      {String(initials).slice(0, 2).toUpperCase()}
    </div>
  )
}
