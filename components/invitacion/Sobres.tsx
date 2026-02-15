'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Sobres() {
    const sobresRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        if (!sobresRef.current) return

        const ctx = gsap.context(() => {

            // ✨ Entrada suave
            gsap.fromTo(
                sobresRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: 'power3.out'
                }
            )

            // 💌 Wiggle continuo elegante
            gsap.to(sobresRef.current, {
                rotation: 3,
                duration: 0.25,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: 1.2
            })

        })

        return () => ctx.revert()
    }, [])

    return (
        <section className="py-16 px-6 max-w-3xl mx-auto text-center">
            <h2 className="font-kingsguard text-5xl text-[#7a5c3e] mb-8">
                Lluvia de Sobres
            </h2>

            <img
                ref={sobresRef}
                src="/images/sobres.png"
                alt="Lluvia de sobres"
                className="
  mx-auto
  w-28
  md:w-36
  object-contain
  opacity-90
  mb-6
"

            />

        </section>
    )
}
