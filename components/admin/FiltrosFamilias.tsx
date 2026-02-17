'use client'

import { useState } from 'react'

type EstadoFiltro = 'todos' | 'confirmados' | 'pendientes'
type CuposFiltro = 'todos' | 'completo' | 'disponible'
type AnfitrionFiltro = 'todos' | 'andres' | 'karen'
type OrdenFiltro =
  | 'reciente'
  | 'antiguo'
  | 'az'
  | 'za'

type Props = {
  search: string
  setSearch: (value: string) => void

  estadoFiltro: EstadoFiltro
  setEstadoFiltro: (value: EstadoFiltro) => void

  cuposFiltro: CuposFiltro
  setCuposFiltro: (value: CuposFiltro) => void

  anfitrionFiltro: AnfitrionFiltro
  setAnfitrionFiltro: (value: AnfitrionFiltro) => void

  orden: OrdenFiltro
  setOrden: (value: OrdenFiltro) => void

  rowsPerPage: number
  setRowsPerPage: (value: number) => void

  resetFiltros: () => void
  hayFiltrosActivos: boolean
}

export default function FiltrosFamilias({
  search,
  setSearch,
  estadoFiltro,
  setEstadoFiltro,
  cuposFiltro,
  setCuposFiltro,
  anfitrionFiltro,
  setAnfitrionFiltro,
  orden,
  setOrden,
  rowsPerPage,
  setRowsPerPage,
  resetFiltros,
  hayFiltrosActivos,
}: Props) {

  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  return (
    <div className="bg-[#fffaf6] border border-[#e8dfd6] rounded-2xl p-4 mb-6 shadow-sm">

      {/* 🔍 Buscador + Botón */}
      <div className="flex flex-col md:flex-row md:items-end gap-4">

        {/* Buscador */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-[#5C4632]">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Familia o persona…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-black/20 outline-none"
          />
        </div>

        {/* Botón Filtros */}
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition"
          >
            {mostrarFiltros ? 'Ocultar filtros' : 'Filtros'}
          </button>

          {hayFiltrosActivos && (
            <button
              onClick={resetFiltros}
              className="text-sm text-red-600 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>

      </div>

      {/* 🎛 Panel desplegable */}
      {mostrarFiltros && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in duration-200">

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#5C4632]">
              Estado
            </label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as EstadoFiltro)}
              className="w-full border p-2 rounded-lg"
            >
              <option value="todos">Todos</option>
              <option value="confirmados">Confirmados</option>
              <option value="pendientes">Pendientes</option>
            </select>
          </div>

          {/* Cupos */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#5C4632]">
              Cupos
            </label>
            <select
              value={cuposFiltro}
              onChange={(e) => setCuposFiltro(e.target.value as CuposFiltro)}
              className="w-full border p-2 rounded-lg"
            >
              <option value="todos">Todos</option>
              <option value="completo">Completos</option>
              <option value="disponible">Disponibles</option>
            </select>
          </div>

          {/* Invita */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#5C4632]">
              Invita
            </label>
            <select
              value={anfitrionFiltro}
              onChange={(e) => setAnfitrionFiltro(e.target.value as AnfitrionFiltro)}
              className="w-full border p-2 rounded-lg"
            >
              <option value="todos">Todos</option>
              <option value="andres">Andrés</option>
              <option value="karen">Karen</option>
            </select>
          </div>

          {/* Orden */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#5C4632]">
              Ordenar por
            </label>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as OrdenFiltro)}
              className="w-full border p-2 rounded-lg"
            >
              <option value="reciente">Más recientes</option>
              <option value="antiguo">Más antiguos</option>
              <option value="az">Nombre A–Z</option>
              <option value="za">Nombre Z–A</option>
            </select>
          </div>

          {/* Filas */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#5C4632]">
              Filas
            </label>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

        </div>
      )}

    </div>
  )
}
