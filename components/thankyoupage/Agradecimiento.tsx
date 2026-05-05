'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Agradecimiento() {

  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  const hora = new Date().getHours()

  const franja =
    hora >= 5 && hora < 12
      ? 'mañana'
      : hora >= 12 && hora < 18
      ? 'tarde'
      : 'noche'

  useEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      })

      // ✨ Título
      tl.from(titleRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      })

      // ✨ Línea (efecto dibujo)
      tl.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'center',
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.6')

      // ✨ Texto (fade + blur elegante)
      tl.from(textRef.current, {
        opacity: 0,
        y: 20,
        filter: 'blur(6px)',
        duration: 1.2,
        ease: 'power2.out',
      }, '-=0.4')

    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 flex justify-center">

      <div ref={containerRef} className="w-[90%] max-w-2xl text-center px-6">

        {/* Título */}
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-kingsguard text-[#7a5c3e] mb-8"
        >
          Gracias por acompañarnos
        </h2>

        {/* Línea */}
        <div className="flex justify-center mb-10">
          <div
            ref={lineRef}
            className="w-24 h-[2px] bg-[#c6a77d] opacity-70"
          />
        </div>

        {/* Texto */}
        <p
          ref={textRef}
          className="text-[#5c4a3a] font-bentinck text-lg leading-relaxed tracking-wide"
        >
          En esta hermosa {franja}, queremos agradecerte de todo corazón por haber sido parte de nuestro día.
          Tu presencia hizo este momento aún más especial y significativo para nosotros.

          <br /><br />

          Nos llena de alegría haber compartido contigo cada sonrisa, cada emoción y cada instante vivido.
          Gracias por tu cariño, por tu compañía y por acompañarnos en el inicio de esta nueva etapa.
        </p>

      </div>

    </section>
  )
}