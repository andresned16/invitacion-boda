'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Galeria() {

  const avionRef = useRef<HTMLImageElement>(null)
  const pasaporteRef = useRef<HTMLImageElement>(null)
  const camaraRef = useRef<HTMLImageElement>(null)
  const brujulaRef = useRef<HTMLImageElement>(null)

  const images = [
    "/images/gallery/foto1.jpeg",
    "/images/gallery/foto2.jpeg",
    "/images/gallery/foto3.jpeg",
  ]

  const [index, setIndex] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)


  // 🎬 Animaciones iconos
  useEffect(() => {

    gsap.to(avionRef.current, {
      y: -20,
      x: 15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    gsap.to(pasaporteRef.current, {
      rotation: 5,
      duration: 0.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    gsap.to(brujulaRef.current, {
      rotation: -6,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })

    gsap.to(camaraRef.current, {
      scale: 1.1,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    })

  }, [])

  // 🎬 Fade animación al cambiar imagen
  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    )
  }, [index])

  // ⏱ Auto cambio cada 5s
// ⏱ Auto cambio cada 5s
useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prev) => (prev + 1) % images.length)
  }, 5000)

  return () => clearInterval(interval)
}, [])



  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto text-center">

      <h2 className="text-5xl font-kingsguard mb-6 text-[#7a5c3e]">
        Galería
      </h2>

      <p className="text-lg leading-relaxed text-[#3b2f24] font-bentinck mb-12">
        Algunos de nuestros mejores momentos
      </p>

      <div className="relative mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">

        {/* 📸 IMAGEN DINÁMICA DETRÁS DEL MARCO */}
        <div className="absolute inset-[12%] overflow-hidden rounded-md z-0">
          <img
            ref={imageRef}
            src={images[index]}
            alt="Foto galería"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 🖼 Fondo Marco */}
        <img
          src="/images/fondoGaleria.png"
          alt="Fondo galería"
          className="w-full h-auto block relative z-10"
        />

        {/* Flechas */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 px-3 py-1 rounded-full shadow"
        >
          ←
        </button>

        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 px-3 py-1 rounded-full shadow"
        >
          →
        </button>

        {/* Iconos encima */}
        <img
          ref={pasaporteRef}
          src="/images/pasaporte.png"
          alt="Pasaporte"
          className="absolute top-[6%] left-[6%] w-16 sm:w-20 md:w-24 lg:w-28 z-20"
        />

        <img
          ref={avionRef}
          src="/images/avion.png"
          alt="Avión"
          className="absolute top-[11%] right-[15%] w-20 sm:w-24 md:w-28 lg:w-32 scale-[1.3] z-20"
        />

        <img
          ref={camaraRef}
          src="/images/camara.png"
          alt="Cámara"
          className="absolute bottom-[5%] left-[8%] w-16 sm:w-20 md:w-24 lg:w-28 z-20"
        />

        <img
          ref={brujulaRef}
          src="/images/brujula2.png"
          alt="Brújula"
          className="absolute bottom-[2%] right-[8%] w-16 sm:w-20 md:w-24 lg:w-28 z-20"
        />

      </div>
    </section>
  )
}
