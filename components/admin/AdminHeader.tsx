'use client'

import { RefreshCcw, Plus, LogOut, Menu } from "lucide-react"
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
    <div className="flex justify-between items-center mb-6 gap-4 relative">

      <h1 className="text-3xl font-bold text-[#5C4632] font-bentinck">
        Confirmaciones de la boda
      </h1>

      {/* 🖥️ BOTONES DESKTOP */}
      <div className="hidden md:flex items-center gap-3">

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm px-3 py-1.5 
          border border-[#d8cfc6] 
          text-[#5C4632]
          rounded-lg 
          hover:bg-[#f3eae2] 
          transition"
        >
          <RefreshCcw size={16} />
          <span>Refrescar</span>
        </button>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 text-sm px-3 py-1.5 
          bg-[#5C4632] 
          text-white 
          rounded-lg 
          hover:opacity-90 
          transition"
        >
          <Plus size={16} />
          <span>Agregar familia</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-sm 
          text-[#7a5c3e] 
          hover:text-red-600 
          transition"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* 📱 BOTÓN HAMBURGUESA */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Abrir menú"
      >
        <Menu size={24} />
      </button>

      {/* 📱 MENÚ MOBILE */}
      {menuOpen && (
        <div className="absolute right-0 top-14 bg-white border rounded shadow w-48 z-50">

          <button
            onClick={() => {
              onRefresh()
              setMenuOpen(false)
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            🔄 Refrescar
          </button>

          <button
            onClick={() => {
              onAdd()
              setMenuOpen(false)
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            ➕ Agregar familia
          </button>

          <button
            onClick={() => {
              onLogout()
              setMenuOpen(false)
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
          >
            Cerrar sesión
          </button>

        </div>
      )}
    </div>
  )
}
