import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
      container: {
          center: true,
          padding: '2rem',
          screens: {
              '2xl': '1400px'
          }
      },
      extend: {
          colors: {
              border: 'hsl(var(--border))',
              input: 'hsl(var(--input))',
              ring: 'hsl(var(--ring))',
              background: 'hsl(var(--background))',
              foreground: 'hsl(var(--foreground))',
              primary: {
                  DEFAULT: 'hsl(var(--primary))',
                  foreground: 'hsl(var(--primary-foreground))'
              },
              secondary: {
                  DEFAULT: 'hsl(var(--secondary))',
                  foreground: 'hsl(var(--secondary-foreground))'
              },
              destructive: {
                  DEFAULT: 'hsl(var(--destructive))',
                  foreground: 'hsl(var(--destructive-foreground))'
              },
              muted: {
                  DEFAULT: 'hsl(var(--muted))',
                  foreground: 'hsl(var(--muted-foreground))'
              },
              accent: {
                  DEFAULT: 'hsl(var(--accent))',
                  foreground: 'hsl(var(--accent-foreground))'
              },
              popover: {
                  DEFAULT: 'hsl(var(--popover))',
                  foreground: 'hsl(var(--popover-foreground))'
              },
              card: {
                  DEFAULT: 'hsl(var(--card))',
                  foreground: 'hsl(var(--card-foreground))'
              },
              brand: {
                  '50': '#ecfdf5',
                  '100': '#d1fae5',
                  '200': '#a7f3d0',
                  '300': '#6ee7b7',
                  '400': '#34d399',
                  '500': '#10b981',
                  '600': '#059669',
                  '700': '#047857',
                  '800': '#065f46',
                  '900': '#064e3b',
                  '950': '#022c22'
              },
              amber: {
                  '50': '#fffbeb',
                  '100': '#fef3c7',
                  '200': '#fde68a',
                  '300': '#fcd34d',
                  '400': '#fbbf24',
                  '500': '#f59e0b',
                  '600': '#d97706',
                  '700': '#b45309',
                  '800': '#92400e',
                  '900': '#78350f',
                  '950': '#451a03'
              }
          },
          borderRadius: {
              lg: 'var(--radius)',
              md: 'calc(var(--radius) - 2px)',
              sm: 'calc(var(--radius) - 4px)'
          },
          fontFamily: {
              sans: [
                  'var(--font-inter)',
                  'system-ui',
                  'sans-serif'
              ]
          },
          keyframes: {
              'accordion-down': {
                  from: {
                      height: '0'
                  },
                  to: {
                      height: 'var(--radix-accordion-content-height)'
                  }
              },
              'accordion-up': {
                  from: {
                      height: 'var(--radix-accordion-content-height)'
                  },
                  to: {
                      height: '0'
                  }
              },
              'fade-in': {
                  from: { opacity: '0' },
                  to: { opacity: '1' }
              },
              'slide-in-from-left': {
                  from: { transform: 'translateX(-1rem)', opacity: '0' },
                  to: { transform: 'translateX(0)', opacity: '1' }
              },
              'zoom-in': {
                  from: { transform: 'scale(0.95)', opacity: '0' },
                  to: { transform: 'scale(1)', opacity: '1' }
              },
              'ping-slow': {
                  '0%': { transform: 'scale(1)', opacity: '0.3' },
                  '50%': { transform: 'scale(1.15)', opacity: '0.15' },
                  '100%': { transform: 'scale(1)', opacity: '0.3' }
              },
              'sparkle': {
                  '0%': { opacity: '0', transform: 'scale(0.5) rotate(0deg)' },
                  '50%': { opacity: '1', transform: 'scale(1.2) rotate(10deg)' },
                  '100%': { opacity: '0', transform: 'scale(0.5) rotate(-10deg)' }
              }
          },
          animation: {
              'accordion-down': 'accordion-down 0.2s ease-out',
              'accordion-up': 'accordion-up 0.2s ease-out',
              'fade-in': 'fade-in 0.5s ease-out',
              'slide-in-from-left': 'slide-in-from-left 0.5s ease-out',
              'zoom-in': 'zoom-in 0.5s ease-out',
              'ping-slow': 'ping-slow 2s ease-in-out infinite',
              'sparkle': 'sparkle 1.5s ease-in-out'
          }
      }
  },
  plugins: [animate],
};

export default config;
