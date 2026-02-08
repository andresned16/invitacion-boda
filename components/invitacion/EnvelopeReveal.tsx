'use client'

import { ReactNode, useRef } from 'react'
import gsap from 'gsap'

interface EnvelopeRevealProps {
  children: ReactNode
}

export default function EnvelopeReveal({ children }: EnvelopeRevealProps) {
  const envelopeRef = useRef<HTMLDivElement>(null)
  const ticketRef = useRef<HTMLDivElement>(null)

  const abrir = () => {
    const tl = gsap.timeline()

    tl.to(envelopeRef.current, {
      y: -40,
      duration: 0.4
    })
    .fromTo(
      ticketRef.current,
      { y: 200, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.2"
    )
    .to(envelopeRef.current, {
      opacity: 0,
      duration: 0.5
    })
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      <div
        ref={envelopeRef}
        onClick={abrir}
        className="absolute w-72 h-48 bg-[#f1e5d6] rounded-lg shadow-xl cursor-pointer z-20"
      />

      <div ref={ticketRef} className="opacity-0">
        {children}
      </div>
    </div>
  )
}
