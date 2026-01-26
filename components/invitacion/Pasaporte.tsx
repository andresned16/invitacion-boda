import { useState, useEffect, useRef } from 'react'

type PasaporteProps = {
  onAbrir: () => void
}

type Avion = {
  from: 'left' | 'right' | 'top' | 'bottom'
  progress: number
  startX: number
  startY: number
  endX: number
  endY: number
  curve: number
  x: number
  y: number
  delay: number
}

type Globo = {
  from: 'left' | 'right'
  progress: number
  startX: number
  startY: number
  endX: number
  endY: number
  curve: number
  x: number
  y: number
  delay: number
}

export default function Pasaporte({ onAbrir }: PasaporteProps) {
  const [visible, setVisible] = useState(true)
  const [backgroundVisible, setBackgroundVisible] = useState(true)
  const animationRef = useRef<number>(0)

  /* ===============================
     ✈️ AVIONES
  =============================== */

  function crearAvion(): Avion {
    const lados: Avion['from'][] = ['left', 'right', 'top', 'bottom']
    const from = lados[Math.floor(Math.random() * lados.length)]
    const w = window.innerWidth
    const h = window.innerHeight
    const curve = Math.random() * 50

    let startX = 0,
      startY = 0,
      endX = 0,
      endY = 0

    switch (from) {
      case 'left':
        startX = -120
        startY = Math.random() * h * 0.8 + 20
        endX = w + 120
        endY = startY + (Math.random() - 0.5) * 200
        break
      case 'right':
        startX = w + 120
        startY = Math.random() * h * 0.8 + 20
        endX = -120
        endY = startY + (Math.random() - 0.5) * 200
        break
      case 'top':
        startX = Math.random() * w * 0.8 + 20
        startY = -120
        endX = startX + (Math.random() - 0.5) * 200
        endY = h + 120
        break
      case 'bottom':
        startX = Math.random() * w * 0.8 + 20
        startY = h + 120
        endX = startX + (Math.random() - 0.5) * 200
        endY = -120
        break
    }

    return {
      from,
      progress: 0,
      startX,
      startY,
      endX,
      endY,
      curve,
      x: startX,
      y: startY,
      delay: Math.random() * 2000 + 500,
    }
  }

  const [aviones, setAviones] = useState<Avion[]>(() =>
    Array.from({ length: 3 }, crearAvion)
  )

  /* ===============================
     🎈 GLOBO
  =============================== */

  function crearGlobo(): Globo {
    const from: Globo['from'] = Math.random() > 0.5 ? 'left' : 'right'
    const h = window.innerHeight
    const startY = h * (0.3 + Math.random() * 0.4)

    return {
      from,
      progress: 0,
      startX: from === 'left' ? -100 : window.innerWidth + 100,
      endX: from === 'left' ? window.innerWidth + 100 : -100,
      startY,
      endY: startY - 50,
      curve: 40,
      x: from === 'left' ? -100 : window.innerWidth + 100,
      y: startY,
      delay: 3000,
    }
  }

  const [globo, setGlobo] = useState<Globo>(() => crearGlobo())

  /* ===============================
     🎬 ANIMACIÓN GLOBAL
  =============================== */

  useEffect(() => {
    const animate = () => {
      setAviones(prev =>
        prev.map(avion => {
          if (avion.delay > 0) {
            return { ...avion, delay: avion.delay - 16 }
          }

          const progress = avion.progress + 0.0018
          if (progress >= 1) return crearAvion()

          const x = avion.startX + (avion.endX - avion.startX) * progress
          const y =
            avion.startY +
            (avion.endY - avion.startY) * progress +
            Math.sin(progress * Math.PI) * avion.curve

          return { ...avion, progress, x, y }
        })
      )

      setGlobo(prev => {
        if (prev.delay > 0) {
          return { ...prev, delay: prev.delay - 16 }
        }

        const progress = prev.progress + 0.0006
        if (progress >= 1) return crearGlobo()

        const x = prev.startX + (prev.endX - prev.startX) * progress
        const y = prev.startY + Math.sin(progress * Math.PI) * prev.curve

        return { ...prev, progress, x, y }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  /* ===============================
     🧭 TRANSFORMS
  =============================== */

  const getAvionTransform = (avion: Avion) => {
    const dx = avion.endX - avion.startX
    const dy =
      avion.endY -
      avion.startY +
      Math.sin(avion.progress * Math.PI) * avion.curve

    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
    return `translate(${avion.x}px, ${avion.y}px) rotate(${angle + 90}deg)`
  }

  const getGloboTransform = (globo: Globo) => {
    const sway = Math.sin(globo.progress * Math.PI * 2) * 3
    return `translate(${globo.x}px, ${globo.y}px) rotate(${sway}deg)`
  }

  const handleAbrir = () => {
    setVisible(false)

    setTimeout(() => {
      setBackgroundVisible(false)
    }, 1000)

    setTimeout(() => {
      onAbrir()
    }, 2000)
  }

  return (
    <section
      className={`fixed inset-0 z-50 transition-all duration-1000 ${backgroundVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
      style={{
        backgroundColor: '#F7F3EE',
        backgroundImage: "url('/images/mapamundi.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 🚢 Barco (solo >800px) */}
      <img
        src="/images/barco.png"
        alt="Barco"
        className="
    fixed
    bottom-5                /* 📱 mobile */
    left-1/2
    -translate-x-1/2

    min-[800px]:bottom-[20%]
    min-[800px]:left-[10%]
    min-[800px]:lg:left-[12%]
    min-[800px]:xl:left-[15%]
    min-[800px]:-translate-x-1/2

    w-16                    /* 📱 más pequeño */
    min-[800px]:w-20        /* 🖥️ desktop */

    opacity-80
    pointer-events-none
    z-0

    animate-[floatDepth_6s_ease-in-out_infinite]
  "
      />




      {/* ✈️ Aviones */}
      {aviones.map((avion, i) => (
        <img
          key={i}
          src="/images/airplane.png"
          className="absolute w-14 pointer-events-none"
          style={{ transform: getAvionTransform(avion) }}
        />
      ))}

      {/* 🎈 Globo */}
      <img
        src="/images/globo.png"
        className="absolute w-20 pointer-events-none"
        style={{ transform: getGloboTransform(globo) }}
      />

      {/* 🧭 Brújula (solo >700px) */}
      <img
        src="/images/brujula.png"
        alt="Brújula"
        className="
    fixed
    bottom-2 right-2        /* 📱 mobile: bien pegada */

    min-[700px]:bottom-6
    min-[700px]:right-6     /* 🖥️ desktop */

    w-24
    md:w-32

    opacity-70
    pointer-events-none
    z-0

    animate-[wiggle_6s_ease-in-out_infinite]
  "
      />



      {/* 📘 Pasaporte */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          className={`
            rounded-2xl shadow-2xl p-10 text-center border
            transition-all duration-500
            ${visible
              ? 'opacity-100 scale-100 animate-[passportEnter_0.9s_ease-out]'
              : 'opacity-0 scale-95'
            }
          `}
          style={{
            width: '300px',
            height: '500px',
            backgroundImage: "url('/images/cuero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* TÍTULO */}
          <h1
            className="text-3xl tracking-widest mb-3 font-serif"
            style={{
              background: `
                linear-gradient(
                  135deg,
                  #7A1E2D 0%,
                  #8E2436 25%,
                  #B03A4A 50%,
                  #6A1724 75%,
                  #7A1E2D 100%
                )
              `,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `
                1px 1px 2px rgba(255,255,255,0.35),
               -1px -1px 2px rgba(60,0,10,0.45)
              `,
            }}
          >
            PASAPORTE
          </h1>

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <img
              src="/images/logopasaporte.png"
              className="w-64 h-auto opacity-90"
            />
          </div>

          {/* TEXTO */}
          <p
            className="uppercase text-nano tracking-wider mb-4 font-serif"
            style={{
              background: `
                linear-gradient(
                  180deg,
                  #8E2436 0%,
                  #7A1E2D 55%,
                  #6A1724 100%
                )
              `,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `
                1px 1px 2px rgba(255,255,255,0.35),
               -1px -1px 2px rgba(60,0,10,0.35)
              `,
            }}
          >
            Invitación a nuestra boda
            <span
              className="block text-xl tracking-wider mt-2"
              style={{
                background: `
                  linear-gradient(
                    180deg,
                    #9A2A3C 0%,
                    #7A1E2D 50%,
                    #651320 100%
                  )
                `,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: `
                  1px 1px 3px rgba(255,255,255,0.4),
                 -1px -1px 3px rgba(60,0,10,0.45)
                `,
              }}
            >
              Karen & Andrés
            </span>
          </p>

          {/* BOTÓN */}
          <button
            onClick={handleAbrir}
            className="
              relative px-8 py-3 rounded-full tracking-widest
              text-sm uppercase text-[#5A4A2E]
              hover:scale-105 transition-all duration-300
              shadow-xl overflow-hidden
              border border-white/40 backdrop-blur-sm
            "
            style={{
              background: `
                linear-gradient(
                  135deg,
                  #fbf7ef 0%,
                  #f2eadb 25%,
                  #fffaf0 50%,
                  #e8ddc8 75%,
                  #f6f1e6 100%
                )
              `,
            }}
          >
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    circle at 30% 30%,
                    rgba(255,255,255,0.55),
                    transparent 60%
                  )
                `,
                mixBlendMode: 'overlay',
              }}
            />
            Abrir pasaporte
          </button>
        </div>
      </div>
    </section>
  )
}
