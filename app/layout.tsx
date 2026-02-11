import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { bentinck, kingsguard, dancingScript } from './fonts'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://boda-karen-andres-umber.vercel.app"),

  title: "Boda Karen y Andrés",
  description: "Estás invitado a celebrar nuestro día especial",

  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64x64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    title: "Boda Karen y Andrés",
    description: "Acompáñanos en este momento tan especial 💍",
    url: "https://boda-karen-andres-umber.vercel.app",
    siteName: "Boda Karen y Andrés",
    images: [
      {
        url: "/og-boda.jpg",
        width: 1200,
        height: 630,
        alt: "Invitación Boda Karen y Andrés",
      },
    ],
    locale: "es_CO",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Boda Karen y Andrés",
    description: "Acompáñanos en este momento tan especial 💍",
    images: ["/og-boda.jpg"],
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body
        suppressHydrationWarning
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${bentinck.variable}
          ${kingsguard.variable}
          ${dancingScript.variable}
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  )
}
