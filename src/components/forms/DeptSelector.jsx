/**
 * DeptSelector.jsx
 * ================
 * Department chooser used in Create Group and Add Student forms.
 * CUSTOMIZE: Button size, colors, icons below.
 */
import { Monitor, Code2, Lock } from 'lucide-react'

/* ── DEPT BUTTON CONFIG — edit colors/icons here ── */
const DEPTS = [
  {
    value:  'SE',
    label:  'Software Engineering',
    icon:   Monitor,
    active: 'border-orange-400 bg-orange-400/8',
    text:   'text-orange-400',
    dot:    'bg-orange-400',
  },
  {
    value:  'CS',
    label:  'Computer Science',
    icon:   Code2,
    active: 'border-cyan-400 bg-cyan-400/8',
    text:   'text-cyan-400',
    dot:    'bg-cyan-400',
  },
]

export default function DeptSelector({ value, onChange, locked = false, lockedDept }) {
  /* Locked mode — student can't change dept */
  if (locked && lockedDept) {
    const d = DEPTS.find(x => x.value === lockedDept)
    if (!d) return null
    return (
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Department</label>
        <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${d.active}`}>
          <d.icon size={22} className={d.text}/>
          <div className="flex-1">
            <p className={`text-sm font-bold ${d.text}`}>{d.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">Auto-assigned · your department</p>
          </div>
          <Lock size={14} className="text-slate-600"/>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        Department <span className="text-red-400">*</span>
      </label>
      {/* ── DEPT BUTTONS GRID ── */}
      <div className="grid grid-cols-2 gap-3">
        {DEPTS.map(d => (
          <button key={d.value} type="button"
            onClick={() => onChange(d.value)}
            className={[
              'flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer',
              value === d.value
                ? d.active
                : 'border-surface-600 bg-transparent hover:bg-surface-800 hover:border-surface-500',
            ].join(' ')}>
            {/* Dept icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${value === d.value ? d.active : 'bg-surface-700'}`}>
              <d.icon size={16} className={value === d.value ? d.text : 'text-slate-500'}/>
            </div>
            <span className={`text-sm font-semibold ${value === d.value ? d.text : 'text-slate-400'}`}>
              {d.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
