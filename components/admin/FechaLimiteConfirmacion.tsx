'use client'

const CONFIG_ID = '115026b7-0617-479d-8518-be50386e212b'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

/* =========================
   ZONAS HORARIAS DISPONIBLES
   ========================= */
const TIMEZONES = [
  // 🌎 AMÉRICA
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

  // 🇺🇸 USA / CANADÁ
  { value: 'America/New_York', label: '🇺🇸 USA (Eastern Time)' },
  { value: 'America/Chicago', label: '🇺🇸 USA (Central Time)' },
  { value: 'America/Denver', label: '🇺🇸 USA (Mountain Time)' },
  { value: 'America/Los_Angeles', label: '🇺🇸 USA (Pacific Time)' },
  { value: 'America/Toronto', label: '🇨🇦 Canadá (Toronto)' },
  { value: 'America/Vancouver', label: '🇨🇦 Canadá (Vancouver)' },

  // 🌍 EUROPA
  { value: 'Europe/Madrid', label: '🇪🇸 España (Madrid)' },
  { value: 'Europe/Paris', label: '🇫🇷 Francia (París)' },
  { value: 'Europe/London', label: '🇬🇧 Reino Unido (Londres)' },
  { value: 'Europe/Rome', label: '🇮🇹 Italia (Roma)' },
  { value: 'Europe/Berlin', label: '🇩🇪 Alemania (Berlín)' },
  { value: 'Europe/Amsterdam', label: '🇳🇱 Países Bajos (Ámsterdam)' },
  { value: 'Europe/Zurich', label: '🇨🇭 Suiza (Zúrich)' },
  { value: 'Europe/Lisbon', label: '🇵🇹 Portugal (Lisboa)' },

  // 🌍 ÁFRICA
  { value: 'Africa/Cairo', label: '🇪🇬 Egipto (El Cairo)' },
  { value: 'Africa/Johannesburg', label: '🇿🇦 Sudáfrica (Johannesburgo)' },

  // 🌏 ASIA
  { value: 'Asia/Tokyo', label: '🇯🇵 Japón (Tokio)' },
  { value: 'Asia/Seoul', label: '🇰🇷 Corea del Sur (Seúl)' },
  { value: 'Asia/Shanghai', label: '🇨🇳 China (Shanghái)' },
  { value: 'Asia/Hong_Kong', label: '🇭🇰 Hong Kong' },
  { value: 'Asia/Singapore', label: '🇸🇬 Singapur' },
  { value: 'Asia/Bangkok', label: '🇹🇭 Tailandia (Bangkok)' },
  { value: 'Asia/Dubai', label: '🇦🇪 Emiratos Árabes (Dubái)' },
  { value: 'Asia/Kolkata', label: '🇮🇳 India (Nueva Delhi)' },

  // 🌏 OCEANÍA
  { value: 'Australia/Sydney', label: '🇦🇺 Australia (Sídney)' },
  { value: 'Australia/Melbourne', label: '🇦🇺 Australia (Melbourne)' },
  { value: 'Pacific/Auckland', label: '🇳🇿 Nueva Zelanda (Auckland)' },
]

/* =========================
   UTILIDAD PARA GMT
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
      alert('Error al guardar ❌')
    } else {
      alert('Configuración actualizada ✅')
    }
  }

  if (loading) return <p>Cargando configuración…</p>

  return (
    <div className="bg-white border rounded p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Fecha límite de confirmación
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* Fecha */}
        <label className="flex flex-col gap-1 w-full">
          <span className="text-sm font-medium text-center md:text-left">
            Fecha y hora límite
          </span>
          <input
            type="datetime-local"
            className="border p-2 rounded w-full"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </label>

        {/* Zona horaria */}
        <label className="flex flex-col gap-1 w-full">
          <span className="text-sm font-medium text-center md:text-left">
            Zona horaria del evento
          </span>
          <select
            className="border p-2 rounded w-full"
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


      {/* Guardar */}
      <button
        onClick={guardar}
        disabled={guardando}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        {guardando ? 'Guardando…' : 'Guardar'}
      </button>
    </div>
  )

}
