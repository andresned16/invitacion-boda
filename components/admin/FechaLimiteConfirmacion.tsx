'use client'

const CONFIG_ID = '115026b7-0617-479d-8518-be50386e212b'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

/* =========================
   ZONAS HORARIAS DISPONIBLES
========================= */
const TIMEZONES = [
  { value: 'America/Bogota', label: '🇨🇴 Colombia (Bogotá)' },
  { value: 'America/Mexico_City', label: '🇲🇽 México (CDMX)' },
  { value: 'America/Lima', label: '🇵🇪 Perú (Lima)' },
  { value: 'America/Santiago', label: '🇨🇱 Chile (Santiago)' },
  { value: 'America/Argentina/Buenos_Aires', label: '🇦🇷 Argentina (Buenos Aires)' },
  { value: 'America/Sao_Paulo', label: '🇧🇷 Brasil (São Paulo)' },
  { value: 'America/La_Paz', label: '🇧🇴 Bolivia (La Paz)' },
  { value: 'America/Caracas', label: '🇻🇪 Venezuela (Caracas)' },
  { value: 'America/Panama', label: '🇵🇦 Panamá' },
  { value: 'America/Costa_Rica', label: '🇨🇷 Costa Rica' },
  { value: 'America/Guatemala', label: '🇬🇹 Guatemala' },
  { value: 'America/El_Salvador', label: '🇸🇻 El Salvador' },
  { value: 'America/Havana', label: '🇨🇺 Cuba' },
  { value: 'America/New_York', label: '🇺🇸 USA (Eastern Time)' },
  { value: 'America/Chicago', label: '🇺🇸 USA (Central Time)' },
  { value: 'America/Denver', label: '🇺🇸 USA (Mountain Time)' },
  { value: 'America/Los_Angeles', label: '🇺🇸 USA (Pacific Time)' },
  { value: 'America/Toronto', label: '🇨🇦 Canadá (Toronto)' },
  { value: 'America/Vancouver', label: '🇨🇦 Canadá (Vancouver)' },
  { value: 'Europe/Madrid', label: '🇪🇸 España (Madrid)' },
  { value: 'Europe/Paris', label: '🇫🇷 Francia (París)' },
  { value: 'Europe/London', label: '🇬🇧 Reino Unido (Londres)' },
  { value: 'Europe/Rome', label: '🇮🇹 Italia (Roma)' },
  { value: 'Europe/Berlin', label: '🇩🇪 Alemania (Berlín)' },
  { value: 'Europe/Amsterdam', label: '🇳🇱 Países Bajos (Ámsterdam)' },
  { value: 'Europe/Zurich', label: '🇨🇭 Suiza (Zúrich)' },
  { value: 'Europe/Lisbon', label: '🇵🇹 Portugal (Lisboa)' },
  { value: 'Africa/Cairo', label: '🇪🇬 Egipto (El Cairo)' },
  { value: 'Africa/Johannesburg', label: '🇿🇦 Sudáfrica (Johannesburgo)' },
  { value: 'Asia/Tokyo', label: '🇯🇵 Japón (Tokio)' },
  { value: 'Asia/Seoul', label: '🇰🇷 Corea del Sur (Seúl)' },
  { value: 'Asia/Shanghai', label: '🇨🇳 China (Shanghái)' },
  { value: 'Asia/Hong_Kong', label: '🇭🇰 Hong Kong' },
  { value: 'Asia/Singapore', label: '🇸🇬 Singapur' },
  { value: 'Asia/Bangkok', label: '🇹🇭 Tailandia (Bangkok)' },
  { value: 'Asia/Dubai', label: '🇦🇪 Emiratos Árabes (Dubái)' },
  { value: 'Asia/Kolkata', label: '🇮🇳 India (Nueva Delhi)' },
  { value: 'Australia/Sydney', label: '🇦🇺 Australia (Sídney)' },
  { value: 'Australia/Melbourne', label: '🇦🇺 Australia (Melbourne)' },
  { value: 'Pacific/Auckland', label: '🇳🇿 Nueva Zelanda (Auckland)' },
]

