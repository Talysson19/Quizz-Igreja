/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ESSA PARTE AQUI É O QUE FAZ O bg-primary FUNCIONAR
        'primary': '#7159c1', 
        'gold': '#d4af37',
        'navy': '#1b264f',
      }
    },
  },
  plugins: [],
}