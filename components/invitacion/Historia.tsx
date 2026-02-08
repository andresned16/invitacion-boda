'use client'

import dynamic from 'next/dynamic'

const Book3D = dynamic(() => import('./Book3D'), {
  ssr: false,
})

export default function Historia() {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto text-center">
      <h2 className="text-5xl font-kingsguard mb-6 text-[#7a5c3e]">
        Nuestra historia
      </h2>

      {/* 📖 Libro 3D (solo cliente) */}
      <Book3D />

     
    </section>
  )
}
