/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}', // Scan all JS/JSX files
  ],
  theme: {
    extend: {
      // Custom color palette using CSS variables
      colors: {
        // Neumorphism cool grey palette
        'neu-bg': 'var(--color-background)',        // #E0E5EC
        'neu-fg': 'var(--color-foreground)',        // #3D4852
        'neu-muted': 'var(--color-muted)',          // #6B7280
        'neu-accent': 'var(--color-accent)',        // #6C63FF
        'neu-accent-light': 'var(--color-accent-light)', // #8B84FF
        'neu-accent-secondary': 'var(--color-accent-secondary)', // #38B2AC
      },

      // Custom shadow utilities for neumorphic effects
      boxShadow: {
        // Extruded (raised, default state)
        'neu-extruded': 'var(--shadow-extruded)',
        'neu-extruded-hover': 'var(--shadow-extruded-hover)',
        'neu-extruded-small': 'var(--shadow-extruded-small)',

        // Inset (pressed, carved into surface)
        'neu-inset': 'var(--shadow-inset)',
        'neu-inset-deep': 'var(--shadow-inset-deep)',
        'neu-inset-small': 'var(--shadow-inset-small)',
      },

      // Border radius utilities
      borderRadius: {
        'neu-container': 'var(--radius-container)',   // 32px
        'neu-base': 'var(--radius-base)',             // 16px
        'neu-inner': 'var(--radius-inner)',           // 12px
      },

      // Typography customization
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'sans': ['DM Sans', 'sans-serif'],
      },

      fontSize: {
        // Extend Tailwind's default scale
        '7xl': ['5rem', { lineHeight: '1' }],        // 80px for hero
        '6xl': ['3.75rem', { lineHeight: '1' }],     // 60px
        '5xl': ['3rem', { lineHeight: '1.2' }],      // 48px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],   // 36px
        '3xl': ['1.875rem', { lineHeight: '1.3' }],  // 30px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],    // 24px
        'xl': ['1.25rem', { lineHeight: '1.4' }],    // 20px
        'lg': ['1.125rem', { lineHeight: '1.4' }],   // 18px
        'base': ['1rem', { lineHeight: '1.5' }],     // 16px
        'sm': ['0.875rem', { lineHeight: '1.5' }],   // 14px
      },

      // Animation utilities
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },

      // Transition utilities
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
      },
    },
  },

  plugins: [],
}; 
