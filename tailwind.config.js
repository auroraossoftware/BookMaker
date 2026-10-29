/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#f7f3e8',
          200: '#eee5cd',
          300: '#e2d3aa',
          800: '#3a3223',
          900: '#231e15',
        }
      }
    },
  },
  plugins: [],
}
