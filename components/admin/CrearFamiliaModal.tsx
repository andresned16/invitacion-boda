'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Copy, Share2, Check } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  onCreate: (nombre: string, invitados: string[]) => Promise<string | null>
}

const MAX_INVITADOS = 10

export default function CrearFamiliaModal({
  open,
  onClose,
  onCreate,
}: Props) {

  const [nombre, setNombre] = useState('')
  const [invitados, setInvitados] = useState<string[]>([''])
  const [creating, setCreating] = useState(false)
  const [newUrl, setNewUrl] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [compartido, setCompartido] = useState(false)

  const reset = () => {
    setNombre('')
    setInvitados([''])
    setNewUrl(null)
    setCopiado(false)
    setCompartido(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const updateInvitado = (index: number, value: string) => {
    setInvitados((prev) =>
      prev.map((v, i) => (i === index ? value : v))
    )
  }

  const addInvitado = () => {
    if (invitados.length >= MAX_INVITADOS) return
    setInvitados((prev) => [...prev, ''])
  }

  const removeInvitado = (index: number) => {
    setInvitados((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCreate = async () => {
    if (!nombre.trim()) return

    const invitadosLimpios = invitados
      .map(i => i.trim())
      .filter(Boolean)

    if (invitadosLimpios.length === 0) return

    setCreating(true)

    const url = await onCreate(nombre, invitadosLimpios)

    if (url) {
      setNewUrl(url)
    }

    setCreating(false)
  }

  const invitadosLimpios = invitados
    .map(i => i.trim())
    .filter(Boolean)

  const cantidadInvitados = invitadosLimpios.length
  const esIndividual = cantidadInvitados === 1


  const mensajeCompartir = newUrl
    ? `💍✨ ${nombre},

${esIndividual ? 'Queremos invitarte' : 'Los queremos invitar'} a celebrar nuestro gran día.

Confirma ${esIndividual ? 'tu' : 'su'} asistencia aquí 👇
${newUrl}`
    : ''


  return (
    <Modal open={open} onClose={handleClose}>
      <div className="p-6">

        <h2 className="text-xl font-bold mb-4">
          ➕ Agregar familia
        </h2>

        <label className="block mb-3">
          <span className="text-sm font-medium">
            Nombre de la familia
          </span>
          <input
            className="w-full border p-2 rounded mt-1"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>

        <div className="mb-4">
          <span className="text-sm font-medium">Invitados</span>

          <div className="space-y-2 mt-2">
            {invitados.map((inv, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 border p-2 rounded"
                  value={inv}
                  onChange={(e) =>
                    updateInvitado(i, e.target.value)
                  }
                />

                {invitados.length > 1 && (
                  <button
                    onClick={() => removeInvitado(i)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addInvitado}
            disabled={invitados.length >= MAX_INVITADOS}
            className="mt-2 text-sm underline text-blue-600 disabled:text-gray-400"
          >
            + Agregar invitado
          </button>
        </div>

        {newUrl && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm space-y-2">

            <div className="flex justify-between items-center gap-3">
              <span className="truncate">{newUrl}</span>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(newUrl)
                    setCopiado(true)
                    setTimeout(() => setCopiado(false), 2000)
                  }}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Copy size={16} />
                </button>

                <button
                  onClick={async () => {
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: 'Invitación a nuestra boda',
                          text: mensajeCompartir,
                        })
                        setCompartido(true)
                        setTimeout(() => setCompartido(false), 2000)
                      } else {
                        navigator.clipboard.writeText(mensajeCompartir)
                        setCopiado(true)
                        setTimeout(() => setCopiado(false), 2000)
                      }
                    } catch { }
                  }}
                  className="text-gray-500 hover:text-green-600"
                >
                  <Share2 size={16} />
                </button>

              </div>
            </div>

            {copiado && (
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <Check size={14} />
                ¡Copiado!
              </div>
            )}

            {compartido && (
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <Check size={14} />
                ¡Compartido!
              </div>
            )}

          </div>
        )}

        <div className="flex justify-between gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={creating}
          >
            {creating ? 'Creando…' : 'Crear familia'}
          </button>
        </div>

      </div>
    </Modal>
  )
}
