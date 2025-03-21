const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.cyan,
        secondary: colors.teal,
        neutral: colors.gray,
      }
    },
  },
  plugins: [],
  darkMode: 'selector',
}

