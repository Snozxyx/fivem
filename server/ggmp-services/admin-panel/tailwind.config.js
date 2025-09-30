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
        background: '#111111',
        foreground: '#eeeeee',
        primary: {
          DEFAULT: '#ffe0c2',
          foreground: '#081a1b',
        },
        secondary: {
          DEFAULT: '#393028',
          foreground: '#ffe0c2',
        },
        accent: {
          DEFAULT: '#2a2a2a',
          foreground: '#eeeeee',
        },
        card: {
          DEFAULT: '#191919',
          foreground: '#eeeeee',
        },
        popover: {
          DEFAULT: '#191919',
          foreground: '#eeeeee',
        },
        muted: {
          DEFAULT: '#222222',
          foreground: '#b4b4b4',
        },
        border: '#201e18',
        input: '#484848',
        ring: '#ffe0c2',
        destructive: {
          DEFAULT: '#e54d2e',
          foreground: '#ffffff',
        },
        chart: {
          1: '#ffe0c2',
          2: '#393028',
          3: '#2a2a2a',
          4: '#42382e',
          5: '#ffe0c1',
        },
        sidebar: {
          DEFAULT: '#18181b',
          foreground: '#f4f4f5',
          primary: '#1d4ed8',
          'primary-foreground': '#ffffff',
          accent: '#27272a',
          'accent-foreground': '#f4f4f5',
          border: '#27272a',
          ring: '#d4d4d8',
        },
      }
    },
  },
  plugins: [],
}
