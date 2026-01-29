/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
   extend: {
  fontFamily: {
  rosaline: ['var(--font-rosaline)'],
  kingsguard: ['var(--font-kingsguard)'],
},

},

  },
  plugins: [],
}

export default tailwindConfig
