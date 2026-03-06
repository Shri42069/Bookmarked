/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        ink: {
          50: '#f5f3ef',
          100: '#ede8df',
          200: '#d8cfbf',
          300: '#bfb09a',
          400: '#a69074',
          500: '#8f7558',
          600: '#7a6049',
          700: '#634d3c',
          800: '#4a3a2d',
          900: '#2e2419',
          950: '#1a1510',
        },
        parchment: {
          50: '#fdfaf5',
          100: '#faf4e8',
          200: '#f4e9d0',
          300: '#ead8b0',
          400: '#dcc48a',
          500: '#cead65',
        },
        sage: {
          400: '#7e9e7e',
          500: '#5f8060',
          600: '#4a6b4a',
        },
        rust: {
          400: '#c4785a',
          500: '#b05c3a',
          600: '#8f4828',
        },
        slate: {
          book: '#4a5568',
        }
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'book-open': 'bookOpen 0.5s ease forwards',
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
        bookOpen: {
          '0%': { opacity: '0', transform: 'rotateY(-15deg) scale(0.95)' },
          '100%': { opacity: '1', transform: 'rotateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
