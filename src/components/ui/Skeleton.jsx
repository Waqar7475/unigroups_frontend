/**
 * Skeleton.jsx — Loading placeholder
 * CUSTOMIZE: Change bg color / animation speed
 */
export default function Skeleton({ className = '' }) {
  return (
    <div className={[
      'rounded-2xl',
      'bg-surface-700',
      'animate-pulse',
      className,
    ].join(' ')}/>
  )
}
