/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: '#0a0a0a',
          900: '#141414',
          800: '#2c2c2c',
          700: '#3c3c3c',
          600: '#5a5a5a',
          500: '#7a7a7a',
          400: '#a2a2a2',
          300: '#cfcfd2',
          200: '#e1e1e3',
          100: '#ececee',
          50: '#f4f4f5',
        },
        retro: {
          lime: '#E2E412',
          yellow: '#E9E900',
          maroon: '#68303B',
        },
        cream: {
          100: '#FEF3D7',
        },
        amber: {
          100: '#f5e7cd',
          200: '#ecd4a8',
          300: '#e3bd7d',
          400: '#e0b05c',
          500: '#dca54c',
          600: '#bc8a3f',
        },
        steel: {
          100: '#e3ebf1',
          200: '#c5d6e2',
          300: '#a6c1d3',
          400: '#8baac1',
          500: '#628ca6',
          600: '#4d7088',
        },
        terracotta: {
          100: '#f1ddd6',
          200: '#e6bea9',
          300: '#d6a07f',
          400: '#d08a69',
          500: '#c87355',
          600: '#ab5b40',
        },
        crimson: {
          100: '#efd6d6',
          200: '#e1b5b5',
          300: '#d28d8d',
          400: '#b96a6a',
          500: '#9e4747',
          600: '#813838',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};