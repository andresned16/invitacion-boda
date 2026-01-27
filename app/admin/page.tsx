'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/ui/Modal'
import Decoracion from '@/components/ui/Decoracion';
import FechaLimiteConfirmacion from '@/components/admin/FechaLimiteConfirmacion'
import { Copy, Check, RefreshCcw, Plus, LogOut, Menu, CheckCircle, Clock, Lock, Share2, XCircle } from "lucide-react";



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
    created_at: string
}



type EstadoFiltro = 'todos' | 'confirmados' | 'pendientes'
type CuposFiltro = 'todos' | 'completo' | 'disponible'
type OrdenFiltro = 'reciente' | 'antiguo' | 'az' | 'za'



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
    const [compartido, setCompartido] = useState(false);

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


    //Buscador y filtros
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>('todos')
    const [cuposFiltro, setCuposFiltro] = useState<CuposFiltro>('todos')
    const [orden, setOrden] = useState<OrdenFiltro>('reciente')
    const resetFiltros = () => {
        setSearch('');
        setEstadoFiltro('todos');
        setCuposFiltro('todos');
        setOrden('reciente');
        setRowsPerPage(10); // o el valor por defecto que uses
    };


    const [copiado, setCopiado] = useState(false);

    const link = familiaActiva
        ? `${window.location.origin}/${familiaActiva.slug_familia}`
        : '';
    const nombreFamilia = familiaActiva?.nombre_familia ?? 'familia';

    const cantidadInvitados =
        familiaActiva?.invitados_posibles.length ?? 1;

    const esIndividual = cantidadInvitados === 1;

    const mensajeCompartir = `${nombreFamilia},

${esIndividual ? 'Queremos invitarte' : 'Los queremos invitar'} a nuestra boda 💍✨

Aquí ${esIndividual ? 'puedes' : 'pueden'} confirmar ${esIndividual ? 'tu' : 'su'
        } asistencia:
${link}`;





    // ✅ Leer auth SOLO en cliente


    const fetchFamilias = useCallback(async () => {
        const { data, error } = await supabase
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
            .returns<FamiliaAdmin[]>() // 👈 CLAVE

        if (error) {
            console.error(error)
            return
        }

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
                <main className="min-h-screen flex items-center justify-cent p-6">
                    <form
                        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm border"
                        onSubmit={(e) => {
                            e.preventDefault();
                            login();
                        }}
                    >
                        {/* Título */}
                        <div className="flex flex-col items-center mb-6 gap-2">
                            <div className="p-3 bg-gray-100 rounded-full">
                                <Lock className="text-gray-700" size={24} />
                            </div>

                            <h1 className="text-2xl font-bold text-center">
                                Acceso administrador
                            </h1>

                            <p className="text-sm text-gray-500 text-center">
                                Introduce la contraseña para continuar
                            </p>
                        </div>

                        {/* Input */}
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="w-full border rounded-lg px-3 py-2 
                           focus:outline-none focus:ring-2 focus:ring-black"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-600 text-sm mb-3 text-center">
                                {error}
                            </p>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2.5 rounded-lg 
                       hover:bg-gray-900 transition font-medium"
                        >
                            Entrar
                        </button>
                    </form>
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

    const familiasFiltradas = familias
        .filter((f) => {
            // 🔍 Buscador
            const texto = search.toLowerCase()
            const coincideTexto =
                f.nombre_familia.toLowerCase().includes(texto) ||
                f.invitados_confirmados?.some((n) => n.toLowerCase().includes(texto)) ||
                f.invitados_posibles.some((n) => n.toLowerCase().includes(texto))

            if (!coincideTexto) return false

            // ✅ Estado
            if (estadoFiltro === 'confirmados' && !f.confirmado) return false
            if (estadoFiltro === 'pendientes' && f.confirmado) return false

            // 🎟️ Cupos
            const confirmados = f.invitados_confirmados?.length ?? 0
            const total = f.invitados_posibles.length

            if (cuposFiltro === 'completo' && confirmados < total) return false
            if (cuposFiltro === 'disponible' && confirmados >= total) return false

            return true
        })
        .sort((a, b) => {
            switch (orden) {
                case 'reciente':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                case 'antiguo':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                case 'az':
                    return a.nombre_familia.localeCompare(b.nombre_familia)
                case 'za':
                    return b.nombre_familia.localeCompare(a.nombre_familia)
                default:
                    return 0
            }
        })

    const totalPages = Math.ceil(familiasFiltradas.length / rowsPerPage)

    const familiasPaginadas = familiasFiltradas.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )
    const hayFiltrosActivos =
        search !== '' ||
        estadoFiltro !== 'todos' ||
        cuposFiltro !== 'todos' ||
        orden !== 'reciente';


    return (
        <Decoracion>
            <main className="min-h-screen p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6 gap-4 relative">

                    <h1 className="text-3xl font-bold">
                        Confirmaciones de la boda
                    </h1>

                    {/* 🖥️ BOTONES DESKTOP */}
                    <div className="hidden md:flex items-center gap-3">

                        {/* Refrescar */}
                        <button
                            onClick={refresh}
                            className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded-lg 
                   hover:bg-gray-50 transition"
                        >
                            <RefreshCcw size={16} />
                            <span>Refrescar</span>
                        </button>

                        {/* Agregar familia */}
                        <button
                            onClick={() => {
                                setShowAddModal(true);
                                setNewUrl(null);
                            }}
                            className="flex items-center gap-2 text-sm px-3 py-1.5 
                   bg-green-600 text-white rounded-lg 
                   hover:bg-green-700 transition"
                        >
                            <Plus size={16} />
                            <span>Agregar familia</span>
                        </button>

                        {/* Cerrar sesión */}
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 text-sm text-gray-500 
                   hover:text-red-600 transition"
                        >
                            <LogOut size={16} />
                            <span>Cerrar sesión</span>
                        </button>
                    </div>


                    {/* 📱 BOTÓN HAMBURGUESA */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg 
               hover:bg-gray-100 transition"
                        aria-label="Abrir menú"
                    >
                        <Menu size={24} />
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
                        <div className="w-full md:w-1/2 h-64 flex flex-col items-center">
                            <h2 className="text-lg font-semibold text-center mb-2">
                                Estado de confirmaciones
                            </h2>

                            {/* Gráfica */}
                            <div className="w-full flex-1">
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
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend personalizado */}
                            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                                {chartData.map((item, index) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index] }}
                                        />
                                        <span className="text-gray-700">
                                            {item.name}
                                            ({item.value})
                                        </span>
                                    </div>
                                ))}
                            </div>

                        </div>


                    </div>
                </div>


                {/* PANEL DE FILTROS */}
                <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">

                        {/* Buscador */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Buscar
                            </label>
                            <input
                                type="text"
                                placeholder="Familia o persona…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Estado
                            </label>
                            <select
                                value={estadoFiltro}
                                onChange={(e) => setEstadoFiltro(e.target.value as EstadoFiltro)}
                                className="w-full border p-2 rounded"
                            >
                                <option value="todos">Todos</option>
                                <option value="confirmados">Confirmados</option>
                                <option value="pendientes">Pendientes</option>
                            </select>
                        </div>

                        {/* Cupos */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Cupos
                            </label>
                            <select
                                value={cuposFiltro}
                                onChange={(e) => setCuposFiltro(e.target.value as CuposFiltro)}
                                className="w-full border p-2 rounded"
                            >
                                <option value="todos">Todos</option>
                                <option value="completo">Completos</option>
                                <option value="disponible">Disponibles</option>
                            </select>
                        </div>

                        {/* Orden */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Ordenar por
                            </label>
                            <select
                                value={orden}
                                onChange={(e) => setOrden(e.target.value as OrdenFiltro)}
                                className="w-full border p-2 rounded"
                            >
                                <option value="reciente">Más recientes</option>
                                <option value="antiguo">Más antiguos</option>
                                <option value="az">Nombre A–Z</option>
                                <option value="za">Nombre Z–A</option>
                            </select>
                        </div>

                        {/* Filas */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Filas
                            </label>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                className="w-full border p-2 rounded"
                            >
                                {[5, 10, 20, 50].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Limpiar filtros */}
                        {hayFiltrosActivos && (
                            <div className="flex justify-end">
                                <button
                                    onClick={resetFiltros}
                                    className="flex items-center gap-1.5 px-2.5 py-1 
                 text-xs text-gray-600 
                 bg-gray-100 hover:bg-red-50 hover:text-red-600
                 rounded-full transition"
                                    title="Limpiar filtros"
                                >
                                    <XCircle size={12} />
                                    Limpiar filtros
                                </button>
                            </div>
                        )}


                    </div>
                </div>

                {/* TABLA */}

                {/* Indicador de scroll (solo móvil) */}
                <div className="md:hidden text-sm text-gray-500 mb-2 flex items-center gap-2">
                    <span>⬅️➡️</span>
                    <span>Desliza horizontalmente para ver más</span>
                </div>

                {/* TABLA */}
                <div className="relative overflow-x-auto border rounded-lg">

                    {/* Degradado derecho (indica más contenido) */}
                    <div className="pointer-events-none absolute top-0 right-0 h-full w-8 
                    bg-gradient-to-l from-white to-transparent md:hidden" />

                    <table className="min-w-[900px] border-collapse">
                        <thead className="bg-gray-100 text-sm">
                            <tr>
                                <th className="p-3 text-center">Familia</th>
                                <th className="p-3 text-center">Estado</th>
                                <th className="p-3 text-center">Cupos</th>
                                <th className="p-3 text-center">Confirmados</th>
                                <th className="p-3 text-center">Nombres confirmados</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {familiasPaginadas.map((f) => (
                                <tr
                                    key={f.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="p-3 font-medium">
                                        {f.nombre_familia}
                                    </td>

                                    <td className="p-3 text-center">
                                        {f.confirmado ? (
                                            <span title="Confirmado">
                                                <CheckCircle
                                                    size={18}
                                                    className="inline text-green-600"
                                                />
                                            </span>
                                        ) : (
                                            <span title="Pendiente">
                                                <Clock
                                                    size={18}
                                                    className="inline text-yellow-500"
                                                />
                                            </span>
                                        )}
                                    </td>




                                    <td className="p-3 text-center">
                                        {f.invitados_posibles.length}
                                    </td>

                                    <td className="p-3 text-center">
                                        {f.invitados_confirmados?.length ?? 0}
                                    </td>

                                    <td className="p-3">
                                        {f.invitados_confirmados?.join(', ') || '—'}
                                    </td>

                                    <td className="p-3 text-center space-x-3">
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


                <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        ◀
                    </button>

                    <span className="text-sm">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        ▶
                    </button>
                </div>

                {/* 🔥 AQUÍ VA EL MODAL */}
                <Modal open={!!familiaActiva} onClose={closeModal}>
                    {familiaActiva && (
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-3">
                                Familia {familiaActiva.nombre_familia}
                            </h2>

                            {/* 🔗 URL */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm truncate">
                                        {link}
                                    </span>

                                    <div className="flex items-center gap-2">

                                        {/* Copiar */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(link);
                                                setCopiado(true);
                                                setTimeout(() => setCopiado(false), 2000);
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
                                                        });

                                                        setCompartido(true);
                                                        setTimeout(() => setCompartido(false), 2000);
                                                    } else {
                                                        navigator.clipboard.writeText(mensajeCompartir);
                                                        setCopiado(true);
                                                        setTimeout(() => setCopiado(false), 2000);
                                                    }
                                                } catch {
                                                    // usuario canceló
                                                }
                                            }}
                                            className="text-gray-500 hover:text-green-600 transition"
                                            title="Compartir invitación"
                                        >
                                            <Share2 size={16} />
                                        </button>


                                    </div>
                                </div>

                                {/* Mensaje de confirmación */}
                                {copiado && (
                                    <div className="flex items-center gap-1 text-green-600 text-xs">
                                        <Check size={14} />
                                        <span>¡Enlace copiado!</span>
                                    </div>
                                )}
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
                            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm space-y-1">
                                <strong>URL:</strong>

                                <div className="flex justify-between items-center mt-1 gap-3">
                                    <span className="truncate">{newUrl}</span>

                                    <div className="flex items-center gap-2">
                                        {/* Copiar */}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(newUrl);
                                                setCopiado(true);
                                                setTimeout(() => setCopiado(false), 2000);
                                            }}
                                            className="text-gray-500 hover:text-blue-600 transition"
                                            title="Copiar URL"
                                        >
                                            <Copy size={16} />
                                        </button>

                                        {/* Compartir */}
                                        <button
                                            onClick={async () => {
                                                try {
                                                    if (navigator.share) {
                                                        await navigator.share({
                                                            title: 'Invitación a nuestra boda',
                                                            text: mensajeCompartir,
                                                        });

                                                        setCompartido(true);
                                                        setTimeout(() => setCompartido(false), 2000);
                                                    } else {
                                                        navigator.clipboard.writeText(mensajeCompartir);
                                                        setCopiado(true);
                                                        setTimeout(() => setCopiado(false), 2000);
                                                    }
                                                } catch {
                                                    // usuario canceló
                                                }
                                            }}
                                            className="text-gray-500 hover:text-green-600 transition"
                                            title="Compartir invitación"
                                        >
                                            <Share2 size={16} />
                                        </button>

                                    </div>
                                </div>

                                {/* Feedback copiar */}
                                {copiado && (
                                    <div className="flex items-center gap-1 text-green-600 text-xs">
                                        <Check size={14} />
                                        <span>¡URL copiada!</span>
                                    </div>
                                )}

                                {/* Feedback compartir */}
                                {compartido && (
                                    <div className="flex items-center gap-1 text-green-600 text-xs">
                                        <Check size={14} />
                                        <span>¡Invitación compartida!</span>
                                    </div>
                                )}
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
            <FechaLimiteConfirmacion />

        </Decoracion >

    )

}

