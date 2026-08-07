/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop:  'var(--shadow-pop)',
      },
      colors: {
        canvas: 'var(--bg)',
        card:   { DEFAULT: 'var(--panel)', hover: 'var(--panel-hover)', muted: 'var(--panel-muted)' },
        edge:   'var(--border)',
        fg:     { DEFAULT: 'var(--text)', muted: 'var(--text-muted)', subtle: 'var(--text-subtle)' },

        primary: {
          DEFAULT:    'var(--primary)',
          hover:      'var(--primary-hover)',
          active:     'var(--primary-active)',
          soft:       'var(--primary-soft)',
          foreground: 'var(--on-primary)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          hover:      'var(--secondary-hover)',
          foreground: 'var(--on-secondary)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          hover:      'var(--accent-hover)',
          soft:       'var(--accent-soft)',
          foreground: 'var(--on-accent)',
        },

        success: { DEFAULT: 'var(--success)', soft: 'var(--success-soft)' },
        warning: { DEFAULT: 'var(--warning)', soft: 'var(--warning-soft)' },
        danger:  { DEFAULT: 'var(--danger)',  soft: 'var(--danger-soft)' },
        info:    { DEFAULT: 'var(--info)',    soft: 'var(--info-soft)' },

        cat: {
          taller:    'var(--cat-taller)',
          club:      'var(--cat-club)',
          seminario: 'var(--cat-seminario)',
          deporte:   'var(--cat-deporte)',
          cultura:   'var(--cat-cultura)',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
