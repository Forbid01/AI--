/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    '../../packages/templates/*/**/*.{js,jsx}',
    '!../../packages/templates/**/node_modules/**',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: 'var(--bg-primary)',
          deep: 'var(--bg-secondary)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
        },
        ink: {
          DEFAULT: 'var(--text-primary)',
          80: 'var(--text-secondary)',
          60: 'var(--text-secondary)',
          40: 'var(--text-tertiary)',
          20: 'var(--text-muted)',
          10: 'var(--surface-border)',
          5: 'rgba(255, 255, 255, 0.03)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          deep: 'var(--accent-deep)',
          soft: 'var(--accent-soft)',
          ink: 'var(--accent-ink)',
          light: 'var(--accent-light)',
        },
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
