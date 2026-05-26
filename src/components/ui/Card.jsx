import { motion } from 'framer-motion'
import { cardHover, cardTap, spring } from '../../utils/animations.js'

export default function Card({ children, onClick, className='', padding=true }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? cardHover : {}}
      whileTap={onClick ? cardTap : {}}
      layout
      className={`bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl transition-colors duration-200
        ${onClick ? 'cursor-pointer hover:border-indigo-400/50 dark:hover:border-indigo-500/30 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30' : ''}
        ${padding ? 'p-5' : ''}
        ${className}`}>
      {children}
    </motion.div>
  )
}
