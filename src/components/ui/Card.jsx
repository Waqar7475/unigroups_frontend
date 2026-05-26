import { motion } from 'framer-motion'
import { cardHover, cardTap, spring } from '../../utils/animations.js'

export default function Card({ children, onClick, className='', padding=true, glass=false }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { ...cardHover, boxShadow:'0 20px 60px rgba(0,0,0,0.12)' } : {}}
      whileTap={onClick ? cardTap : {}}
      layout
      className={`rounded-2xl transition-colors duration-200
        ${glass
          ? 'glass'
          : 'bg-[var(--bg-surface)] border border-[var(--border)]'}
        ${onClick
          ? 'cursor-pointer hover:border-indigo-400/40 dark:hover:border-indigo-500/25'
          : ''}
        ${padding ? 'p-5' : ''}
        ${className}`}
      style={{
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        boxShadow: 'var(--shadow-sm)',
      }}>
      {children}
    </motion.div>
  )
}
