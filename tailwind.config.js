/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      /* ── Fonts: swap here + in index.html ── */
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      /* ── Brand color scale ── */
      colors: {
        accent: {
          DEFAULT: '#6366f1',
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        surface: {
          DEFAULT: '#1a1d27',
          50:  '#f1f2f6',
          100: '#e2e4ef',
          600: '#2a2d3e',
          700: '#1f2235',
          800: '#1a1d27',
          900: '#13151f',
          950: '#0f1117',
        },
        se: '#fb923c',
        cs: '#22d3ee',
      },
      /* ── Animations ── */
      animation: {
        'fade-in':  'fadeIn 0.35s ease both',
        'slide-up': 'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'spin-s':   'spin 1.2s linear infinite',
      },
      keyframes: {
        fadeIn:  { from:{opacity:0},                          to:{opacity:1} },
        slideUp: { from:{opacity:0,transform:'translateY(16px)'}, to:{opacity:1,transform:'translateY(0)'} },
        slideIn: { from:{opacity:0,transform:'translateX(16px)'}, to:{opacity:1,transform:'translateX(0)'} },
      },
    },
  },
  plugins: [],
}
