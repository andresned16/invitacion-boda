/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function Vestimenta() {

  const vestidoRef = useRef<HTMLImageElement | null>(null)
  const trajeRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!vestidoRef.current || !trajeRef.current) return

    const tl = gsap.timeline()

    tl.fromTo(
      vestidoRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    )

    tl.fromTo(
      trajeRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    )

    const float = gsap.to([vestidoRef.current, trajeRef.current], {
      y: 6,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    return () => {
      tl.kill()
      float.kill()
    }

  }, [])


  return (
    <section className="py-16 px-6 max-w-3xl mx-auto text-center">

      <h2 className="text-5xl font-kingsguard mb-10 text-[#7a5c3e]">
        Código de Vestimenta
      </h2>

      <p className="text-lg text-[#5c4632] font-bentinck mt-2">
        Queremos recordarles, con mucho cariño, que lo más importante para nosotros es contar con su compañía. Las referencias de vestimenta son solo una guía para esta ocasión tan especial; vengan como se sientan cómodos, sin dejar de lado un estilo acorde a la ocasión.
      </p>
      {/* ================= MUJERES ================= */}
      <p className="text-xl text-[#5c4632] font-bentinck mt-10">
        MUJERES
      </p>

     

      <div className="flex justify-center mt-6">
        <img
          ref={vestidoRef}
          src="/images/vestido.png"
          alt="Vestido largo elegante"
          className="w-24 md:w-28"
        />
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href="https://mx.pinterest.com/search/pins/?q=tropical%20formal%20mujeres&rs=typed"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block
            bg-[#5C4632]
            text-white
            text-sm
            px-6
            py-2
            tracking-wider
            hover:opacity-90
            transition
            font-bentinck
          "
        >
          Ver referencias
        </a>
      </div>

      {/* ================= HOMBRES ================= */}
      <p className="text-xl text-[#5c4632] font-bentinck mt-20">
        HOMBRES
      </p>


      <div className="flex justify-center mt-6">
        <img
          ref={trajeRef}
          src="/images/traje.png"
          alt="Traje elegante para boda en playa"
          className="w-24 md:w-28"
        />
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href="https://mx.pinterest.com/search/pins/?q=outfits%20hombres%20boda%20casual&rs=ac&len=22&source_id=ac_QWaxdNYw&eq=casual%20hombres%20outfits&etslf=4168"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block
            bg-[#5C4632]
            text-white
            text-sm
            px-6
            py-2
            tracking-wider
            hover:opacity-90
            transition
            font-bentinck
          "
        >
          Ver referencias
        </a>
      </div>

    </section>
  )
}
