/**
 * Alert.jsx
 * =========
 * CUSTOMIZE: Change colors/icons in variants below.
 *
 * Usage:
 *   <Alert type="error" message="Something went wrong" onClose={() => setErr('')} />
 *   <Alert type="success" message="Saved!" />
 */

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null

  /* ── CUSTOMIZE ALERT STYLES HERE ─────────────────────────────────── */
  const variants = {
    error:   { bar: 'bg-red-500',   box: 'bg-red-500/8   border-red-500/20',   text: 'text-red-400'   },
    success: { bar: 'bg-green-500', box: 'bg-green-500/8 border-green-500/20', text: 'text-green-400' },
    warning: { bar: 'bg-amber-500', box: 'bg-amber-500/8 border-amber-500/20', text: 'text-amber-400' },
    info:    { bar: 'bg-accent-500',box: 'bg-accent-500/8 border-accent-500/20',text:'text-accent-400' },
  }

  const v = variants[type] ?? variants.error

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm animate-fade-in ${v.box}`}
      style={{ animationFillMode: 'both' }}>
      {/* Colored left bar */}
      <div className={`w-0.5 self-stretch rounded-full shrink-0 ${v.bar}`}/>
      <span className={`flex-1 font-medium ${v.text}`}>{message}</span>
      {onClose && (
        <button onClick={onClose}
          className={`shrink-0 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none ${v.text}`}>
          ×
        </button>
      )}
    </div>
  )
}
