/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#faf9f7',
          warm: '#fbfaf8',
          surface: '#ffffff'
        },
        ink: {
          DEFAULT: '#1a1a1a',
          light: '#4a4a4a',
          lighter: '#6b6b6b'
        },
        gold: {
          DEFAULT: '#d4af37',
          dark: '#b8941f',
          light: '#e8c547'
        },
        gunmetal: '#2c3539'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'editorial': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'luxury': '0 8px 24px rgba(0, 0, 0, 0.15)'
      },
      backgroundImage: {
        'paper-grain': 'radial-gradient(circle at 1px 1px, rgba(26, 26, 26, 0.02) 1px, transparent 0)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}