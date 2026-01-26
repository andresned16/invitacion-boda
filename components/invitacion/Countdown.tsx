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
        <section className="py-20 max-[440px]:py-14 text-center bg-[#f7f3ee]">

            <h2 className="mb-10 text-3xl font-script text-[#7a5c3e]">
                ¡Faltan pocos días!
            </h2>

            <div className="flex justify-center">
                <div
                    className="
            flex
            items-center
            gap-6
            origin-center
            scale-100
            max-[510px]:scale-[0.85]
            max-[440px]:scale-[0.75]
            max-[380px]:scale-[0.65]
        "
                >

                    <TimeBox value={time.d} label="DAYS" />
                    <Separator />
                    <TimeBox value={time.h} label="HOURS" />
                    <Separator />
                    <TimeBox value={time.m} label="MINUTES" />
                    <Separator />
                    <TimeBox value={time.s} label="SECONDS" />
                </div>
            </div>
        </section>
    )
}

function TimeBox({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center min-w-[70px]">
            <span className="text-5xl font-serif text-[#b08b5a] tracking-wide">
                {String(value).padStart(2, '0')}
            </span>
            <span className="mt-2 text-xs tracking-widest text-[#7a5c3e]">
                {label}
            </span>
        </div>
    )
}

function Separator() {
    return (
        <span className="text-4xl font-serif text-[#b08b5a]">:</span>
    )
}
