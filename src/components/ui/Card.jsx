export default function Card({ children, onClick, className='', padding=true }) {
  return (
    <div onClick={onClick}
      className={`bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl transition-all duration-200
        ${onClick ? 'cursor-pointer hover:border-indigo-400/50 dark:hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30' : ''}
        ${padding ? 'p-5' : ''}
        ${className}`}>
      {children}
    </div>
  )
}
