import localFont from 'next/font/local'

export const krylon = localFont({
  src: [
    {
      path: '../public/fonts/Krylon-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-krylon',
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
