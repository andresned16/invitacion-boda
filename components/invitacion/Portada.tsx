'use client'

import { useRef, useState } from 'react'
import { Play, Pause } from "lucide-react"


export default function Portada() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggleMusic = async () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
    } else {
      try {
        await audioRef.current.play()
      } catch (err) {
        console.log('Autoplay bloqueado hasta interacción del usuario')
      }
    }

    setPlaying(!playing)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7f3ee]">
      {/* Fondo */}
      <div
        className="
          absolute inset-0 bg-cover bg-center
          blur-xl scale-105
          animate-[focus_2s_ease-out_forwards]
        "
        style={{ backgroundImage: "url('/images/portada.jpg')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Contenido */}
      <div className="absolute left-1/2 top-[75%] -translate-x-1/2 -translate-y-1/2 w-full px-6 text-center text-white">
        <h1
          className="
            font-kingsguard text-5xl md:text-7xl drop-shadow-lg mb-8
            opacity-0 translate-y-6
            animate-[fadeUp_1s_ease-out_0.6s_forwards]
          "
        >
          Karen & Andrés
        </h1>

        <div
          className="
            flex flex-col items-center gap-4
            opacity-0 translate-y-6
            animate-[fadeUp_1s_ease-out_1.1s_forwards]
          "
        >
          <button
            onClick={toggleMusic}
            className="inline-flex items-center gap-2 bg-black/60 backdrop-blur px-6 py-3 rounded-full tracking-widest text-sm hover:bg-black/70 transition"
          >
            {playing ? (
              <Pause className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Play className="w-5 h-5" strokeWidth={1.5} />
            )}

            {playing ? 'PAUSAR MÚSICA' : 'REPRODUCIR MÚSICA'}
          </button>

          <div className="bg-[#f7f3ee] text-[#5c4632] px-6 py-2 tracking-[0.25em] text-sm border-t border-b border-[#b08b5a]">
            28 · 06 · 2026
          </div>
        </div>
      </div>

      {/* 🎵 Audio */}
      <audio ref={audioRef} src="/audio/song.mp3" loop />
    </section>
  )
}
