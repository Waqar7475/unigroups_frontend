/**
 * EmptyState.jsx — Shown when a list has no items
 * CUSTOMIZE: Change icon box style, text colors
 */
export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in"
      style={{ animationFillMode: 'both' }}>
      {/* Icon box — CUSTOMIZE SIZE/COLOR HERE */}
      <div className="w-16 h-16 rounded-2xl bg-surface-700 border border-surface-600 flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <p className="font-semibold text-slate-300 text-base">{title}</p>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
