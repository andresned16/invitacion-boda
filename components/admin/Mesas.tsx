'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2 } from 'lucide-react'

/* ------------------ TIPOS ------------------ */

type InvitadoDB = {
  id: string
  nombre: string
  confirmado: boolean
  familias: {
    nombre_familia: string
  } | null
}

type Invitado = {
  id: string
  nombre: string
  familia: string
  confirmado: boolean
}

type Mesa = {
  id: string
  nombre: string
  capacidad: number
  invitados: Invitado[]
}

/* ------------------ COMPONENTE ------------------ */

export default function Mesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [nombreMesa, setNombreMesa] = useState('')
  const [capacidad, setCapacidad] = useState(8)
  const [invitadosConfirmados, setInvitadosConfirmados] = useState<Invitado[]>([])

  /* ------------------ CARGAR INVITADOS ------------------ */

  useEffect(() => {
    const fetchMesas = async () => {
      const { data, error } = await supabase
        .from('mesas')
        .select('*')

      if (error) {
        console.error('Error cargando mesas:', error)
        return
      }

      if (!data) return

      const mesasFormateadas: Mesa[] = data.map((mesa) => ({
        id: mesa.id,
        nombre: mesa.nombre,
        capacidad: mesa.capacidad,
        invitados: []
      }))

      setMesas(mesasFormateadas)
    }

    fetchMesas()
  }, [])

  /* ------------------ AGREGAR INVITADOS A MESAS ------------------ */

  useEffect(() => {
  const fetchInvitados = async () => {
    const { data, error } = await supabase
      .from('invitados')
      .select(`
        id,
        nombre,
        confirmado,
        familias:familia_id (
          nombre_familia
        )
      `)
      .eq('confirmado', true)
      .is('mesa_id', null) // 🔥 IMPORTANTE: solo los que no tienen mesa
      .returns<InvitadoDB[]>()

    if (error) {
      console.error('Error cargando invitados:', error)
      return
    }

    if (!data) return

    const invitadosFormateados: Invitado[] = data.map((inv) => ({
      id: inv.id,
      nombre: inv.nombre,
      confirmado: inv.confirmado,
      familia: inv.familias?.nombre_familia ?? 'Sin familia'
    }))

    setInvitadosConfirmados(invitadosFormateados)
  }

  fetchInvitados()
}, [])



  /* ------------------ CRUD MESAS ------------------ */

  const agregarMesa = async () => {
    if (!nombreMesa.trim()) return

    const { data, error } = await supabase
      .from('mesas')
      .insert({
        nombre: nombreMesa,
        capacidad
      })
      .select()
      .single()

    if (error) {
      console.error('Error creando mesa:', error)
      return
    }

    const nuevaMesa: Mesa = {
      id: data.id,
      nombre: data.nombre,
      capacidad: data.capacidad,
      invitados: []
    }

    setMesas((prev) => [...prev, nuevaMesa])
    setNombreMesa('')
  }


  const eliminarMesa = (id: string) => {
    setMesas((prev) => prev.filter((m) => m.id !== id))
  }

  const asignarInvitado = async (mesaId: string, invitado: Invitado) => {

    const { error } = await supabase
      .from('invitados')
      .update({ mesa_id: mesaId })
      .eq('id', invitado.id)

    if (error) {
      console.error('Error asignando invitado:', error)
      return
    }

    setMesas((prev) =>
      prev.map((m) => {
        if (m.id !== mesaId) return m

        if (m.invitados.some((i) => i.id === invitado.id)) return m
        if (m.invitados.length >= m.capacidad) return m

        return {
          ...m,
          invitados: [...m.invitados, invitado]
        }
      })
    )
  }


  const quitarInvitado = async (mesaId: string, invitado: Invitado) => {

    const { error } = await supabase
      .from('invitados')
      .update({ mesa_id: null })
      .eq('id', invitado.id)

    if (error) {
      console.error('Error quitando invitado:', error)
      return
    }

    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaId
          ? {
            ...m,
            invitados: m.invitados.filter((i) => i.id !== invitado.id)
          }
          : m
      )
    )
  }


  /* ------------------ UI ------------------ */

  return (
    <div className="space-y-8">

      {/* Crear mesa */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold">Mesas</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Nombre mesa (Ej: Mesa 1)"
            value={nombreMesa}
            onChange={(e) => setNombreMesa(e.target.value)}
            className="border p-2 rounded w-48"
          />

          <input
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(Number(e.target.value))}
            className="border p-2 rounded w-24"
            min={1}
          />

          <button
            onClick={agregarMesa}
            className="bg-[#5C4632] text-white px-4 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>
      </div>

      {/* Listado mesas */}
      <div className="grid md:grid-cols-2 gap-6">

        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            className="bg-[#fffaf6] p-5 rounded-2xl border shadow"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">
                {mesa.nombre} ({mesa.invitados.length}/{mesa.capacidad})
              </h3>

              <button
                onClick={() => eliminarMesa(mesa.id)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Invitados asignados */}
            <div className="space-y-2 mb-4">
              {mesa.invitados.map((inv) => (
                <div
                  key={inv.id}
                  className="flex justify-between text-sm bg-white p-2 rounded"
                >
                  <span>
                    {inv.nombre}
                    <span className="text-xs text-gray-500 ml-1">
                      ({inv.familia})
                    </span>
                  </span>

                  <button
                    onClick={() => quitarInvitado(mesa.id, inv)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Invitados disponibles */}
            {mesa.invitados.length < mesa.capacidad && (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Asignar invitados confirmados:
                </p>

                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {invitadosConfirmados
                    .filter((inv) =>
                      !mesas.some((m) =>
                        m.invitados.some((i) => i.id === inv.id)
                      )
                    )
                    .map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => asignarInvitado(mesa.id, inv)}
                        className="block w-full text-left text-sm hover:bg-stone-100 px-2 py-1 rounded"
                      >
                        + {inv.nombre}{' '}
                        <span className="text-xs text-gray-500">
                          ({inv.familia})
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {mesa.invitados.length >= mesa.capacidad && (
              <p className="text-xs text-green-600 font-medium">
                ✔ Mesa completa
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