/* =========================
   UTILIDAD GMT
========================= */
function getGMTOffset(timezone: string) {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
  }).formatToParts(now)

  return parts.find((p) => p.type === 'timeZoneName')?.value || ''
}

/* =========================
   COMPONENTE
========================= */
export default function FechaLimiteConfirmacion() {
  const [fecha, setFecha] = useState('')
  const [timezone, setTimezone] = useState('America/Bogota')
  const [loading, setLoading] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [popup, setPopup] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  /* 🔔 Autocierre del popup */
  useEffect(() => {
    if (!popup) return
    const timer = setTimeout(() => setPopup(null), 3000)
    return () => clearTimeout(timer)
  }, [popup])

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data } = await supabase
        .from('configuracion')
        .select('fecha_limite_confirmacion, timezone_evento')
        .eq('id', CONFIG_ID)
        .single()

      if (data) {
        setFecha(data.fecha_limite_confirmacion.slice(0, 16))
        setTimezone(data.timezone_evento || 'America/Bogota')
      }

      setLoading(false)
    }

    load()
  }, [])

  const guardar = async () => {
    setGuardando(true)

    const { error } = await supabase
      .from('configuracion')
      .update({
        fecha_limite_confirmacion: new Date(fecha).toISOString(),
        timezone_evento: timezone,
      })
      .eq('id', CONFIG_ID)

    setGuardando(false)

    if (error) {
      console.error(error)
      setPopup({
        type: 'error',
        message: 'Hubo un error al guardar la configuración',
      })
    } else {
      setPopup({
        type: 'success',
        message: 'Configuración actualizada correctamente 💍',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center bg-[#fdfaf6] rounded-xl border border-[#e8dfd6]">
        <p className="text-[#7a5c3e] font-bentinck tracking-wide">
          Cargando configuración...
        </p>
      </div>
    )
  }

  return (
    <>
      {/* 🔔 POPUP */}
      {popup && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`
              flex items-center gap-3
              px-6 py-3
              rounded-xl
              shadow-xl
              border
              backdrop-blur-sm
              font-bentinck
              transition-all duration-300
              ${
                popup.type === 'success'
                  ? 'bg-[#fdfaf6] border-[#b89b7a] text-[#5C4632]'
                  : 'bg-[#fff5f5] border-red-300 text-red-700'
              }
            `}
          >
            {popup.type === 'success' ? '💍' : '⚠️'}
            <span className="text-sm tracking-wide">
              {popup.message}
            </span>
          </div>
        </div>
      )}

      <div className="bg-[#fdfaf6] border border-[#e8dfd6] rounded-2xl p-8 mb-10 shadow-sm">

        <h2 className="text-2xl font-bentinck text-[#7a5c3e] text-center mb-8">
          Fecha límite de confirmación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          <label className="flex flex-col gap-2 w-full font-bentinck">
            <span className="text-sm text-[#a38b75] text-center md:text-left tracking-wide">
              Fecha y hora límite
            </span>

            <input
              type="datetime-local"
              className="w-full border border-[#d6c3b3] bg-white px-4 py-2.5 rounded-lg text-[#5C4632] focus:outline-none focus:ring-2 focus:ring-[#b89b7a] transition"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2 w-full font-bentinck">
            <span className="text-sm text-[#a38b75] text-center md:text-left tracking-wide">
              Zona horaria del evento
            </span>

            <select
              className="w-full border border-[#d6c3b3] bg-white px-4 py-2.5 rounded-lg text-[#5C4632] focus:outline-none focus:ring-2 focus:ring-[#b89b7a] transition"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} — {getGMTOffset(tz.value)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={guardar}
            disabled={guardando}
            className="px-8 py-3 bg-[#5C4632] text-white rounded-xl font-medium tracking-wide hover:opacity-90 transition disabled:opacity-50"
          >
            {guardando ? 'Guardando…' : 'Guardar configuración'}
          </button>
        </div>

      </div>
    </>
  )
}
