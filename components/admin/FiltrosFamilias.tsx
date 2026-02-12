'use client'

type EstadoFiltro = 'todos' | 'confirmados' | 'pendientes'
type CuposFiltro = 'todos' | 'completo' | 'disponible'
type OrdenFiltro = 'reciente' | 'antiguo' | 'az' | 'za'

type Props = {
  search: string
  setSearch: (value: string) => void

  estadoFiltro: EstadoFiltro
  setEstadoFiltro: (value: EstadoFiltro) => void

  cuposFiltro: CuposFiltro
  setCuposFiltro: (value: CuposFiltro) => void

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
  orden,
  setOrden,
  rowsPerPage,
  setRowsPerPage,
  resetFiltros,
  hayFiltrosActivos,
}: Props) {

  return (
    <div className="bg-[#fffaf6] border border-[#e8dfd6] rounded-2xl p-4 mb-6 shadow-sm">

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
              Limpiar filtros
            </button>
          </div>
        )}

      </div>

    </div>
  )
}
