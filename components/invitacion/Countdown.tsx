'use client'

import { useEffect, useState } from 'react'

export default function Countdown({ fecha }: { fecha: string }) {
    const [time, setTime] = useState({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        finished: false,
    })

    useEffect(() => {
        const target = new Date(fecha).getTime()


        const interval = setInterval(() => {
            const now = Date.now()
            const diff = target - now

            if (diff <= 0) {
                setTime({ d: 0, h: 0, m: 0, s: 0, finished: true })
                clearInterval(interval)
                return
            }

            setTime({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60),
                s: Math.floor((diff / 1000) % 60),
                finished: false,
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [fecha])

    if (time.finished) {
        return (
            <section className="py-20 text-center">
                <p className="text-3xl font-serif text-[#b08b5a]">
                    ¡Hoy es el gran día! 💍
                </p>
            </section>
        )
    }

    return (
        <section className="relative py-20 max-[440px]:py-14 text-center overflow-hidden">

            {/* Fondo polvo responsive */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="
                    w-[78%] h-[78%]
                    sm:w-[65%] sm:h-[65%]
                    bg-center
                    bg-contain
                    bg-no-repeat
                    opacity-40
                    bg-[url('/images/polvoMobile.png')]
                    sm:bg-[url('/images/polvo.png')]
                "
                />
            </div>

            {/* Contenido */}
            <div className="relative z-10">
                <h2 className="text-5xl font-kingsguard mb-10 text-[#7a5c3e]">
                    ¡Faltan pocos días!
                </h2>

                <div className="flex justify-center">
                    <div
                        className="
                        flex
                        flex-nowrap
                        items-center
                        origin-center
                        scale-100
                        max-[520px]:scale-[0.85]
                        max-[440px]:scale-[0.75]
                        max-[380px]:scale-[0.65]
                    "
                    >
                        <TimeBox value={time.d} label="DÍAS" />
                        <Separator />
                        <TimeBox value={time.h} label="HORAS" />
                        <Separator />
                        <TimeBox value={time.m} label="MINUTOS" />
                        <Separator />
                        <TimeBox value={time.s} label="SEGUNDOS" />
                    </div>
                </div>
            </div>
        </section>
    )


}

function TimeBox({ value, label }: { value: number; label: string }) {
    return (
        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                w-[95px]
                h-[125px]
                sm:w-[110px]
                sm:h-[145px]
                bg-no-repeat
                bg-center
                bg-contain
                shrink-0
            "
            style={{
                backgroundImage: "url('./images/pergamino.png')",
            }}
        >
            <span
                className="
                    font-dancingScript
                    text-4xl
                    sm:text-5xl
                    text-[#7A5C3E]
                    leading-none
                "
            >
                {String(value).padStart(2, '0')}
            </span>

            <span
                className="
                    mt-1
                    text-[9px]
                    tracking-widest
                    text-[#7A5C3E]
                "
            >
                {label}
            </span>
        </div>
    )
}

function Separator() {
    return (
        <span
            className="
                mx-0
                min-[340px]:mx-[2px]
                sm:mx-2
                md:mx-4
                lg:mx-6
                text-2xl
                sm:text-3xl
                font-serif
                text-[#b08b5a]
                opacity-70
                shrink-0
                relative
                z-10
            "
        >
            :
        </span>
    )
}
