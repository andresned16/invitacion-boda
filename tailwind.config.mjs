/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
   extend: {
  fontFamily: {
  krylon: ['var(--font-krylon)'],
  kingsguard: ['var(--font-kingsguard)'],
},

},

  },
  plugins: [],
}

export default tailwindConfig
