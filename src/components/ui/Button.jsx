/**
 * Button.jsx
 * ==========
 * CUSTOMIZE: Change styles in the `variants` and `sizes` objects below.
 *
 * Usage:
 *   <Button>Save</Button>
 *   <Button variant="ghost" size="sm">Cancel</Button>
 *   <Button variant="danger" loading>Deleting…</Button>
 */
import { Loader2 } from 'lucide-react'

export default function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  onClick,
  type      = 'button',
  className = '',
  fullWidth = false,
}) {

  /* ── CUSTOMIZE VARIANTS HERE ──────────────────────────────────────── */
  const variants = {
    primary:   'bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/20',
    secondary: 'bg-surface-700 hover:bg-surface-600 text-surface-50 border border-surface-600 hover:border-accent-500/40',
    ghost:     'text-surface-100 hover:bg-surface-700 hover:text-white',
    danger:    'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40',
    success:   'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 hover:border-green-500/40',
    outline:   'border border-surface-600 hover:border-accent-500/50 text-surface-100 hover:text-accent-400',
  }

  /* ── CUSTOMIZE SIZES HERE ─────────────────────────────────────────── */
  const sizes = {
    xs: 'px-2.5 py-1   text-xs  rounded-lg  gap-1',
    sm: 'px-3   py-1.5 text-xs  rounded-xl  gap-1.5',
    md: 'px-4   py-2.5 text-sm  rounded-xl  gap-2',
    lg: 'px-6   py-3   text-sm  rounded-xl  gap-2',
    xl: 'px-8   py-4   text-base rounded-2xl gap-2.5',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-semibold',
        'transition-all duration-200',
        'active:scale-[0.97]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant] ?? variants.primary,
        sizes[size]       ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading
        ? <><Loader2 size={14} className="animate-spin-s"/> Loading…</>
        : children
      }
    </button>
  )
}
