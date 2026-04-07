/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // BOAZ-STUDY brand colors — keep in sync with CSS variables in index.css
      colors: {
        brand: {
          navy: '#0A1628',
          blue: '#1E3A8A',
          'blue-mid': '#2563EB',
          'blue-light': '#3B82F6',
          gold: '#F59E0B',
          'gold-light': '#FCD34D',
          surface: '#0F2040',
          'surface-alt': '#162A50',
          muted: '#64748B',
          border: '#1E3A5F',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
