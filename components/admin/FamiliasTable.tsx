'use client'

import { useRef, useState, useEffect } from 'react'
import { CheckCircle, Clock, FileText } from "lucide-react"
import type { FamiliaAdmin } from '@/services/familias'

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
  const tableContainerRef = useRef<HTMLDivElement | null>(null)

  const [showHint, setShowHint] = useState(true)
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return

    if (el.scrollLeft > 0) {
      setShowHint(false)
    }

    // cerrar tooltip al hacer scroll
    setActiveNoteId(null)
  }

  // cerrar tooltip al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!tableContainerRef.current) return

      if (!tableContainerRef.current.contains(e.target as Node)) {
        setActiveNoteId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      {/* Indicador móvil */}
      <div className="md:hidden text-sm text-gray-500 mb-2 flex items-center gap-2">
        <span>⬅️➡️</span>
        <span>Desliza horizontalmente para ver más</span>
      </div>

      {/* CONTENEDOR SCROLL */}
      <div
        ref={(el) => {
          scrollRef.current = el
          tableContainerRef.current = el
        }}
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

        <table className="w-full min-w-[1150px] bg-[#fffaf6] border-collapse">

          <thead className="bg-[#f3eae2] text-sm text-[#5C4632]">
            <tr>
              <th className="p-3 text-center">Familia</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Cupos</th>
              <th className="p-3 text-center">Confirmados</th>
              <th className="p-3 text-center">Nombres confirmados</th>
              <th className="p-3 text-center">Anfitrión</th>
              <th className="p-3 text-center">Mesa</th>
              <th className="p-3 text-center">Notas</th>

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
                <td className="p-3 text-center">
                  {f.anfitrion === 'andres'
                    ? 'Andrés'
                    : f.anfitrion === 'karen'
                      ? 'Karen'
                      : '—'}
                </td>


                {/* NUEVA COLUMNA NOTAS */}
                <td className="p-3 text-center relative">
                  {f.comments ? (
                    <div
                      className="relative inline-block"
                      onMouseEnter={() => setActiveNoteId(f.id)}
                      onMouseLeave={() => setActiveNoteId(null)}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveNoteId(
                            activeNoteId === f.id ? null : f.id
                          )
                        }}
                      >
                        <FileText
                          size={18}
                          className="text-stone-600 hover:text-stone-900 transition"
                        />
                      </button>

                      {activeNoteId === f.id && (
                        <div
                          className="
                            absolute z-50
                            left-1/2 -translate-x-1/2
                            mt-2
                            w-64
                            bg-white
                            border
                            rounded-lg
                            shadow-lg
                            p-3
                            text-sm
                            text-stone-700
                          "
                        >
                          {f.comments}
                        </div>
                      )}
                    </div>
                  ) : null}
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
