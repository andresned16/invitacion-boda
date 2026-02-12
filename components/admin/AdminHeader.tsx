'use client'

import { RefreshCcw, Plus, LogOut, Menu, Heart } from "lucide-react"
import { useState } from "react"

type Props = {
  onRefresh: () => void
  onAdd: () => void
  onLogout: () => void
}

export default function AdminHeader({
  onRefresh,
  onAdd,
  onLogout,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        className="
          sticky top-0 z-30
          backdrop-blur-md
          bg-[#fffaf6]/80
          border-b border-[#e8dfd6]
          shadow-sm
        "
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Lado izquierdo */}
          <div className="flex items-center gap-3">
            <Heart className="text-[#b89b7a]" size={20} />
            <h1 className="text-lg md:text-xl font-semibold text-[#5C4632] font-bentinck tracking-wide">
              Panel administrador
            </h1>
          </div>

          {/* 🖥️ BOTONES DESKTOP */}
          <div className="hidden md:flex items-center gap-3">

            <button
              onClick={onRefresh}
              className="
                flex items-center gap-2 text-sm px-4 py-2
                border border-[#d8cfc6]
                text-[#5C4632]
                rounded-full
                hover:bg-[#f3eae2]
                transition
              "
            >
              <RefreshCcw size={16} />
              Refrescar
            </button>

            <button
              onClick={onAdd}
              className="
                flex items-center gap-2 text-sm px-4 py-2
                bg-[#5C4632]
                text-white
                rounded-full
                hover:opacity-90
                transition
                shadow-sm
              "
            >
              <Plus size={16} />
              Nueva familia
            </button>

            <button
              onClick={onLogout}
              className="
                flex items-center gap-1 text-sm
                text-[#7a5c3e]
                hover:text-red-600
                transition
              "
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>

          {/* 📱 HAMBURGUESA */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-[#f3eae2] transition"
          >
            <Menu size={24} className="text-[#5C4632]" />
          </button>
        </div>
      </header>

      {/* 📱 MENÚ MOBILE */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          />

          <div
            className="
              fixed right-6 top-20
              w-56
              bg-[#fffaf6]
              border border-[#e8dfd6]
              rounded-2xl
              shadow-xl
              p-2
              z-50
              animate-fadeIn
            "
          >
            <button
              onClick={() => {
                onRefresh()
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#f3eae2] text-sm transition text-[#5C4632]"
            >
              <RefreshCcw size={16} />
              Refrescar
            </button>

            <button
              onClick={() => {
                onAdd()
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#f3eae2] text-sm transition text-[#5C4632]"
            >
              <Plus size={16} />
              Nueva familia
            </button>

            <hr className="my-2 border-[#e8dfd6]" />

            <button
              onClick={() => {
                onLogout()
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 transition"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </>
  )
}
