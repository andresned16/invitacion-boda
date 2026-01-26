'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/ui/Modal'
import Decoracion from '@/components/ui/Decoracion';

import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend,
} from 'recharts'




type FamiliaAdmin = {
    id: string
    nombre_familia: string
    slug_familia: string
    invitados_posibles: string[]
    invitados_confirmados: string[] | null
    cantidad_invitados: number
    confirmado: boolean
}




export default function AdminPage() {


    const [seleccionadosAdmin, setSeleccionadosAdmin] = useState<string[]>([])
    const [saving, setSaving] = useState(false)


    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [familias, setFamilias] = useState<FamiliaAdmin[]>([])
    const [loading, setLoading] = useState(false)
    const [familiaActiva, setFamiliaActiva] = useState<FamiliaAdmin | null>(null)

    const [autorizado, setAutorizado] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false
        return sessionStorage.getItem('admin-auth') === 'true'
    })
    const [showAddModal, setShowAddModal] = useState(false)
    const [newNombreFamilia, setNewNombreFamilia] = useState('')
    const [newInvitados, setNewInvitados] = useState<string[]>([''])
    const [creating, setCreating] = useState(false)
    const [newUrl, setNewUrl] = useState<string | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const closeAddModal = () => {
        setShowAddModal(false)
        setNewUrl(null)
        setNewNombreFamilia('')
        setNewInvitados([''])
    }


    // 👨‍👩‍👧 Familias confirmadas
    const familiasConfirmadas = familias.filter(f => f.confirmado).length

    // ⏳ Familias pendientes
    const familiasPendientes = familias.length - familiasConfirmadas


    // ✅ Leer auth SOLO en cliente


    const fetchFamilias = useCallback(async () => {
        const { data } = await supabase
            .from('familias')
            .select(`
                id,
                nombre_familia,
                slug_familia,
                invitados_posibles,
                invitados_confirmados,
                cantidad_invitados,
                confirmado
                `)
            .order('nombre_familia')

        if (!data) return

        setFamilias(data)
    }, [])


    useEffect(() => {
        if (!autorizado) return

        const load = async () => {
            setLoading(true)
            await fetchFamilias()
            setLoading(false)
        }

        load()
    }, [autorizado, fetchFamilias])

    if (autorizado === null) return null

    const refresh = async () => {
        setLoading(true)
        await fetchFamilias()
        setLoading(false)
    }

    const login = () => {
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            sessionStorage.setItem('admin-auth', 'true')
            setAutorizado(true)
            setError('')
        } else {
            setError('Contraseña incorrecta')
        }
    }

    const logout = () => {
        sessionStorage.removeItem('admin-auth')
        setAutorizado(false)
        setPassword('')
    }
    const openModal = (familia: FamiliaAdmin) => {
        setFamiliaActiva(familia)
        setSeleccionadosAdmin(familia.invitados_confirmados ?? [])
    }
    const toggleInvitadoAdmin = (nombre: string) => {
        setSeleccionadosAdmin((prev) =>
            prev.includes(nombre)
                ? prev.filter((n) => n !== nombre)
                : [...prev, nombre]
        )
    }


    const closeModal = () => {
        setFamiliaActiva(null)
    }

    // 🔐 LOGIN
    if (!autorizado) {
        return (
            <Decoracion>
                <main className="min-h-screen flex items-center justify-center p-6">
                    <div className="w-full max-w-sm bg-white p-6 rounded shadow">
                        <h1 className="text-2xl font-bold mb-4 text-center">
                            🔒 Acceso administrador
                        </h1>

                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full border p-2 rounded mb-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <p className="text-red-600 text-sm mb-2 text-center">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={login}
                            className="w-full bg-black text-white py-2 rounded"
                        >
                            Entrar
                        </button>
                    </div>
                </main>
            </Decoracion>
        )
    }

    if (loading) return <p className="p-6">Cargando confirmaciones…</p>

    // 📊 MÉTRICAS


    // 👥 Total personas invitadas
    const totalInvitados = familias.reduce(
        (acc, f) => acc + f.invitados_posibles.length,
        0
    )

    // ✅ Total personas confirmadas
    const totalConfirmados = familias.reduce(
        (acc, f) => acc + (f.cantidad_invitados ?? 0),
        0
    )

    // ⏳ Personas pendientes
    const totalPendientes = totalInvitados - totalConfirmados

    const chartData = [
        { name: 'Confirmados', value: totalConfirmados },
        { name: 'Pendientes', value: totalPendientes },
    ]


    const COLORS = ['#16a34a', '#f59e0b']



    const guardarCambiosAdmin = async () => {
        if (!familiaActiva) return

        setSaving(true)

        const invitadosFinales = seleccionadosAdmin
        const confirmado = invitadosFinales.length > 0

        await supabase
            .from('familias')
            .update({
                invitados_confirmados: invitadosFinales,
                cantidad_invitados: invitadosFinales.length,
                confirmado,
                fecha_confirmacion: confirmado
                    ? new Date().toISOString()
                    : null,
            })
            .eq('id', familiaActiva.id)

        await fetchFamilias()

        setFamiliaActiva(null)
        setSaving(false)
    }



    const deleteFamilia = async (id: string) => {
        const ok = confirm(
            '¿Seguro que deseas borrar esta familia? Esta acción no se puede deshacer.'
        )
        if (!ok) return

        await supabase.from('familias').delete().eq('id', id)
        fetchFamilias()
    }

    const generarSlug = (nombre: string) =>
        nombre
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')


    const generarSlugUnico = async (nombre: string) => {
        const baseSlug = generarSlug(nombre)

        const { data } = await supabase
            .from('familias')
            .select('slug_familia')
            .ilike('slug_familia', `${baseSlug}%`)

        if (!data || data.length === 0) {
            return baseSlug
        }

        const slugsExistentes = data.map(d => d.slug_familia)

        let contador = 2
        let nuevoSlug = `${baseSlug}-${contador}`

        while (slugsExistentes.includes(nuevoSlug)) {
            contador++
            nuevoSlug = `${baseSlug}-${contador}`
        }

        return nuevoSlug
    }



    const updateInvitado = (index: number, value: string) => {
        setNewInvitados((prev) =>
            prev.map((v, i) => (i === index ? value : v))
        )
    }
    const MAX_INVITADOS = 10

    const addInvitado = () => {
        setNewInvitados((prev) => {
            if (prev.length >= MAX_INVITADOS) return prev
            return [...prev, '']
        })
    }


    const removeInvitado = (index: number) => {
        setNewInvitados((prev) => prev.filter((_, i) => i !== index))
    }

    const crearFamilia = async () => {
        if (!newNombreFamilia.trim()) return

        const invitadosLimpios = newInvitados
            .map(i => i.trim())
            .filter(Boolean)

        if (invitadosLimpios.length > MAX_INVITADOS) {
            alert(`Una familia no puede tener más de ${MAX_INVITADOS} invitados`)
            setCreating(false)
            return
        }

        if (invitadosLimpios.length === 0) return

        setCreating(true)

        const slug = await generarSlugUnico(newNombreFamilia)


        const { error } = await supabase.from('familias').insert({
            nombre_familia: newNombreFamilia,
            slug_familia: slug,
            invitados_posibles: invitadosLimpios,
            invitados_confirmados: [],
            cantidad_invitados: 0,
            confirmado: false,
        })

        if (!error) {
            await fetchFamilias()
            setNewUrl(`${window.location.origin}/${slug}`)
            setNewNombreFamilia('')
            setNewInvitados([''])
        }

        setCreating(false)
    }


    return (
        <Decoracion>
            <main className="min-h-screen p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6 gap-4 relative">

                    <h1 className="text-3xl font-bold">
                        📋 Confirmaciones de la boda
                    </h1>

                    {/* 🖥️ BOTONES DESKTOP */}
                    <div className="hidden md:flex gap-3 items-center">
                        <button
                            onClick={refresh}
                            className="text-sm px-3 py-1 border rounded"
                        >
                            🔄 Refrescar
                        </button>

                        <button
                            onClick={() => {
                                setShowAddModal(true)
                                setNewUrl(null)
                            }}
                            className="text-sm px-3 py-1 bg-green-600 text-white rounded"
                        >
                            ➕ Agregar familia
                        </button>

                        <button
                            onClick={logout}
                            className="text-sm text-gray-500 underline"
                        >
                            Cerrar sesión
                        </button>
                    </div>

                    {/* 📱 BOTÓN HAMBURGUESA */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-2xl"
                        aria-label="Abrir menú"
                    >
                        ☰
                    </button>

                    {/* 📱 MENÚ MOBILE */}
                    {menuOpen && (
                        <div className="absolute right-0 top-14 bg-white border rounded shadow w-48 z-50">
                            <button
                                onClick={() => {
                                    refresh()
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                🔄 Refrescar
                            </button>

                            <button
                                onClick={() => {
                                    setShowAddModal(true)
                                    setNewUrl(null)
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                ➕ Agregar familia
                            </button>

                            <button
                                onClick={() => {
                                    logout()
                                    setMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>


                <div className="mb-10 bg-white border rounded p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">

                        {/* 📊 MÉTRICAS */}
                        <div className="w-full md:w-1/2 text-lg space-y-3">
                            <div>
                                Total invitados:{' '}
                                <span className="font-bold text-blue-700">
                                    {totalInvitados}
                                </span>
                            </div>

                            <div>
                                Total asistentes confirmados:{' '}
                                <span className="font-bold text-green-700">
                                    {totalConfirmados}
                                </span>
                            </div>

                            <div>
                                Asistentes pendientes por confirmar:{' '}
                                <span className="font-bold text-yellow-700">
                                    {totalPendientes}
                                </span>
                            </div>

                            <div>
                                Familias confirmadas:{' '}
                                <span className="font-bold text-orange-700">
                                    {familiasConfirmadas}
                                </span>
                            </div>
                        </div>

                        {/* 🥧 GRÁFICA */}
                        <div className="w-full md:w-1/2 h-64">
                            <h2 className="text-lg font-semibold text-center">
                                Estado de confirmaciones
                            </h2>

                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        outerRadius={90}
                                    >
                                        {chartData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                    </div>
                </div>


                {/* Contenedor scrollable */}
                <div className="overflow-x-auto border rounded">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Familia</th>
                                <th className="p-3 text-center">Estado</th>
                                <th className="p-3 text-center">Cupos</th>
                                <th className="p-3 text-center">Confirmados</th>
                                <th className="p-3">Nombres confirmados</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {familias.map((f) => (
                                <tr key={f.id} className="border-t">
                                    <td className="p-3">{f.nombre_familia}</td>
                                    <td className="p-3 text-center">{f.confirmado ? '✅' : '⏳'}</td>
                                    <td className="p-3 text-center">{f.invitados_posibles.length}</td>
                                    <td className="p-3 text-center">{f.invitados_confirmados?.length ?? 0}</td>
                                    <td className="p-3">{f.invitados_confirmados?.join(', ') || '—'}</td>
                                    <td className="p-3 text-center space-x-2">
                                        <button
                                            onClick={() => openModal(f)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => deleteFamilia(f.id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 🔥 AQUÍ VA EL MODAL */}
                <Modal open={!!familiaActiva} onClose={closeModal}>
                    {familiaActiva && (
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-3">
                                Familia {familiaActiva.nombre_familia}
                            </h2>

                            {/* 🔗 URL */}
                            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                                <p className="text-sm font-medium mb-1">
                                    URL de confirmación
                                </p>

                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm truncate">
                                        {`${window.location.origin}/${familiaActiva.slug_familia}`}
                                    </span>

                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                `${window.location.origin}/${familiaActiva.slug_familia}`
                                            )
                                        }
                                        className="text-blue-600 underline text-sm"
                                    >
                                        Copiar
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <p className="mb-2">
                                <strong>Cupos:</strong> {familiaActiva.invitados_posibles.length}
                            </p>

                            <p className="mb-4">
                                <strong>Confirmados:</strong> {seleccionadosAdmin.length}
                            </p>

                            {/* Invitados */}
                            <div className="mb-6">
                                <strong>Invitados:</strong>

                                <div className="mt-2 space-y-2">
                                    {familiaActiva.invitados_posibles.map((nombre) => (
                                        <label key={nombre} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={seleccionadosAdmin.includes(nombre)}
                                                onChange={() => toggleInvitadoAdmin(nombre)}
                                            />
                                            {nombre}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-between gap-3">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 border rounded"
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={guardarCambiosAdmin}
                                    className="px-4 py-2 bg-black text-white rounded"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando…' : 'Guardar cambios'}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                <Modal open={showAddModal} onClose={closeAddModal}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">
                            ➕ Agregar familia
                        </h2>

                        {/* Nombre familia */}
                        <label className="block mb-3">
                            <span className="text-sm font-medium">
                                Nombre de la familia
                            </span>
                            <input
                                className="w-full border p-2 rounded mt-1"
                                value={newNombreFamilia}
                                onChange={(e) => setNewNombreFamilia(e.target.value)}
                            />
                        </label>

                        {/* Invitados */}
                        <div className="mb-4">
                            <span className="text-sm font-medium">Invitados</span>

                            <div className="space-y-2 mt-2">
                                {newInvitados.map((inv, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            className="flex-1 border p-2 rounded"
                                            value={inv}
                                            onChange={(e) =>
                                                updateInvitado(i, e.target.value)
                                            }
                                        />

                                        {newInvitados.length > 1 && (
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
                                disabled={newInvitados.length >= MAX_INVITADOS}
                                className={`mt-2 text-sm underline ${newInvitados.length >= MAX_INVITADOS
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600'
                                    }`}
                            >
                                + Agregar invitado
                            </button>

                            {newInvitados.length >= MAX_INVITADOS && (
                                <p className="text-xs text-red-500 mt-1">
                                    Máximo {MAX_INVITADOS} invitados por familia
                                </p>
                            )}
                        </div>

                        {/* URL generada */}
                        {newUrl && (
                            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
                                <strong>URL:</strong>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="truncate">{newUrl}</span>
                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(newUrl)
                                        }
                                        className="text-blue-600 underline text-xs"
                                    >
                                        Copiar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="flex justify-between gap-3">
                            <button
                                onClick={closeAddModal}
                                className="px-4 py-2 border rounded"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={crearFamilia}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                                disabled={creating}
                            >
                                {creating ? 'Creando…' : 'Crear familia'}
                            </button>
                        </div>
                    </div>
                </Modal>




            </main>
        </Decoracion >
    )

}

