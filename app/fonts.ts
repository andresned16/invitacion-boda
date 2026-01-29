import localFont from 'next/font/local'

export const rosaline = localFont({
  src: [
    {
      path: '../public/fonts/Rosaline-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-rosaline',
})

export const kingsguard = localFont({
  src: [
    {
      path: '../public/fonts/KingsguardCalligraphyPERSONA-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-kingsguard',
})
