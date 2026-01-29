'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import LineaOndulada from '@/components/invitacion/LineaOndulada'

export default function Fecha() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const florTopRef = useRef<HTMLImageElement>(null)
  const florBottomRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 🌸 Flor superior derecha
      if (florTopRef.current) {
        gsap.fromTo(
          florTopRef.current,
          { opacity: 0, x: 40, y: -40, rotate: 5 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            duration: 1.4,
            ease: 'power3.out',
            delay: 0.3,
          }
        )

        gsap.to(florTopRef.current, {
          y: 10,
          duration: 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      // 🌸 Flor inferior izquierda
      if (florBottomRef.current) {
        gsap.fromTo(
          florBottomRef.current,
          { opacity: 0, x: -40, y: 40, rotate: -6 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            duration: 1.4,
            ease: 'power3.out',
            delay: 0.6,
          }
        )

        gsap.to(florBottomRef.current, {
          y: -8,
          duration: 4.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="
        relative
        px-6
        max-w-3xl
        mx-auto
        text-center
        pt-16
        pb-16
        overflow-hidden
      "
    >
      <div className="relative py-12 sm:py-16 flex justify-center">
        {/* 🌸 Flor superior derecha */}
        <img
          ref={florTopRef}
          src="/images/floresColor.png"
          alt="Decoración floral superior"
          className="
            absolute
            top-0
            right-0
            translate-x-6
            -translate-y-6
            sm:translate-x-8 sm:-translate-y-8
            md:translate-x-10 md:-translate-y-10
            w-24 sm:w-28 md:w-32 lg:w-40
            opacity-90
            pointer-events-none
            z-10
          "
        />

        {/* 🌸 Flor inferior izquierda */}
        <img
          ref={florBottomRef}
          src="/images/floresColor2.png"
          alt="Decoración floral inferior"
          className="
            absolute
            bottom-0
            left-0
            -translate-x-6
            translate-y-6
            sm:-translate-x-8 sm:translate-y-8
            md:-translate-x-10 md:translate-y-10
            w-20 sm:w-24 md:w-28 lg:w-36
            opacity-90
            pointer-events-none
            z-10
          "
        />

        {/* 📅 Fecha */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-[#7a5c3e] relative z-20">
          {/* DOMINGO */}
          <div className="flex flex-col items-center gap-1">
            <LineaOndulada color="#9b6bb3" />
            <div className="uppercase tracking-widest text-sm sm:text-base md:text-lg font-bentinck">
              DOMINGO
            </div>
            <LineaOndulada color="#9b6bb3" />
          </div>

          {/* NÚMERO */}
          <div className="flex flex-col items-center px-1">
            <div className="font-dancingScript text-6xl sm:text-7xl md:text-8xl leading-none">
              28
            </div>
            <div className="text-sm tracking-[0.3em] opacity-70 font-bentinck">
              2026
            </div>
          </div>

          {/* JUNIO */}
          <div className="flex flex-col items-center gap-1">
            <LineaOndulada color="#e38b7a" />
            <div className="uppercase tracking-widest text-sm sm:text-base md:text-lg font-bentinck">
              JUNIO
            </div>
            <LineaOndulada color="#f0a04b" />
          </div>
        </div>
      </div>
    </section>
  )
}
