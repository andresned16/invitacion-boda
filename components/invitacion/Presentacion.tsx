'use client'

import type { Familia } from '@/app/[familia]/page'

export default function Presentacion({ familia }: { familia: Familia }) {
    const esFamilia = familia.invitados_posibles.length > 1

    return (
        <section className="py-16 px-6 max-w-3xl mx-auto text-center">
            {/* Invitado */}
            <h1 className="font-kingsguard text-4xl md:text-5xl font-semibold text-[#7a5c3e] mb-4">
                {esFamilia
                    ? `${familia.nombre_familia}`
                    : familia.invitados_posibles[0]}
            </h1>

            <p className="text-base md:text-lg mb-10 text-[#3b2f24] leading-relaxed font-bentinck">
                {esFamilia ? (
                    <>
                        Con inmensa alegría en nuestros corazones, queremos extenderles una
                        cariñosa invitación a celebrar uno de los días más especial de nuestras vidas.
                        Nuestra boda no estaría completa sin la presencia de quienes han sido
                        parte importante de nuestro camino, y ustedes ocupan un lugar muy
                        especial para nosotros.
                        <br /><br />
                        Será un honor compartir junto a ustedes este momento lleno de amor,
                        unión y gratitud.
                    </>
                ) : (
                    <>
                        Con inmensa alegría en nuestros corazones, queremos extenderte una
                        cariñosa invitación a celebrar uno de los días más especial de nuestras vidas.
                        Nuestra boda no estaría completa sin la presencia de quien ha sido
                        parte importante de nuestro camino, y tú ocupas un lugar muy especial
                        para nosotros.
                        <br /><br />
                        Será un honor compartir contigo este momento lleno de amor,
                        unión y gratitud.
                    </>
                )}
            </p>

          
        </section>
    )
}
