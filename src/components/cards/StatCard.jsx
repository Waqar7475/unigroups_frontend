/**
 * StatCard.jsx
 * ============
 * CUSTOMIZE: Change icon, gradient, number style below.
 */
import Card from '../ui/Card.jsx'

export default function StatCard({ label, value, icon, gradient = 'from-accent-500/20 to-accent-700/10', sub }) {
  return (
    <Card className="animate-slide-up" style={{ animationFillMode: 'both' }}>
      {/* Icon + label row */}
      <div className="flex items-center justify-between mb-4">
        {/* ── ICON BOX — change gradient/size here ── */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
      {/* ── NUMBER — change text size here ── */}
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      {sub && <p className="text-[11px] text-accent-400 mt-0.5">{sub}</p>}
    </Card>
  )
}
