'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AlertCircle, Heart } from "lucide-react"

import Decoracion from '@/components/ui/Decoracion'
import Pasaporte from '@/components/invitacion/Pasaporte'
import Portada from '@/components/invitacion/Portada'
import Historia from '@/components/invitacion/Historia'
import EventoInfo from '@/components/invitacion/EventoInfo'
import Countdown from '@/components/invitacion/Countdown'
import Confirmacion from '@/components/invitacion/Confirmacion'
import Itinerario from '@/components/invitacion/Itinerario'
import Fecha from '@/components/invitacion/Fecha'
import Vestimenta from '@/components/invitacion/Vestimenta'
import Sobres from '@/components/invitacion/Sobres'
import FotosGoogle from '@/components/invitacion/FotosGoogle'
import Galeria from '@/components/invitacion/Galeria'
import Presentacion from '@/components/invitacion/Presentacion'
import PlaylistBoda from '@/components/invitacion/PlaylistBoda'


gsap.registerPlugin(ScrollTrigger)

export type Familia = {
  id: string
  slug_familia: string
  nombre_familia: string
  invitados_posibles: string[]
  invitados_confirmados: string[] | null
  cantidad_invitados: number
  confirmado: boolean
}

export default function InvitacionPage() {
  const params = useParams()
  const familiaSlug = params.familia as string

  const [familia, setFamilia] = useState<Familia | null>(null)
  const [loading, setLoading] = useState(true)
  const [pasaporteAbierto, setPasaporteAbierto] = useState(false)

  const floresRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const globoRef = useRef<HTMLImageElement>(null)


  useEffect(() => {
    const fetchFamilia = async () => {
      const { data } = await supabase
        .from('familias')
        .select('*')
        .eq('slug_familia', familiaSlug)
        .single()

      setFamilia(data ?? null)
      setLoading(false)
    }

    fetchFamilia()
  }, [familiaSlug])

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
  }, [pasaporteAbierto])


  //Movimiento del Globo

  useEffect(() => {
    if (!globoRef.current) return
    if (!containerRef.current) return

    const ctx = gsap.context(() => {

      // 🎈 Movimiento vertical ligado al scroll
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

      // 🌬 Movimiento lateral elegante (cruce completo lento)
      gsap.to(globoRef.current, {
        x: -window.innerWidth + 150, // cruza casi toda la pantalla
        duration: 25,               // MUY lento
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })


      // 💫 Rotación suave tipo viento
      gsap.to(globoRef.current, {
        rotation: 2,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

    })

    return () => ctx.revert()
  }, [pasaporteAbierto])



  // ✨ Animaciones elegantes por sección (precisas)
  // ✨ Animaciones elegantes por sección (responsive inteligente)
  useEffect(() => {
    if (!pasaporteAbierto) return
    if (!containerRef.current) return

    const ctx = gsap.context(() => {

      const isMobile = window.innerWidth < 768
      const lateralOffset = isMobile ? 0 : 60

      // Fade desde abajo (siempre)
      gsap.utils.toArray<HTMLElement>('.fade-up').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })

      // Fade izquierda (solo lateral en desktop)
      gsap.utils.toArray<HTMLElement>('.fade-left').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: -lateralOffset,
          y: isMobile ? 40 : 0,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        })
      })

      // Fade derecha (solo lateral en desktop)
      gsap.utils.toArray<HTMLElement>('.fade-right').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: lateralOffset,
          y: isMobile ? 40 : 0,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [pasaporteAbierto])


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#fdfaf6]">
        <div className="text-center">

          {/* Spinner romántico */}
          <div className="relative flex items-center justify-center mb-6">

            {/* Anillo girando */}
            <div className="w-16 h-16 border-4 border-[#d6c3b3] border-t-[#b89b7a] rounded-full animate-spin" />

            {/* Corazón centrado */}
            <Heart className="absolute w-6 h-6 text-[#b89b7a]" />
          </div>


          <p className="text-[#a38b75] text-sm tracking-wide font-bentinck">
            Cargando invitación...
          </p>

        </div>
      </div>
    )
  }
  if (!familia) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <div className="flex justify-center mb-4">
            <AlertCircle className="w-14 h-14 text-red-400" />
          </div>

          <h2 className="text-2xl font-semibold text-[#7a5c3e] mb-2 font-bentinck">
            Invitación no encontrada
          </h2>

          <p className="text-[#a38b75] font-bentinck">
            No pudimos encontrar la invitación que estás buscando.
            Verifica el enlace o comunícate con los anfitriones.
          </p>

        </div>
      </div>
    )
  }

  if (!pasaporteAbierto) {
    return <Pasaporte onAbrir={() => setPasaporteAbierto(true)} />
  }

  return (
    <Decoracion>
      {/* 🌸 Flores */}
      <div
        ref={floresRef}
        className="pointer-events-none absolute top-0 left-0 w-full h-[160px] bg-no-repeat bg-bottom bg-cover z-20"
        style={{ backgroundImage: "url('/images/flores.png')" }}
      />
      {/* 🎈 Globo flotando detrás */}
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

        {/* ✅ Portada SIN animación scroll */}
        <Portada />

        <div className="fade-up">
          <Presentacion familia={familia} />
        </div>
        {/*  Imagen Linea */}
        <div className="fade-left flex justify-center">
          <img
            src="/images/linea2.png"
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
        <div className="fade-up">
          <Historia />
        </div>
        <div className="fade-left">
          <Fecha />
        </div>

        <div className="fade-right">
          <Countdown fecha="2026-06-28T14:30:00" />
        </div>
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
        <section className="py-20 fade-up">
          <h2 className="text-5xl font-kingsguard mb-10 text-[#7a5c3e]">
            Destinos
          </h2>

          <div className="flex justify-center font-bentinck">
            <EventoInfo
              eventos={[
                {
                  titulo: 'Conferencia Bíblica',
                  hora: '2:30 PM',
                  lugar:
                    'Salón del Reino de los Testigos de Jehová, Barrio Profesionales. Cl. 5 Nte. #17-18, Armenia, Quindío',
                  ubicacionUrl:
                    'https://maps.app.goo.gl/mAv57uoMru9iaV2J9',
                },
                {
                  titulo: 'Recepción',
                  hora: '5:00 PM',
                  lugar:
                    'Km 2 Vía al Caimo, Villa Juliana, Armenia, Quindío',
                  ubicacionUrl:
                    'https://maps.app.goo.gl/y2Bpkje5uFEwBgfD8',
                },
              ]}
            />
          </div>
        </section>


        <div className="fade-left">
          <Vestimenta />
        </div>
        {/*  Imagen Linea */}
        <div className="fade-up flex justify-center my-8">
          <img
            src="/images/linea.png"
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



        <div className="fade-right">
          <Confirmacion familia={familia} />
        </div>

        <div className="fade-up">
          <Itinerario />
        </div>
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
        <div className="fade-left">
          <Sobres />
        </div>
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
        <div className="fade-up">
          <FotosGoogle />
        </div>

        <div className="fade-up">
          <Galeria />
        </div>
        <div className="fade-left">
          <PlaylistBoda />
        </div>


      </div>
    </Decoracion>
  )
}
