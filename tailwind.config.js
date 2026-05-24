/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          soft: 'var(--color-primary-soft)',
          secondary: 'var(--color-secondary)',
          softGreen: 'var(--color-secondary-soft)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
        },
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        status: {
          loss: 'var(--color-status-loss)',
          lossBg: 'var(--color-status-loss-bg)',
          low: 'var(--color-status-low)',
          lowBg: 'var(--color-status-low-bg)',
          okay: 'var(--color-status-okay)',
          okayBg: 'var(--color-status-okay-bg)',
          good: 'var(--color-status-good)',
          goodBg: 'var(--color-status-good-bg)',
          excellent: 'var(--color-status-excellent)',
          excellentBg: 'var(--color-status-excellent-bg)',
        }
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'pill': 'var(--radius-pill)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'card': 'var(--shadow-card)',
        'floating': 'var(--shadow-floating)',
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
