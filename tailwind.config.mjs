/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
   extend: {
  fontFamily: {
  bentinck: ['var(--font-bentinck)'],
  kingsguard: ['var(--font-kingsguard)'],
},

},

  },
  plugins: [],
}

export default tailwindConfig
