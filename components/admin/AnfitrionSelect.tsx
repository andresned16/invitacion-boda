'use client'

type Props = {
  value: string
  onChange: (value: string) => void
}

const ANFITRIONES = [
  { label: 'Andrés', value: 'andres' },
  { label: 'Karen', value: 'karen' },
]

export default function AnfitrionSelect({ value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        Invitado de
      </label>

      <select
        className="w-full border p-2 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Seleccionar...</option>

        {ANFITRIONES.map((a) => (
          <option key={a.value} value={a.value}>
            {a.label}
          </option>
        ))}
      </select>
    </div>
  )
}
