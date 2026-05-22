export default function Input({ label, hint, icon, type='text', placeholder='', value, onChange, required=false, min, max, disabled=false, mono=false, className='' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {hint && <span className="text-xs text-[var(--text-faint)]">{hint}</span>}
        </div>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">{icon}</span>}
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          required={required} min={min} max={max} disabled={disabled}
          className={`w-full py-2.5 px-4 text-sm
            bg-[var(--bg-base)] border border-[var(--border)]
            text-[var(--text-primary)] placeholder-[var(--text-faint)]
            rounded-xl outline-none transition-all
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15
            disabled:opacity-40
            ${icon ? 'pl-10' : ''}
            ${mono ? 'font-mono tracking-wider uppercase text-indigo-600 dark:text-indigo-400' : ''}`}
        />
      </div>
    </div>
  )
}
