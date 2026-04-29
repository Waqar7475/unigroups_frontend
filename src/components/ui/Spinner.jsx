/**
 * Spinner.jsx — Loading spinner
 * CUSTOMIZE: Change color/size
 */
export default function Spinner({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      className={`animate-spin-s ${className}`}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
}
