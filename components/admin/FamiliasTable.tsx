'use client'

import { useRef, useState } from 'react'
import { CheckCircle, Clock } from "lucide-react"

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
  familias: FamiliaAdmin[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onOpen: (familia: FamiliaAdmin) => void
  onDelete: (id: string) => void
}

export default function FamiliasTable({
  familias,
  currentPage,
  totalPages,
  onPageChange,
  onOpen,
  onDelete,
}: Props) {

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [showHint, setShowHint] = useState(true)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollLeft > 0) {
      setShowHint(false)
    }
  }

  return (
    <>
      {/* Indicador móvil */}
      <div className="md:hidden text-sm text-gray-500 mb-2 flex items-center gap-2">
        <span>⬅️➡️</span>
        <span>Desliza horizontalmente para ver más</span>
      </div>

      {/* CONTENEDOR SCROLL */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative overflow-x-auto border rounded-lg"
      >

        {/* Gradiente hint */}
        {showHint && (
          <div
            className="
            pointer-events-none
            absolute top-0 right-0
            h-full w-10
            md:hidden
            bg-gradient-to-l
            from-stone-50
            to-transparent
          "
          />
        )}

        <table className="w-full min-w-[900px] bg-[#fffaf6] border-collapse">

          <thead className="bg-[#f3eae2] text-sm text-[#5C4632]">
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
            {familias.map((f) => (
              <tr
                key={f.id}
                className="border-t hover:bg-[#f7f3ee] transition"
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
                    onClick={() => onOpen(f)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => onDelete(f.id)}
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

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-4">

        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          ◀
        </button>

        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          ▶
        </button>

      </div>
    </>
  )
}
