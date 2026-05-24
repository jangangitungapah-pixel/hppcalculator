# Tailwind CSS Implementation Plan

*Note: Tailwind is NOT installed in Phase 4. This document guides Phase 5.*

## Why Tailwind?
Tailwind is ideal for Modalin because it allows rapid mapping of our design tokens (colors, spacing, radius) directly into utility classes, ensuring absolute consistency across the UI without bloated CSS files.

## Recommended Structure
```
/src
  /styles
    index.css           # Imports tailwind and design-tokens.css
    design-tokens.css   # Contains CSS variables
  /components
    /ui                 # Base generic components (Button, Card, Input)
    /layout             # AppShell, Navbar, Sidebar
```

## Mapping Tokens to Tailwind
We will define our tokens in `src/styles/design-tokens.css` as CSS variables, then extend the Tailwind theme in `tailwind.config.js`.

### Suggested `tailwind.config.js` Theme Extension
```javascript
module.exports = {
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
        status: {
          loss: 'var(--color-status-loss)',
          lossBg: 'var(--color-status-loss-bg)',
          // ... mapping all status colors
        }
      },
      borderRadius: {
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
      }
    }
  }
}
```

## Component Class Patterns
Avoid repeating long strings of utility classes everywhere. Build reusable UI components:

```jsx
// Example Button.jsx implementation for Phase 5
const Button = ({ variant = 'primary', className, ...props }) => {
  const base = "h-11 px-4 rounded-md font-semibold transition-colors duration-normal ease-out";
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-hover",
    ghost: "bg-transparent text-text-secondary hover:bg-surface-muted",
  };
  
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
```

## Responsive Strategy
Use mobile-first utility classes:
`flex-col md:flex-row`
`w-full lg:w-1/2`
