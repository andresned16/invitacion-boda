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

    // 🔹 Cargar fecha + timezone del evento
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
            <div className="relative max-w-md mx-auto bg-[#faf7f2] border-2 border-dashed border-[#b08b5a] p-8">

                {/* 🎫 Cortes */}
                <span className="absolute -left-3 top-1/2 w-6 h-6 bg-[#f7f3ee] rounded-full" />
                <span className="absolute -right-3 top-1/2 w-6 h-6 bg-[#f7f3ee] rounded-full" />

                {/* Header */}
                <div className="text-center mb-4">
                    <p className="text-xs tracking-widest text-[#7a5c3e]">
                        WEDDING FLIGHT
                    </p>
                    <h2 className="text-2xl font-serif text-[#5c4632]">
                        Confirmación de Asistencia
                    </h2>
                </div>

                {/* ⏰ Fecha límite */}
                {fechaLimiteUTC && !confirmacionesCerradas && (
                    <div className="mb-4 text-center text-sm text-[#7a5c3e] space-y-1">
                        <p>
                            ⏰ Confirmación disponible hasta:
                            <br />
                            <strong>
                                {formatDate(fechaLimiteUTC, timezoneEvento)}
                            </strong>{' '}
                            
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
                    <p className="mb-6 text-center text-rose-600 font-semibold">
                        ⛔ El plazo para confirmar asistencia ha finalizado
                    </p>
                )}

                <div className="h-px border-t border-dashed border-[#b08b5a] mb-6" />

                {/* Invitados */}
                {!confirmacionesCerradas && (
                    <>
                        <p className="mb-4 text-sm tracking-wider text-[#7a5c3e]">
                            PASSENGERS
                        </p>

                        {familia.invitados_posibles.map((nombre) => (
                            <label
                                key={nombre}
                                className="flex items-center gap-3 mb-3 text-[#3b2f24]"
                            >
                                <input
                                    type="checkbox"
                                    checked={seleccionados.includes(nombre)}
                                    onChange={() => toggleInvitado(nombre)}
                                    disabled={confirmadoLocal}
                                />
                                <span className="font-medium">{nombre}</span>
                            </label>
                        ))}
                    </>
                )}

                {/* Botón */}
                {!confirmadoLocal && !confirmacionesCerradas && (
                    <button
                        onClick={confirmar}
                        disabled={guardando}
                        className="mt-6 w-full bg-[#5c4632] text-white py-3 tracking-widest text-sm rounded"
                    >
                        {guardando ? 'CHECKING IN…' : 'CHECK-IN'}
                    </button>
                )}

                {/* Error */}
                {error && (
                    <p className="mt-4 text-rose-600 text-center font-medium">
                        {error}
                    </p>
                )}

                {/* Confirmado */}
                {confirmadoLocal && (
                    <p className="mt-6 text-green-700 font-semibold text-center tracking-wider">
                        ✔ BOARDING CONFIRMED
                    </p>
                )}
            </div>
        </section>
    )
}
