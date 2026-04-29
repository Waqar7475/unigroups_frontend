/**
 * Input.jsx
 * =========
 * CUSTOMIZE: Change field styling in the className string below.
 *
 * Usage:
 *   <Input label="Name" placeholder="Ali Hassan" value={v} onChange={set} />
 *   <Input label="Roll No" icon={<CreditCard/>} mono />
 */

export default function Input({
  label,
  hint,
  icon,
  type        = 'text',
  placeholder = '',
  value,
  onChange,
  required    = false,
  min, max,
  disabled    = false,
  mono        = false,
  className   = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label row */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {hint && <span className="text-xs text-slate-500">{hint}</span>}
        </div>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {icon}
          </span>
        )}

        {/* ── CUSTOMIZE INPUT FIELD STYLE HERE ───────────────────────── */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          disabled={disabled}
          className={[
            'w-full py-3 px-4 text-sm',
            'bg-surface-900 border border-surface-600',
            'text-slate-100 placeholder-slate-600',
            'rounded-xl',
            'outline-none transition-all duration-200',
            'focus:border-accent-500 focus:ring-2 focus:ring-accent-500/15',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            icon ? 'pl-10' : '',
            mono ? 'font-mono tracking-wider uppercase text-accent-400' : '',
          ].join(' ')}
        />
      </div>
    </div>
  )
}
