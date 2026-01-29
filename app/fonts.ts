import localFont from 'next/font/local'

export const bentinck = localFont({
  src: [
    {
      path: '../public/fonts/Bentinck-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-bentinck',
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

export const dancingScript = localFont({
  src: [
    {
      path: '../public/fonts/DancingScript-Bold.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-dancingScript',
})
