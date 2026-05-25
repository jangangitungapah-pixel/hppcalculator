import tailwindcssAnimate from "tailwindcss-animate";

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
          active: 'var(--color-primary-active)',
          soft: 'var(--color-primary-soft)',
          softer: 'var(--color-primary-softer)',
          secondary: 'var(--color-secondary)',
          'secondary-hover': 'var(--color-secondary-hover)',
          softGreen: 'var(--color-secondary-soft)',
        },
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-active': 'var(--color-primary-active)',
        'primary-soft': 'var(--color-primary-soft)',
        'primary-softer': 'var(--color-primary-softer)',
        secondary: 'var(--color-secondary)',
        'accent-gold': 'var(--color-accent-gold)',
        'accent-coral': 'var(--color-accent-coral)',
        'accent-mint': 'var(--color-accent-mint)',
        'accent-espresso': 'var(--color-accent-espresso)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised: 'var(--color-surface-raised)',
          muted: 'var(--color-surface-muted)',
        },
        'surface-glass': 'var(--color-surface-glass)',
        'surface-cream': 'var(--color-surface-cream)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
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
        },
        semantic: {
          success: 'var(--color-success)',
          'success-bg': 'var(--color-success-bg)',
          warning: 'var(--color-warning)',
          'warning-bg': 'var(--color-warning-bg)',
          danger: 'var(--color-danger)',
          'danger-bg': 'var(--color-danger-bg)',
          info: 'var(--color-info)',
          'info-bg': 'var(--color-info-bg)',
        }
      },
      borderRadius: {
        'xs': 'var(--radius-xs)',
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        'pill': 'var(--radius-pill)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'floating': 'var(--shadow-floating)',
        'soft-glow': 'var(--shadow-soft-glow)',
        'glow-primary': 'var(--shadow-glow-primary)',
        'glow-success': 'var(--shadow-glow-success)',
      },
      fontFamily: {
        sans: ['Poppins', 'Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'page-mobile': 'var(--space-page-mobile)',
        'page-tablet': 'var(--space-page-tablet)',
        'page-desktop': 'var(--space-page-desktop)',
      },
      maxWidth: {
        'page': 'var(--page-max-width)',
      }
    },
  },
  plugins: [tailwindcssAnimate],
}
