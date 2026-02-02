/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'coin-flip': {
          '0%': { transform: 'rotateY(0deg) rotateX(0deg)' },
          '100%': { transform: 'rotateY(1800deg) rotateX(360deg)' },
        },
        'flick-coin-1': {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '50%': { 
            transform: 'translateY(-150px) rotate(360deg) scale(1.2)',
            opacity: '1'
          },
          '90%': {
            opacity: '0.5'
          },
        },
        'flick-coin-2': {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '50%': { 
            transform: 'translateY(-120px) rotate(270deg) scale(1.1)',
            opacity: '1'
          },
          '90%': {
            opacity: '0.5'
          },
        },
        'flick-coin-3': {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '0'
          },
          '10%': {
            opacity: '1'
          },
          '50%': { 
            transform: 'translateY(-100px) rotate(180deg) scale(1)',
            opacity: '1'
          },
          '90%': {
            opacity: '0.5'
          },
        },
        'flick-hand-left': {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg)',
          },
          '10%, 90%': { 
            transform: 'translateY(-10px) rotate(-15deg)',
          },
          '50%': { 
            transform: 'translateY(5px) rotate(5deg)',
          },
        },
        'flick-hand-right': {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(0deg) scaleX(-1)',
          },
          '10%, 90%': { 
            transform: 'translateY(-10px) rotate(15deg) scaleX(-1)',
          },
          '50%': { 
            transform: 'translateY(5px) rotate(-5deg) scaleX(-1)',
          },
        },
      },
      animation: {
        'coin-flip': 'coin-flip 2s ease-in-out',
        'flick-coin-1': 'flick-coin-1 2s ease-out infinite',
        'flick-coin-2': 'flick-coin-2 2s ease-out infinite',
        'flick-coin-3': 'flick-coin-3 2s ease-out infinite',
        'flick-hand-left': 'flick-hand-left 2s ease-in-out infinite',
        'flick-hand-right': 'flick-hand-right 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}