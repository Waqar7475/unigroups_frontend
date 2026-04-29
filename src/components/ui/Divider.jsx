/**
 * Divider.jsx — Horizontal rule with optional label
 * CUSTOMIZE: Change color/spacing
 */
export default function Divider({ label }) {
  if (label) return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-surface-600"/>
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="flex-1 h-px bg-surface-600"/>
    </div>
  )
  return <div className="h-px bg-surface-600 my-4"/>
}
