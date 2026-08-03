/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF7EE',
          100: '#F5EDD8',
          200: '#E8DCC7',
          300: '#D9C4A0',
          400: '#C8A96A',
          500: '#B8933F',
          600: '#9C7A30',
          700: '#7A5E25',
          800: '#5D471C',
          900: '#3F3015',
        },
        olive: {
          50: '#EEF2EC',
          100: '#D6E0D2',
          200: '#AEC3A7',
          300: '#85A17B',
          400: '#6B8A60',
          500: '#556B4F',
          600: '#43553E',
          700: '#334030',
          800: '#242B22',
          900: '#161A14',
        },
        ivory: '#F9F6EF',
        beige: '#E8DCC7',
        charcoal: '#222222',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 4.5vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(34, 34, 34, 0.06)',
        'soft-lg': '0 12px 48px rgba(34, 34, 34, 0.1)',
        'gold': '0 8px 32px rgba(200, 169, 106, 0.25)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C8A96A 0%, #B8933F 100%)',
        'gradient-olive': 'linear-gradient(135deg, #556B4F 0%, #43553E 100%)',
      },
    },
  },
  plugins: [],
};
