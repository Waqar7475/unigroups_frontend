/**
 * MemberPicker.jsx
 * ================
 * Checkbox list for selecting group members during creation.
 * CUSTOMIZE: Row height, checkbox style, chip style below.
 */
import { X } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'

export default function MemberPicker({ people = [], selected = [], onToggle, dept, loading }) {
  if (loading) return (
    <div className="rounded-xl border border-surface-600 py-8 text-center">
      <p className="text-xs text-slate-500">Loading students…</p>
    </div>
  )

  if (people.length === 0) return (
    <div className="rounded-xl border-2 border-dashed border-surface-600 py-8 text-center">
      <p className="text-sm text-slate-500">No students in this department yet.</p>
      <p className="text-xs text-slate-600 mt-1">Ask admin to add students first.</p>
    </div>
  )

  return (
    <div>
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Select Members
        </label>
        <span className="text-xs font-bold text-accent-400">
          {selected.length} selected
        </span>
      </div>

      {/* ── SCROLLABLE LIST ── */}
      <div className="rounded-xl border border-surface-600 max-h-52 overflow-y-auto bg-surface-900">
        {people.map(p => {
          const initials   = p.name.split(' ').map(w => w[0]).join('').slice(0, 2)
          const isSelected = selected.includes(p.id)
          return (
            <button key={p.id} type="button" onClick={() => onToggle(p.id)}
              className={[
                'w-full flex items-center gap-3 px-4 py-3 text-left',
                'border-b border-surface-700 last:border-0',
                'transition-all duration-150',
                isSelected ? 'bg-accent-500/8' : 'hover:bg-surface-800',
              ].join(' ')}>
              <Avatar initials={initials} dept={p.department} size="sm"/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{p.name}</p>
                <p className="text-[10px] font-mono text-accent-400/70">{p.roll_number}</p>
              </div>
              {/* ── CHECKBOX — change style here ── */}
              <div className={[
                'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                isSelected ? 'bg-accent-500 border-accent-500' : 'border-surface-500',
              ].join(' ')}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* ── SELECTED CHIPS ── */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {people.filter(p => selected.includes(p.id)).map(p => (
            <span key={p.id}
              className="flex items-center gap-1.5 text-xs font-semibold text-accent-400 bg-accent-500/10 border border-accent-500/20 rounded-lg px-2.5 py-1">
              {p.name.split(' ')[0]}
              <button type="button" onClick={() => onToggle(p.id)}
                className="opacity-60 hover:opacity-100">
                <X size={10}/>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
