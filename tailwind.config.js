/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mahjong: {
          green: '#1B5E20',
          gold: '#FFC107',
        },
      },
    },
  },
  plugins: [],
}
