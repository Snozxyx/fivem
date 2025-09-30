/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ggmp: {
          primary: '#10b981',
          secondary: '#3b82f6',
          dark: '#0f172a',
          darker: '#020617',
          light: '#1e293b'
        }
      }
    },
  },
  plugins: [],
}
