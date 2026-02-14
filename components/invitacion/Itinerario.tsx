'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Itinerario() {

    const containerRef = useRef<HTMLDivElement>(null)

    const eventos = [
        { hora: '2:30 PM', titulo: 'Conferencia Biblica', imagen: '/images/lineadeltiempo/conferencia.png' },
        { hora: '5:00 PM', titulo: 'Recepción', imagen: '/images/lineadeltiempo/recepcion.png' },
        { hora: '5:30 PM', titulo: 'Entrada de los novios', imagen: '/images/lineadeltiempo/entradaNovios.png' },
        { hora: '6:00 PM', titulo: 'Fotografías', imagen: '/images/lineadeltiempo/fotos.png' },
        { hora: '7:00 PM', titulo: 'Cena', imagen: '/images/lineadeltiempo/cena.png' },
        { hora: '8:00 PM', titulo: 'Baile de los novios', imagen: '/images/lineadeltiempo/baileNovios.png' },
        { hora: '8:30 PM', titulo: 'Disfruta la fiesta', imagen: '/images/lineadeltiempo/fiesta.png' },
        { hora: '12:00 AM', titulo: 'Comienzo de nuestra Historia', imagen: '/images/lineadeltiempo/comienzoHistoria.png' },
    ]

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Línea vertical
            gsap.from(".timeline-line", {
                scaleY: 0,
                transformOrigin: "top center",
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            })

            // Items izquierda/derecha
            gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {

                const direction = i % 2 === 0 ? -60 : 60

                gsap.from(item, {
                    opacity: 0,
                    x: direction,
                    duration: 1,
                    delay: i * 0.1, // pequeño escalonado elegante
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 70%", // 👈 aparece más tarde
                        toggleActions: "play none none none",
                        once: true // solo se ejecuta una vez
                    }
                })
            })


            // Puntos centrales
            gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {

                const dot = item.querySelector(".timeline-dot")

                if (!dot) return

                gsap.from(dot, {
                    scale: 0,
                    duration: 0.6,
                    ease: "back.out(2)", // zoom más marcado
                    scrollTrigger: {
                        trigger: item,
                        start: "top 70%",
                        toggleActions: "play none none none",
                        once: true
                    }
                })
            })


            // 🎯 Animaciones infinitas para iconos
            gsap.utils.toArray<HTMLElement>(".timeline-icon").forEach((icon, i) => {

                const animType = i % 3

                ScrollTrigger.create({
                    trigger: icon,
                    start: "top 5%",
                    onEnter: () => {

                        if (animType === 0) {
                            // Float suave
                            gsap.to(icon, {
                                y: -8,
                                duration: 2,
                                repeat: -1,
                                yoyo: true,
                                ease: "sine.inOut"
                            })
                        }

                        if (animType === 1) {
                            // Wiggle leve
                            gsap.to(icon, {
                                rotation: 6,
                                duration: 0.6,
                                repeat: -1,
                                yoyo: true,
                                ease: "sine.inOut"
                            })
                        }

                        if (animType === 2) {
                            // Pulse elegante
                            gsap.to(icon, {
                                scale: 1.08,
                                duration: 1.2,
                                repeat: -1,
                                yoyo: true,
                                ease: "power1.inOut"
                            })
                        }

                    }
                })
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])


    return (
        <section className="py-16 sm:py-20 px-4 sm:px-6">
            <h2 className="text-center text-4xl sm:text-5xl font-kingsguard mb-14 sm:mb-16 text-[#7a5c3e]">
                Itinerario
            </h2>

            <div ref={containerRef} className="relative max-w-md sm:max-w-xl mx-auto">

                {/* Línea vertical animada */}
                <div className="timeline-line absolute left-1/2 top-0 h-full w-[2px] bg-[#b08b5a] -translate-x-1/2" />

                <ul className="space-y-10 sm:space-y-12">
                    {eventos.map((evento, index) => (
                        <li
                            key={index}
                            className="timeline-item relative grid grid-cols-[1fr_1fr] items-center"
                        >

                            {/* Evento izquierda */}
                            <div className="
                                flex justify-end items-center
                                pr-8 sm:pr-10
                                text-[#3b2f24]
                            ">
                                <span className="
                                    font-medium
                                    font-bentinck
                                    text-xs sm:text-sm md:text-base
                                    text-right
                                    leading-snug
                                ">
                                    {evento.titulo}
                                </span>
                            </div>

                            {/* Hora + icono */}
                            <div className="
                                pl-8 sm:pl-10
                                flex items-center gap-4
                                text-xs sm:text-sm md:text-base
                                tracking-wide
                                text-[#7a5c3e]
                                font-bentinck
                            ">

                                <span>
                                    {evento.hora}
                                </span>

                                <img
                                    src={evento.imagen}
                                    alt={evento.titulo}
                                    className="timeline-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                                />


                            </div>

                            {/* Punto central animado */}
                            <span
                                className="
                                    timeline-dot
                                    absolute
                                    left-1/2
                                    top-1/2
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    w-3 h-3 sm:w-4 sm:h-4
                                    rounded-full
                                    bg-[#b08b5a]
                                    z-10
                                "
                            />
                        </li>
                    ))}
                </ul>

            </div>
        </section>
    )
}
