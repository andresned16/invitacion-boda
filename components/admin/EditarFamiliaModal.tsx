'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Copy, Check, Share2 } from "lucide-react"

type FamiliaAdmin = {
    id: string
    nombre_familia: string
    slug_familia: string
    invitados_posibles: string[]
    invitados_confirmados: string[] | null
    cantidad_invitados: number
    confirmado: boolean
    created_at: string
}

type Props = {
    familia: FamiliaAdmin | null
    open: boolean
    onClose: () => void
    onSave: (id: string, invitados: string[]) => Promise<void>
}

export default function EditarFamiliaModal({
    familia,
    open,
    onClose,
    onSave,
}: Props) {

    const [seleccionados, setSeleccionados] = useState<string[]>(
        familia?.invitados_confirmados ?? []
    )

    const [saving, setSaving] = useState(false)
    const [copiado, setCopiado] = useState(false)
    const [compartido, setCompartido] = useState(false)


    if (!familia) return null

    const link =
        typeof window !== 'undefined'
            ? `${window.location.origin}/${familia.slug_familia}`
            : ''

    const cantidadInvitados = familia.invitados_posibles.length
    const esIndividual = cantidadInvitados === 1

    const mensajeCompartir = `${link}

💍✨ ${familia.nombre_familia},

${esIndividual ? 'Queremos invitarte' : 'Los queremos invitar'} a celebrar nuestro gran día.

Confirma ${esIndividual ? 'tu' : 'su'} asistencia aquí 👇`

    const toggleInvitado = (nombre: string) => {
        setSeleccionados((prev) =>
            prev.includes(nombre)
                ? prev.filter((n) => n !== nombre)
                : [...prev, nombre]
        )
    }

    const handleSave = async () => {
        setSaving(true)
        await onSave(familia.id, seleccionados)
        setSaving(false)
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className="p-6">

                <h2 className="text-xl font-bold mb-3">
                    Familia {familia.nombre_familia}
                </h2>

                {/* 🔗 URL */}
                <div className="space-y-2 mb-4">

                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm truncate">
                            {link}
                        </span>

                        <div className="flex items-center gap-2">

                            {/* Copiar */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(link)
                                    setCopiado(true)
                                    setTimeout(() => setCopiado(false), 2000)
                                }}
                                className="text-gray-500 hover:text-blue-600 transition"
                                title="Copiar enlace"
                            >
                                <Copy size={18} />
                            </button>

                            {/* Compartir */}
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
                                    } catch {
                                        // cancelado por usuario
                                    }
                                }}
                                className="text-gray-500 hover:text-green-600 transition"
                                title="Compartir invitación"
                            >
                                <Share2 size={16} />
                            </button>

                        </div>
                    </div>

                    {copiado && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Check size={14} />
                            <span>¡Enlace copiado!</span>
                        </div>
                    )}

                    {compartido && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Check size={14} />
                            <span>¡Invitación compartida!</span>
                        </div>
                    )}

                </div>

                {/* Info */}
                <p className="mb-2">
                    <strong>Cupos:</strong> {familia.invitados_posibles.length}
                </p>

                <p className="mb-4">
                    <strong>Confirmados:</strong> {seleccionados.length}
                </p>

                {/* Invitados */}
                <div className="mb-6">
                    <strong>Invitados:</strong>

                    <div className="mt-2 space-y-2">
                        {familia.invitados_posibles.map((nombre) => (
                            <label key={nombre} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={seleccionados.includes(nombre)}
                                    onChange={() => toggleInvitado(nombre)}
                                />
                                {nombre}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex justify-between gap-3">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-[#d8cfc6] rounded-lg hover:bg-[#f3eae2] transition"
                        disabled={saving}
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#5C4632] text-white rounded-lg hover:opacity-90 transition"
                        disabled={saving}
                    >
                        {saving ? 'Guardando…' : 'Guardar cambios'}
                    </button>

                </div>

            </div>
        </Modal>
    )
}
