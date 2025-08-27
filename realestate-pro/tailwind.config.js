/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 0px rgba(168,85,247,0.0)' },
          '50%': { boxShadow: '0 0 25px rgba(168,85,247,0.35)' },
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' }
        }
      },
      animation: {
        gradientShift: 'gradientShift 6s ease infinite',
        glow: 'glow 2.5s ease-in-out infinite',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
      }
    },
  },
  plugins: [],
}
