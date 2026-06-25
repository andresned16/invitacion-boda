'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Menu() {

  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const selloRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%', // cuando entra en pantalla
          toggleActions: 'play none none none',
        }
      })

      // 📜 Tarjeta
      tl.from(cardRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
      })

      // 📝 Contenido
      tl.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
      }, '-=0.6')

      // 🔖 Sello
      tl.from(selloRef.current, {
        opacity: 0,
        y: -20,
        rotation: -15,
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, '-=0.5')

    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-20 flex justify-center">

      <div
        ref={cardRef}
        className="
          w-[90%] 
          max-w-md 
          bg-white/80 
          backdrop-blur-sm
          border border-[#d4b896]
          rounded-sm
          px-8 py-12
          shadow-[0_10px_30px_rgba(0,0,0,0.05)]
          text-center
        "
      >

        <div ref={contentRef} className="border border-[#e6d3b3] p-6">

          <h2 className="text-5xl font-kingsguard text-[#7a5c3e] mb-6">
            Menú
          </h2>

          <div className="flex justify-center mb-10">
            <div className="w-20 h-[2px] bg-[#c6a77d] opacity-70"></div>
          </div>

          <div className="space-y-6 text-[#5c4a3a] font-bentinck text-lg">
            {[
              'Arroz Rissoto seco al limón',
              'Puré de papa blanca',
              'Gulash  de res',
              'Rollo de pollo',
              'Ensalada Deliciosa',
              'Soda de frutos amarillos',
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3">
                <span className="w-6 h-[1px] bg-[#c6a77d]"></span>
                <p className="tracking-wide">{item}</p>
                <span className="w-6 h-[1px] bg-[#c6a77d]"></span>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <img
              ref={selloRef}
              src="/images/sello.png"
              alt="Sello"
              className="w-14 h-14 rotate-[-8deg] opacity-90"
            />
          </div>

        </div>
      </div>

    </section>
  )
}