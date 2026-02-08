'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import gsap from 'gsap'

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

  // 🌸 Animación flores
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
  }, [pasaporteAbierto]) // 👈 CLAVE


  if (loading) return <p>Cargando…</p>
  if (!familia) return <p>Invitación no encontrada</p>

  if (!pasaporteAbierto) {
    return <Pasaporte onAbrir={() => setPasaporteAbierto(true)} />
  }

  return (
    <Decoracion>
      {/* 🌸 Flores */}
      <div
        ref={floresRef}
        className="
    pointer-events-none
    absolute
    top-0
    lg:-top-4
    xl:-top-8
    2xl:-top-12
    left-0
    w-full

    h-[140px]
    md:h-[160px]
    lg:h-[180px]

    bg-no-repeat
    bg-bottom
    bg-cover

    z-20
  "
        style={{
          backgroundImage: "url('/images/flores.png')",
        }}
      />


      {/* Contenido */}
      <div>
        <Portada />

        <Historia familia={familia} />

        <Fecha />


        <Countdown fecha="2026-06-28T14:30:00" />
        {/* 🌸 Separador panorámico */}
        <div
          className="
    w-full
    h-[80px]
    md:h-[110px]
    lg:h-[140px]
    bg-center
    bg-no-repeat
    bg-contain
    my-10
  "
          style={{
            backgroundImage: "url('/images/floresPano.png')",
          }}
        />

        <section className="py-20 bg-[#f7f3ee]">
          <h2 className="text-5xl font-kingsguard mb-10 text-[#7a5c3e]">
            Destinos
          </h2>

          <div className="flex justify-center font-bentinck">

            <EventoInfo
              eventos={[
                {
                  titulo: 'Conferencia Biblica',
                  hora: '2:30 PM',
                  lugar:
                    'Salón del Reino de los Testigos de Jehová, Barrio Profesionales. Cl. 5 Nte. #17-18, Armenia, Quindío',
                  ubicacionUrl:
                    'https://maps.app.goo.gl/mAv57uoMru9iaV2J9',
                },
                {
                  titulo: 'Recepción',
                  hora: '5:00 PM',
                  lugar: 'Km 2 Vía al Caimo, Villa Juliana, Armenia, Quindío',
                  ubicacionUrl:
                    'https://maps.app.goo.gl/y2Bpkje5uFEwBgfD8',
                },
              ]}
            />
          </div>

        </section>
        <Vestimenta />
        {/* ✨ Línea separadora */}
        <div className="flex justify-center my-8 md:my-8">
          <img
            src="/images/linea.png"
            alt="Separador"
            className="
      w-56
      md:w-72
      lg:w-96
      opacity-90
    "
          />
        </div>


        <Confirmacion familia={familia} />

        <Itinerario />

        {/* 🌸 Separador floral */}
        <div
          className="
    w-full
    h-[100px]
    md:h-[130px]
    lg:h-[160px]
    bg-center
    bg-no-repeat
    bg-contain
    my-4
  "
          style={{
            backgroundImage: "url('/images/floresColor3.png')",
          }}
        />

        <Sobres />

        <FotosGoogle />
        <Galeria />
      </div>

    </Decoracion>
  )
}
