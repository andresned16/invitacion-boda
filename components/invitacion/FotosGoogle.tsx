'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function FotosGoogle() {
    const cameraRef = useRef<HTMLDivElement>(null)
    const flashRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!cameraRef.current || !flashRef.current) return

        const ctx = gsap.context(() => {

            // 🎞 Entrada suave
            gsap.fromTo(
                cameraRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' }
            )

            // 📸 Loop cada 2 segundos
            const flashTimeline = gsap.timeline({
                repeat: -1,
                repeatDelay: 2
            })

            flashTimeline
                // Wiggle rápido
                .to(cameraRef.current, {
                    rotate: -3,
                    duration: 0.05
                })
                .to(cameraRef.current, {
                    rotate: 3,
                    duration: 0.05
                })
                .to(cameraRef.current, {
                    rotate: 0,
                    duration: 0.05
                })

                // Flash 300ms total
                .to(flashRef.current, {
                    opacity: 1,
                    duration: 0.15,
                    ease: 'power1.out'
                })
                .to(flashRef.current, {
                    opacity: 0,
                    duration: 0.15,
                    ease: 'power1.in'
                })

        })

        return () => ctx.revert()
    }, [])

    return (
        <section className="py-20 px-6 max-w-3xl mx-auto text-center">
            
            <h2 className="text-5xl font-kingsguard mb-6 text-[#7a5c3e]">
                Fotos y Videos
            </h2>

            <div className="flex justify-center mb-8">
                <div
                    ref={cameraRef}
                    className="relative"
                >
                    <img
                        src="/images/iconCamera.png"
                        alt="Cámara"
                        className="
                            w-20
                            md:w-24
                            lg:w-28
                            object-contain
                            opacity-90
                        "
                    />

                    {/* Flash */}
                    <div
                        ref={flashRef}
                        className="
                            absolute
                            inset-0
                            bg-white
                            opacity-0
                            rounded-full
                            pointer-events-none
                        "
                    />
                </div>
            </div>

            <p className="text-lg leading-relaxed text-[#3b2f24] font-bentinck max-w-xl mx-auto">
                Comparte los momentos especiales que captures durante nuestra boda.
                Nos encantará revivir cada instante a través de tus fotos.
            </p>

            <div className="mt-10 flex justify-center">
                <a
                    href="https://photos.app.goo.gl/weMfZyNMxA6Smtgw9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        inline-block
                        bg-[#5C4632]
                        text-white
                        text-sm
                        px-8
                        py-3
                        tracking-wider
                        hover:opacity-90
                        transition
                        font-bentinck
                    "
                >
                    Compartir mis fotos
                </a>
            </div>

        </section>
    )
}
