'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Portada from '@/components/invitacion/Portada'
import Itinerario from '@/components/invitacion/Itinerario'
import FotosGoogle from '@/components/invitacion/FotosGoogle'
import Decoracion from '@/components/ui/Decoracion'
import Menu from '@/components/thankyoupage/Menu'
import Agradecimiento from '@/components/thankyoupage/Agradecimiento'

gsap.registerPlugin(ScrollTrigger)

export default function InvitacionPage() {

  const floresRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const globoRef = useRef<HTMLImageElement>(null)
  const fotosRef = useRef<HTMLDivElement>(null)

  // 🌸 Animación flores superior
  useEffect(() => {
    if (!floresRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        floresRef.current,
        { y: -80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
        }
      )

      gsap.to(floresRef.current, {
        y: 8,
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      })
    })

    return () => ctx.revert()
  }, [])

  // 🎈 Animación globo
  useEffect(() => {
    if (!globoRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {

      // Movimiento vertical con scroll
      gsap.to(globoRef.current, {
        y: 600,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        }
      })

      // Movimiento lateral suave
      gsap.to(globoRef.current, {
        x: () => -window.innerWidth * 0.8,
        duration: 25,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })

      // Rotación leve
      gsap.to(globoRef.current, {
        rotation: 2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

    })

    return () => ctx.revert()
  }, [])
  useEffect(() => {
    if (!fotosRef.current) return

    const ctx = gsap.context(() => {

      gsap.from(fotosRef.current, {
        opacity: 0,
        y: 40,
        filter: 'blur(6px)',
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: fotosRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      })

    })

    return () => ctx.revert()
  }, [])
  return (
    <Decoracion>

      {/* 🌸 Flores */}
      <div
        ref={floresRef}
        className="pointer-events-none absolute top-0 left-0 w-full h-[160px] bg-no-repeat bg-bottom bg-cover z-20"
        style={{ backgroundImage: "url('/images/flores.png')" }}
      />

      {/* 🎈 Globo */}
      <img
        ref={globoRef}
        src="/images/globo.png"
        alt="Globo decorativo"
        className="
          pointer-events-none
          fixed
          top-14
          right-6
          sm:right-10
          md:right-16
          w-10 sm:w-12 md:w-16
          opacity-70
          z-0
        "
      />

      <div ref={containerRef}>

        <Portada />
        <Agradecimiento />
        {/* 🌸 Imagen panorámica flores */}
        <div className="fade-up flex justify-center my-8">
          <img
            src="/images/floresColor3.png"
            alt="Decoración"
            className="
      w-[85%]
      sm:w-[70%]
      md:w-[420px]
      lg:w-[360px]
      xl:w-[320px]
      2xl:w-[280px]
      object-contain
      opacity-80
    "
          />
        </div>
        <Itinerario />
        {/* 🌸 Imagen panorámica flores */}
        <div className="fade-up flex justify-center my-8">
          <img
            src="/images/floresPano.png"
            alt="Decoración"
            className="
      w-[85%]
      sm:w-[70%]
      md:w-[420px]
      lg:w-[360px]
      xl:w-[320px]
      2xl:w-[280px]
      object-contain
      opacity-80
    "
          />
        </div>
        <Menu />
        {/*  Imagen Linea */}
        <div className="fade-up flex justify-center my-8">
          <img
            src="/images/linea2.png"
            alt="Decoración 2"
            className="
      w-[85%]
      sm:w-[70%]
      md:w-[420px]
      lg:w-[360px]
      xl:w-[320px]
      2xl:w-[280px]
      object-contain
      opacity-80
    "
          />
        </div>
        <div ref={fotosRef}>
          <FotosGoogle />
        </div>

      </div>

    </Decoracion>
  )
}