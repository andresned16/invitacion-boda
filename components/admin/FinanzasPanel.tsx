'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
    obtenerFinanzas,
    crearFinanza,
    actualizarFinanza,
    eliminarFinanza
} from '@/services/finanzas'

type FilaFinanza = {
    id: string
    concepto: string
    presupuesto: number
    pagado: number
}

export default function FinanzasPanel() {
    const [filas, setFilas] = useState<FilaFinanza[]>([])
    const [loading, setLoading] = useState(true)

    // -----------------------------
    // Cargar desde Supabase
    // -----------------------------

    useEffect(() => {
        const load = async () => {
            const data = await obtenerFinanzas()
            setFilas(data)
            setLoading(false)
        }

        load()
    }, [])

    // -----------------------------
    // Cálculos
    // -----------------------------

    const totalPresupuesto = useMemo(
        () => filas.reduce((acc, f) => acc + f.presupuesto, 0),
        [filas]
    )

    const totalPagado = useMemo(
        () => filas.reduce((acc, f) => acc + f.pagado, 0),
        [filas]
    )

    const totalPendiente = totalPresupuesto - totalPagado

    // -----------------------------
    // Handlers
    // -----------------------------

    const actualizarFila = async (
        id: string,
        campo: keyof Omit<FilaFinanza, 'id'>,
        valor: string
    ) => {
        const nuevoValor =
            campo === 'concepto'
                ? valor
                : Number(valor.replace(/[^0-9]/g, '')) || 0

        setFilas(prev =>
            prev.map(f =>
                f.id === id ? { ...f, [campo]: nuevoValor } : f
            )
        )

        const filaActual = filas.find(f => f.id === id)
        if (!filaActual) return

        await actualizarFinanza(
            id,
            campo === 'concepto' ? valor : filaActual.concepto,
            campo === 'presupuesto'
                ? nuevoValor as number
                : filaActual.presupuesto,
            campo === 'pagado'
                ? nuevoValor as number
                : filaActual.pagado
        )
    }

    const agregarFila = async () => {
        await crearFinanza('', 0, 0)
        const data = await obtenerFinanzas()
        setFilas(data)
    }

    const eliminarFilaHandler = async (id: string) => {
        await eliminarFinanza(id)
        setFilas(prev => prev.filter(f => f.id !== id))
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value)
    }

    if (loading) {
        return (
            <div className="mt-12 text-center text-[#5C4632]">
                Cargando finanzas...
            </div>
        )
    }

    return (
        <div className="mt-12 bg-[#fffaf6] p-6 rounded-2xl shadow-md border border-[#e8dfd6]">
            <h2 className="text-xl font-bold text-[#5C4632] mb-6 font-bentinck">
                Panel Financiero
            </h2>

            {/* Métricas */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <MetricCard titulo="Presupuesto Total" valor={formatCurrency(totalPresupuesto)} />
                <MetricCard titulo="Total Pagado" valor={formatCurrency(totalPagado)} />
                <MetricCard titulo="Pendiente" valor={formatCurrency(totalPendiente)} destaque />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[#f4eee8] text-[#5C4632]">
                        <tr>
                            <th className="p-3 text-left">Concepto</th>
                            <th className="p-3 text-left">Presupuesto</th>
                            <th className="p-3 text-left">Pagado</th>
                            <th className="p-3 text-left">Pendiente</th>
                            <th className="p-3 w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map(fila => {
                            const pendiente = fila.presupuesto - fila.pagado

                            return (
                                <tr key={fila.id} className="border-t border-[#eee]">
                                    <td className="p-2">
                                        <input
                                            value={fila.concepto}
                                            onChange={e =>
                                                setFilas(prev =>
                                                    prev.map(f =>
                                                        f.id === fila.id
                                                            ? { ...f, concepto: e.target.value }
                                                            : f
                                                    )
                                                )
                                            }
                                            onBlur={e =>
                                                actualizarFinanza(
                                                    fila.id,
                                                    e.target.value,
                                                    fila.presupuesto,
                                                    fila.pagado
                                                )
                                            }
                                            className="w-full bg-transparent border-b border-[#ddd] focus:outline-none"
                                        />

                                    </td>

                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={fila.presupuesto || ''}
                                            onChange={e => {
                                                const numero =
                                                    Number(e.target.value.replace(/[^0-9]/g, '')) || 0

                                                setFilas(prev =>
                                                    prev.map(f =>
                                                        f.id === fila.id
                                                            ? { ...f, presupuesto: numero }
                                                            : f
                                                    )
                                                )
                                            }}
                                            onBlur={e => {
                                                const numero =
                                                    Number(e.target.value.replace(/[^0-9]/g, '')) || 0

                                                actualizarFinanza(
                                                    fila.id,
                                                    fila.concepto,
                                                    numero,
                                                    fila.pagado
                                                )
                                            }}
                                            className="w-full bg-transparent border-b border-[#ddd] focus:outline-none"
                                        />

                                    </td>

                                    <td className="p-2">
                                        <input
                                            type="text"
                                            value={fila.pagado || ''}
                                            onChange={e => {
                                                const numero =
                                                    Number(e.target.value.replace(/[^0-9]/g, '')) || 0

                                                setFilas(prev =>
                                                    prev.map(f =>
                                                        f.id === fila.id
                                                            ? { ...f, pagado: numero }
                                                            : f
                                                    )
                                                )
                                            }}
                                            onBlur={e => {
                                                const numero =
                                                    Number(e.target.value.replace(/[^0-9]/g, '')) || 0

                                                actualizarFinanza(
                                                    fila.id,
                                                    fila.concepto,
                                                    fila.presupuesto,
                                                    numero
                                                )
                                            }}
                                            className="w-full bg-transparent border-b border-[#ddd] focus:outline-none"
                                        />

                                    </td>

                                    <td className="p-2 font-medium text-[#7a5c3e]">
                                        {formatCurrency(pendiente)}
                                    </td>

                                    <td className="p-2">
                                        <button
                                            onClick={() => eliminarFilaHandler(fila.id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <button
                onClick={agregarFila}
                className="mt-6 flex items-center gap-2 bg-[#5C4632] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
                <Plus size={16} />
                Agregar concepto
            </button>
        </div>
    )
}

function MetricCard({
    titulo,
    valor,
    destaque = false
}: {
    titulo: string
    valor: string
    destaque?: boolean
}) {
    return (
        <div
            className={`p-4 rounded-xl border ${destaque
                ? 'bg-[#5C4632] text-white'
                : 'bg-white border-[#e8dfd6] text-[#5C4632]'
                }`}
        >
            <p className="text-xs uppercase tracking-wide opacity-70">
                {titulo}
            </p>
            <p className="text-lg font-bold mt-1">{valor}</p>
        </div>
    )
}
