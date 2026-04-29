/**
 * theme.js
 * ========
 * ONE place to change colors, fonts, spacing for the entire app.
 * Edit here → everything updates automatically.
 *
 * HOW TO CUSTOMIZE:
 *   - Change colors below
 *   - Swap fonts in index.html + fontFamily below
 *   - Adjust spacing/radius to taste
 */

export const theme = {
  // ── Brand Colors ────────────────────────────────────────────────────────
  // Main accent — used for buttons, active states, highlights
  accent:       '#6366f1',   // indigo-500  ← change this to rebrand everything
  accentHover:  '#4f46e5',   // indigo-600
  accentLight:  'rgba(99,102,241,0.12)',
  accentBorder: 'rgba(99,102,241,0.25)',

  // ── Surfaces ─────────────────────────────────────────────────────────────
  // Dark backgrounds
  bg:           '#0f1117',   // page background
  surface:      '#1a1d27',   // card background
  surfaceHover: '#1f2235',   // card hover
  border:       '#2a2d3e',   // default border
  borderHover:  '#3d4160',   // border on hover

  // ── Text ─────────────────────────────────────────────────────────────────
  textPrimary:  '#f1f2f6',   // headings
  textSecondary:'#a8aab8',   // body text
  textMuted:    '#5c5f7a',   // labels, hints
  textAccent:   '#818cf8',   // accent text

  // ── Department Colors ─────────────────────────────────────────────────────
  // Software Engineering
  se: {
    text:   '#fb923c',       // orange-400
    bg:     'rgba(251,146,60,0.10)',
    border: 'rgba(251,146,60,0.20)',
  },
  // Computer Science
  cs: {
    text:   '#22d3ee',       // cyan-400
    bg:     'rgba(34,211,238,0.10)',
    border: 'rgba(34,211,238,0.20)',
  },

  // ── Status Colors ────────────────────────────────────────────────────────
  success: { text:'#4ade80', bg:'rgba(74,222,128,0.10)', border:'rgba(74,222,128,0.20)' },
  danger:  { text:'#f87171', bg:'rgba(248,113,113,0.10)',border:'rgba(248,113,113,0.20)' },
  warning: { text:'#fbbf24', bg:'rgba(251,191,36,0.10)', border:'rgba(251,191,36,0.20)' },
  info:    { text:'#818cf8', bg:'rgba(129,140,248,0.10)',border:'rgba(129,140,248,0.20)' },

  // ── Shape ────────────────────────────────────────────────────────────────
  radius: {
    sm:  '8px',
    md:  '12px',
    lg:  '16px',
    xl:  '20px',
    full:'9999px',
  },

  // ── Shadows ──────────────────────────────────────────────────────────────
  shadow: {
    card:    '0 2px 8px rgba(0,0,0,0.35)',
    cardHover:'0 8px 24px rgba(0,0,0,0.5)',
    accent:  '0 4px 20px rgba(99,102,241,0.25)',
    glow:    '0 0 30px rgba(99,102,241,0.2)',
  },

  // ── Typography ───────────────────────────────────────────────────────────
  font: {
    display: "'Plus Jakarta Sans', sans-serif",
    body:    "'Plus Jakarta Sans', sans-serif",
    mono:    "'JetBrains Mono', monospace",
  },
}

export default theme
