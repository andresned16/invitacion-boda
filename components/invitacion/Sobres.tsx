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

            // 🌬 Flotación continua elegante
            gsap.to(sobresRef.current, {
                y: 8,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: 1.2
            })

            // 💌 Micro inclinación ocasional
            gsap.to(sobresRef.current, {
                rotate: 2,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: 2
            })

        })

        return () => ctx.revert()
    }, [])

    return (
        <section className="py-16 px-6 max-w-3xl mx-auto text-center">
            <img
                ref={sobresRef}
                src="/images/sobres.png"
                alt="Lluvia de sobres"
                className="
                    mx-auto
                    w-24
                    md:w-28
                    object-contain
                    opacity-90
                    mb-8
                "
            />

            <p className="font-kingsguard text-4xl text-[#7a5c3e]">
                Lluvia de Sobres
            </p>
        </section>
    )
}
