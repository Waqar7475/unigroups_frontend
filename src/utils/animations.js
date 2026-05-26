// Spring physics configs — iPhone-like feel
export const spring = {
  snappy:  { type:'spring', stiffness:500, damping:30, mass:0.8 },
  smooth:  { type:'spring', stiffness:300, damping:28, mass:1   },
  bouncy:  { type:'spring', stiffness:400, damping:20, mass:0.9 },
  gentle:  { type:'spring', stiffness:200, damping:25, mass:1.2 },
  instant: { type:'spring', stiffness:700, damping:40, mass:0.6 },
}

// Page transition
export const pageVariants = {
  initial:  { opacity:0, y:16, scale:0.99 },
  animate:  { opacity:1, y:0,  scale:1,   transition:{ ...spring.smooth, staggerChildren:0.06 } },
  exit:     { opacity:0, y:-8, scale:0.99, transition:{ duration:0.15 } },
}

// Stagger container
export const staggerContainer = {
  animate: { transition: { staggerChildren:0.07, delayChildren:0.05 } }
}

// Item that fades + slides up
export const fadeUp = {
  initial:  { opacity:0, y:20 },
  animate:  { opacity:1, y:0,  transition: spring.smooth },
  exit:     { opacity:0, y:-10, transition:{ duration:0.15 } },
}

// Item that scales in
export const scaleIn = {
  initial:  { opacity:0, scale:0.92 },
  animate:  { opacity:1, scale:1,   transition: spring.bouncy },
  exit:     { opacity:0, scale:0.95, transition:{ duration:0.12 } },
}

// Slide in from left (sidebar)
export const slideLeft = {
  initial:  { x:-24, opacity:0 },
  animate:  { x:0,   opacity:1, transition: spring.smooth },
  exit:     { x:-16, opacity:0, transition:{ duration:0.15 } },
}

// Slide in from right
export const slideRight = {
  initial:  { x:24, opacity:0 },
  animate:  { x:0,  opacity:1, transition: spring.smooth },
  exit:     { x:16, opacity:0, transition:{ duration:0.15 } },
}

// Dropdown
export const dropDown = {
  initial:  { opacity:0, scale:0.95, y:-8 },
  animate:  { opacity:1, scale:1,    y:0,  transition: spring.snappy },
  exit:     { opacity:0, scale:0.95, y:-8, transition:{ duration:0.12 } },
}

// Card hover (used with whileHover)
export const cardHover = {
  scale: 1.02,
  y: -3,
  transition: spring.snappy,
}

export const cardTap = {
  scale: 0.97,
  transition: spring.instant,
}

// Button tap
export const buttonTap = { scale:0.94, transition: spring.instant }
export const buttonHover = { scale:1.03, transition: spring.snappy }

// Notification bell shake
export const bellShake = {
  rotate: [0, -15, 15, -10, 10, -5, 5, 0],
  transition: { duration:0.5, ease:'easeInOut' }
}

// Number counter (for stats)
export const countUp = {
  initial:  { opacity:0, y:10 },
  animate:  { opacity:1, y:0, transition: spring.bouncy },
}
