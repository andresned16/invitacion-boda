'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Copy, Check, Share2, Trash2, Plus, ClipboardCopy } from "lucide-react"

type FamiliaAdmin = {
    id: string
    nombre_familia: string
    slug_familia: string
    invitados_posibles: string[]
    invitados_confirmados: string[] | null
    cantidad_invitados: number
    confirmado: boolean
    created_at: string
    comments: string | null
}

type Props = {
    familia: FamiliaAdmin | null
    open: boolean
    onClose: () => void
    onSave: (
        id: string,
        nombreFamilia: string,
        invitadosPosibles: string[],
        invitadosConfirmados: string[],
        comments: string
    ) => Promise<void>
}

export default function EditarFamiliaModal({
    familia,
    open,
    onClose,
    onSave,
}: Props) {

    const [nombreFamilia, setNombreFamilia] = useState('')
    const [invitadosEditables, setInvitadosEditables] = useState<string[]>([])
    const [seleccionados, setSeleccionados] = useState<string[]>([])
    const [comentario, setComentario] = useState<string>('')

    const [saving, setSaving] = useState(false)
    const [copiado, setCopiado] = useState(false)
    const [copiadoMensaje, setCopiadoMensaje] = useState(false)
    const [compartido, setCompartido] = useState(false)

    useEffect(() => {
        if (!familia) return

        setNombreFamilia(familia.nombre_familia)
        setInvitadosEditables(familia.invitados_posibles)
        setSeleccionados(familia.invitados_confirmados ?? [])
        setComentario(familia.comments ?? '')
    }, [familia])

    if (!familia) return null

    const link =
        typeof window !== 'undefined'
            ? `${window.location.origin}/${familia.slug_familia}`
            : ''

    const cantidadInvitados = invitadosEditables
        .map(i => i.trim())
        .filter(Boolean).length

    const esIndividual = cantidadInvitados === 1

    const mensajeCompartir = `💍✨ ${nombreFamilia},

Con muchísima ilusión en nuestros corazones queremos compartir ${esIndividual ? 'contigo' : 'con ustedes'
        } la fecha de nuestro matrimonio.

En el enlace que ${esIndividual ? 'te enviamos' : 'les enviamos'
        } encontrarán la invitación, donde también están todos los detalles de este día tan especial y, al final, los botones para confirmar ${esIndividual ? 'tu' : 'su'
        } asistencia.

Si por alguna razón no ${esIndividual ? 'puedes acompañarnos' : 'pueden acompañarnos'
        }, ${esIndividual ? 'te agradecemos avisarnos' : 'les agradecemos avisarnos'
        } con tiempo y por este medio. Aun así, esperamos de corazón que puedan hacer lo posible por estar, ya que sería muy especial para nosotros compartir este momento con ${esIndividual ? 'contigo' : 'ustedes'
        }.

Cualquier inquietud, no duden en escribirnos.

${link}`

    const toggleInvitado = (nombre: string) => {
        setSeleccionados((prev) =>
            prev.includes(nombre)
                ? prev.filter((n) => n !== nombre)
                : [...prev, nombre]
        )
    }

    const updateNombreInvitado = (index: number, value: string) => {
        setInvitadosEditables(prev => {
            const copia = [...prev]
            const nombreAnterior = copia[index]
            copia[index] = value

            setSeleccionados(prevSel =>
                prevSel.map(n =>
                    n === nombreAnterior ? value : n
                )
            )

            return copia
        })
    }


    const eliminarInvitado = (index: number) => {
        const nombreEliminado = invitadosEditables[index]

        setInvitadosEditables(prev =>
            prev.filter((_, i) => i !== index)
        )

        setSeleccionados(prev =>
            prev.filter(n => n !== nombreEliminado)
        )
    }

    const agregarInvitado = () => {
        setInvitadosEditables(prev => [...prev, ''])
    }

    const handleSave = async () => {
        try {
            setSaving(true)

            await onSave(
                familia.id,
                nombreFamilia,
                invitadosEditables,
                seleccionados,
                comentario
            )

            onClose()
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className="p-6 space-y-6">

                {/* 🔹 Nombre Familia */}
                <div>
                    <label className="block font-semibold mb-2">
                        Nombre de la familia
                    </label>

                    <input
                        type="text"
                        value={nombreFamilia}
                        onChange={(e) => setNombreFamilia(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#5C4632]"
                    />
                </div>

                {/* 🔹 Link + Acciones */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center gap-2">
                        <span className="text-sm truncate">
                            {link}
                        </span>

                        <div className="flex gap-2">

                            {/* Copiar link */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(link)
                                    setCopiado(true)
                                    setTimeout(() => setCopiado(false), 2000)
                                }}
                                className="text-gray-500 hover:text-blue-600"
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
                                            setCopiadoMensaje(true)
                                            setTimeout(() => setCopiadoMensaje(false), 2000)
                                        }
                                    } catch { }
                                }}
                                className="text-gray-500 hover:text-green-600"
                            >
                                <Share2 size={18} />
                            </button>

                            {/* Copiar invitación completa */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(mensajeCompartir)
                                    setCopiadoMensaje(true)
                                    setTimeout(() => setCopiadoMensaje(false), 2000)
                                }}
                                className="text-gray-500 hover:text-purple-600"
                                title="Copiar invitación completa"
                            >
                                <ClipboardCopy size={18} />
                            </button>

                        </div>
                    </div>

                    {copiado && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <Check size={14} />
                            ¡Enlace copiado!
                        </div>
                    )}

                    {copiadoMensaje && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <Check size={14} />
                            Invitación copiada
                        </div>
                    )}

                    {compartido && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <Check size={14} />
                            ¡Compartido!
                        </div>
                    )}
                </div>

                {/* 🔹 Invitados Editables */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <strong>Integrantes</strong>

                        <button
                            onClick={agregarInvitado}
                            className="text-sm flex items-center gap-1 text-blue-600"
                        >
                            <Plus size={16} />
                            Agregar
                        </button>
                    </div>

                    <div className="space-y-3">
                        {invitadosEditables.map((nombre, index) => (
                            <div key={index} className="flex items-center gap-2">

                                <input
                                    type="checkbox"
                                    checked={seleccionados.includes(nombre)}
                                    onChange={() => toggleInvitado(nombre)}
                                />

                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) =>
                                        updateNombreInvitado(index, e.target.value)
                                    }
                                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                                />

                                <button
                                    onClick={() => eliminarInvitado(index)}
                                    className="text-red-500"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🔹 Comentario */}
                <div>
                    <label className="block font-semibold mb-2">
                        Comentario interno
                    </label>

                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        maxLength={255}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    />

                    <div className="text-right text-xs text-gray-500 mt-1">
                        {comentario.length}/255
                    </div>
                </div>

                {/* 🔹 Botones */}
                <div className="flex justify-between gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                        disabled={saving}
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#5C4632] text-white rounded-lg"
                        disabled={saving}
                    >
                        {saving ? 'Guardando…' : 'Guardar cambios'}
                    </button>
                </div>

            </div>
        </Modal>
    )
}
