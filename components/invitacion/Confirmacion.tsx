'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Familia } from '@/app/[familia]/page'

export default function Confirmacion({ familia }: { familia: Familia }) {
    const [seleccionados, setSeleccionados] = useState<string[]>(
        familia.invitados_confirmados ?? []
    )
    const [error, setError] = useState<string | null>(null)
    const [guardando, setGuardando] = useState(false)
    const [confirmadoLocal, setConfirmadoLocal] = useState(familia.confirmado)

    const [fechaLimiteUTC, setFechaLimiteUTC] = useState<Date | null>(null)
    const [timezoneEvento, setTimezoneEvento] = useState<string>('America/Bogota')
    const [confirmacionesCerradas, setConfirmacionesCerradas] = useState(false)

    const userTimezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone

    /* 🔹 Cargar fecha límite */
    useEffect(() => {
        const loadConfig = async () => {
            const { data } = await supabase
                .from('configuracion')
                .select('fecha_limite_confirmacion, timezone_evento')
                .single()

            if (!data?.fecha_limite_confirmacion) return

            const limite = new Date(data.fecha_limite_confirmacion)

            setFechaLimiteUTC(limite)
            setTimezoneEvento(data.timezone_evento || 'America/Bogota')

            if (new Date() > limite) {
                setConfirmacionesCerradas(true)
            }
        }

        loadConfig()
    }, [])

    const toggleInvitado = (nombre: string) => {
        if (confirmadoLocal || confirmacionesCerradas) return

        setSeleccionados((prev) =>
            prev.includes(nombre)
                ? prev.filter((n) => n !== nombre)
                : [...prev, nombre]
        )
    }

    const confirmar = async () => {
        if (confirmacionesCerradas) return

        setError(null)

        let invitadosFinales = seleccionados

        if (familia.invitados_posibles.length === 1) {
            invitadosFinales = familia.invitados_posibles
        }

        if (invitadosFinales.length === 0) {
            setError('Por favor selecciona al menos una persona 💐')
            return
        }

        setGuardando(true)

        const { error } = await supabase
            .from('familias')
            .update({
                invitados_confirmados: invitadosFinales,
                cantidad_invitados: invitadosFinales.length,
                confirmado: true,
                fecha_confirmacion: new Date().toISOString(),
            })
            .eq('id', familia.id)

        setGuardando(false)

        if (error) {
            setError('Ocurrió un error al confirmar. Intenta nuevamente.')
            return
        }

        setConfirmadoLocal(true)
    }

    const formatDate = (date: Date, timeZone: string) =>
        date.toLocaleString('es-CO', {
            timeZone,
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })

    const mismaZona = userTimezone === timezoneEvento

    return (
        <section className="py-20 px-6">
            <div
                className="
          relative mx-auto bg-white border border-[#b08b5a]
          rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          max-w-md md:max-w-4xl
          md:grid md:grid-cols-[260px_1fr]
        "
            >
                {/* ✂️ Cortes */}
                {/* Mobile */}
                <span className="md:hidden absolute -left-3 top-1/2 w-6 h-6 bg-[#f7f3ee] rounded-full" />
                <span className="md:hidden absolute -right-3 top-1/2 w-6 h-6 bg-[#f7f3ee] rounded-full" />

                {/* Desktop */}
                <span className="hidden md:block absolute left-1/2 -top-3 w-6 h-6 bg-[#f7f3ee] rounded-full" />
                <span className="hidden md:block absolute left-1/2 -bottom-3 w-6 h-6 bg-[#f7f3ee] rounded-full" />

                {/* 🟥 LADO IZQUIERDO */}
                <div
                    className="
            p-8 text-center bg-[#f99285] text-[#f7f3ee]
            rounded-t-2xl
            md:rounded-t-none md:rounded-l-2xl
          "
                >
                    <p className="text-xs tracking-[0.3em] opacity-90 mb-2 uppercase">
                        Vuelo de boda
                    </p>

                    <h2 className="text-2xl font-serif mb-4 font-bentinck">
                        Confirmación
                    </h2>

                    {fechaLimiteUTC && !confirmacionesCerradas && (
                        <div className="text-sm space-y-1 opacity-95">
                            <p className="font-semibold">
                                {formatDate(fechaLimiteUTC, timezoneEvento)}
                            </p>

                            {!mismaZona && (
                                <p className="text-xs opacity-80">
                                    En tu zona horaria:
                                    <br />
                                    {formatDate(fechaLimiteUTC, userTimezone)}
                                </p>
                            )}
                        </div>
                    )}

                    {confirmacionesCerradas && (
                        <p className="mt-4 font-semibold text-sm">
                            ⛔ Confirmación cerrada
                        </p>
                    )}
                </div>

                {/* 🤍 LADO DERECHO */}
                <div className="relative p-8 overflow-hidden md:rounded-r-2xl">

                    {/* Fondo avión */}
                    <div
                        className="
                        absolute inset-6
                        bg-[url('/images/avionBg.png')]
                        bg-center bg-no-repeat bg-contain
                        opacity-20
                        pointer-events-none
                        "
                    />

                    <div className="relative z-10">

                        {/* GRID solo en desktop */}
                        <div className="md:grid md:grid-cols-[1fr_120px] md:gap-6">

                            {/* 🧾 CONTENIDO */}
                            <div>
                                {!confirmacionesCerradas && (
                                    <>
                                        <p className="mb-6 text-xs tracking-[0.3em] uppercase text-[#8b6a4a] font-semibold">
                                            Pasajeros
                                        </p>

                                        {familia.invitados_posibles.map((nombre) => (
                                            <label
                                                key={nombre}
                                                className="
                flex items-center gap-4 mb-4
                rounded-lg px-3 py-2
                border border-[#e6d8c7]
                hover:bg-[#faf7f2]
                transition
                text-[#5c4632]
              "
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={seleccionados.includes(nombre)}
                                                    onChange={() => toggleInvitado(nombre)}
                                                    disabled={confirmadoLocal}
                                                    className="accent-[#5c4632] scale-110"
                                                />
                                                <span className="font-serif text-base tracking-wide">
                                                    {nombre}
                                                </span>
                                            </label>
                                        ))}

                                        <div className="my-6 border-t border-dashed border-[#d8c4aa]" />
                                    </>
                                )}

                                {!confirmadoLocal && !confirmacionesCerradas && (
                                    <button
                                        onClick={confirmar}
                                        disabled={guardando}
                                        className="
            mt-6 w-full bg-[#5c4632]
            hover:bg-[#4a3829]
            transition
            text-white py-3
            tracking-[0.25em]
            text-xs rounded-lg
          "
                                    >
                                        {guardando ? 'CONFIRMANDO…' : 'CONFIRMAR ASISTENCIA'}
                                    </button>
                                )}

                                {/* 📱 CODEBAR HORIZONTAL (MOBILE) */}
                                <img
                                    src="/images/codebar2.png"
                                    alt="Código de barras"
                                    className="
    mt-6
    w-full
    md:hidden
    opacity-80
    object-contain
  "
                                />




                                {error && (
                                    <p className="mt-4 text-rose-600 text-center font-medium">
                                        {error}
                                    </p>
                                )}

                                {confirmadoLocal && (
                                    <p className="mt-6 text-green-700 font-semibold text-center tracking-wider">
                                        ✔ ASISTENCIA CONFIRMADA
                                    </p>
                                )}
                            </div>

                            {/* 🖥️ CODEBAR VERTICAL (DESKTOP) */}
                            <div className="hidden md:flex items-start justify-center">
                                <img
                                    src="/images/codebar.png"
                                    alt="Código de barras"
                                    className="
          h-[260px]
          opacity-80
        "
                                />
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}
