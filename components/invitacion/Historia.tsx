'use client'

import type { Familia } from '@/app/[familia]/page'

export default function Historia({ familia }: { familia: Familia }) {
    const esFamilia = familia.invitados_posibles.length > 1

    return (
        <section className="py-16 px-6 max-w-3xl mx-auto text-center">
            {/* Invitado */}
            <h1 className="font-kingsguard text-4xl md:text-5xl font-semibold text-[#7a5c3e] mb-4">
                {esFamilia
                    ? `${familia.nombre_familia}`
                    : familia.invitados_posibles[0]}
            </h1>


            <p className="text-base md:text-lg mb-10 text-[#3b2f24] leading-relaxed font-krylon">
                {esFamilia ? (
                    <>
                        En esta invitación queremos extenderles una cariñosa invitación
                        a nuestra boda, pues ustedes son muy importantes para nosotros.
                    </>
                ) : (
                    <>
                        En esta invitación queremos extenderte una cariñosa invitación
                        a nuestra boda, pues eres muy importante para nosotros.
                    </>
                )}
            </p>

            {/* Historia */}
            <h2 className="text-4xl font-kingsguard mb-6 text-[#7a5c3e]">
                Nuestra historia
            </h2>

            <p className="text-lg leading-relaxed text-[#3b2f24] font-krylon">
                Todo comenzó cuando...
            </p>
        </section>
    )
}
