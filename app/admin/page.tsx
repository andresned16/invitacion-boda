'use client'

import { useEffect, useState, useCallback } from 'react'
import { Lock, Heart } from "lucide-react";
import {
    obtenerFamilias,
    actualizarFamilia,
    eliminarFamilia,
    crearFamilia
} from '@/services/familias'

import Decoracion from '@/components/ui/Decoracion';
import FechaLimiteConfirmacion from '@/components/admin/FechaLimiteConfirmacion'
import AdminHeader from '@/components/admin/AdminHeader'
import DashboardMetricas from '@/components/admin/DashboardMetricas'
import FiltrosFamilias from '@/components/admin/FiltrosFamilias'
import FamiliasTable from '@/components/admin/FamiliasTable'
import EditarFamiliaModal from '@/components/admin/EditarFamiliaModal'
import CrearFamiliaModal from '@/components/admin/CrearFamiliaModal'
import type { FamiliaAdmin } from '@/services/familias'
import Mesas from '@/components/admin/Mesas';




type EstadoFiltro = 'todos' | 'confirmados' | 'pendientes'
type CuposFiltro = 'todos' | 'completo' | 'disponible'
type OrdenFiltro = 'reciente' | 'antiguo' | 'az' | 'za'



export default function AdminPage() {


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


    // 👨‍👩‍👧 Familias confirmadas
    const familiasConfirmadas = familias.filter(f => f.confirmado).length


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

    const [anfitrionFiltro, setAnfitrionFiltro] =
        useState<'todos' | 'andres' | 'karen'>('todos')



    // ✅ Leer auth SOLO en cliente


    const fetchFamilias = useCallback(async () => {
        const data = await obtenerFamilias()
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
    }

    const closeModal = () => {
        setFamiliaActiva(null)
    }
    //Mesa

    const invitadosConfirmadosGlobal = familias.flatMap(f =>
        (f.invitados_confirmados ?? []).map(nombre => ({
            nombre,
            familia: f.nombre_familia
        }))
    )



    // 🔐 LOGIN
    if (!autorizado) {
        return (
            <Decoracion>
                <main className="min-h-screen flex items-center justify-center p-6 bg-[#f7f3ee]">

                    <form
                        className="
            w-full 
            max-w-sm 
            bg-[#fffaf6] 
            p-8 
            rounded-2xl 
            shadow-lg 
            border border-[#e8dfd6]
          "
                        onSubmit={(e) => {
                            e.preventDefault();
                            login();
                        }}
                    >
                        {/* Título */}
                        <div className="flex flex-col items-center mb-6 gap-3">
                            <div className="p-4 bg-[#5C4632] rounded-full shadow-md">
                                <Lock className="text-white" size={22} />
                            </div>

                            <h1 className="text-2xl font-bold text-center text-[#5C4632] font-bentinck tracking-wide">
                                Acceso administrador
                            </h1>

                            <p className="text-sm text-[#b89b7a] text-center font-bentinck">
                                Introduce la contraseña para continuar
                            </p>
                        </div>

                        {/* Input */}
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="
                w-full 
                border border-[#d8cfc6] 
                bg-white
                rounded-lg 
                px-3 py-2 
                focus:outline-none 
                focus:ring-2 
                focus:ring-[#5C4632]
                focus:border-[#5C4632]
                transition
              "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 text-sm mb-3 text-center">
                                {error}
                            </p>
                        )}

                        {/* Botón */}
                        <button
                            type="submit"
                            className="
              w-full 
              bg-[#5C4632] 
              text-white 
              py-2.5 
              rounded-lg 
              hover:opacity-90 
              transition-opacity 
              duration-200
              font-medium
              tracking-wide
              shadow-md
            "
                        >
                            Entrar
                        </button>
                    </form>
                </main>
            </Decoracion>
        )
    }



    if (loading) {
        return (
            <Decoracion>
                <div className="min-h-screen flex items-center justify-center px-6 bg-[#fdfaf6]">
                    <div className="text-center">

                        {/* Spinner romántico */}
                        <div className="relative flex items-center justify-center mb-6">

                            {/* Anillo girando */}
                            <div className="w-16 h-16 border-4 border-[#d6c3b3] border-t-[#5C4632] rounded-full animate-spin" />

                            {/* Corazón centrado */}
                            <Heart className="absolute w-6 h-6 text-[#b89b7a]" />
                        </div>

                        <p className="text-[#7a5c3e] text-sm tracking-wide font-bentinck">
                            Cargando confirmaciones...
                        </p>

                    </div>
                </div>
            </Decoracion>
        )
    }



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



    const handleSaveFamilia = async (
        id: string,
        nombreFamilia: string,
        invitadosPosibles: string[],
        invitadosConfirmados: string[],
        comments: string,
        anfitrion: string   // 👈 nuevo
    ) => {

        await actualizarFamilia(
            id,
            nombreFamilia,
            invitadosPosibles,
            invitadosConfirmados,
            comments,
            anfitrion   // 👈 pásalo
        )

        await fetchFamilias()
    }







    const deleteFamilia = async (id: string) => {
        const ok = confirm(
            '¿Seguro que deseas borrar esta familia? Esta acción no se puede deshacer.'
        )
        if (!ok) return

        await eliminarFamilia(id)
        await fetchFamilias()
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
            // 👰🤵 Anfitrión
            if (anfitrionFiltro !== 'todos' && f.anfitrion !== anfitrionFiltro)
                return false

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

            <AdminHeader
                onRefresh={refresh}
                onAdd={() => setShowAddModal(true)}

                onLogout={logout}
            />
            <main className="min-h-screen p-6 max-w-5xl mx-auto">
                <DashboardMetricas
                    totalInvitados={totalInvitados}
                    totalConfirmados={totalConfirmados}
                    totalPendientes={totalPendientes}
                    familiasConfirmadas={familiasConfirmadas}
                />

                <FiltrosFamilias
                    search={search}
                    setSearch={setSearch}
                    estadoFiltro={estadoFiltro}
                    setEstadoFiltro={setEstadoFiltro}
                    cuposFiltro={cuposFiltro}
                    setCuposFiltro={setCuposFiltro}
                    orden={orden}
                    setOrden={setOrden}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    resetFiltros={resetFiltros}
                    hayFiltrosActivos={hayFiltrosActivos}
                    anfitrionFiltro={anfitrionFiltro}
                    setAnfitrionFiltro={setAnfitrionFiltro}
                />


                {/* TABLA */}

                {/* Indicador móvil */}
                {/* CONTENEDOR SCROLL */}
                <FamiliasTable
                    familias={familiasPaginadas}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onOpen={openModal}
                    onDelete={deleteFamilia}
                />

                {/* 🔥 AQUÍ VA EL MODAL */}
                <EditarFamiliaModal
                    key={familiaActiva?.id}
                    familia={familiaActiva}
                    open={!!familiaActiva}
                    onClose={closeModal}
                    onSave={handleSaveFamilia}
                />


                <CrearFamiliaModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onCreate={async (nombre, invitados, anfitrion) => {
                        const slug = await crearFamilia(nombre, invitados, anfitrion)


                        if (slug) {
                            await fetchFamilias()
                            return `${window.location.origin}/${slug}`
                        }

                        return null
                    }}

                />


            </main>
            <FechaLimiteConfirmacion />
           <Mesas />

        </Decoracion >

    )

}

