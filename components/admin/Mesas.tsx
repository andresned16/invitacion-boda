'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2 } from 'lucide-react'

/* ------------------ TIPOS ------------------ */

type InvitadoDB = {
  id: string
  nombre: string
  confirmado: boolean
  mesa_id: string | null
  familia: {
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
    const fetchData = async () => {

      // 1️⃣ Traer mesas
      const { data: mesasData, error: mesasError } = await supabase
        .from('mesas')
        .select('*')

      if (mesasError) {
        console.error('Error cargando mesas:', mesasError)
        return
      }

      // 2️⃣ Traer invitados confirmados (con mesa_id)
      const { data: invitadosData, error: invitadosError } =
        await supabase
          .from('invitados')
          .select(`
      id,
      nombre,
      confirmado,
      mesa_id,
      familia:familia_id (
        nombre_familia
      )
    `)
          .eq('confirmado', true)

      const invitados = invitadosData as InvitadoDB[] | null


      if (invitadosError) {
        console.error('Error cargando invitados:', invitadosError)
        return
      }

      if (!mesasData) return

      // 3️⃣ Construir mesas con invitados asignados
      const mesasFormateadas: Mesa[] = mesasData.map((mesa) => {

        const invitadosDeMesa: Invitado[] =
          invitados
            ?.filter((inv) => inv.mesa_id === mesa.id)

            .map((inv) => ({
              id: inv.id,
              nombre: inv.nombre,
              confirmado: inv.confirmado,
              familia: inv.familia?.nombre_familia ?? 'Sin familia'

            })) || []

        return {
          id: mesa.id,
          nombre: mesa.nombre,
          capacidad: mesa.capacidad,
          invitados: invitadosDeMesa
        }
      })

      setMesas(mesasFormateadas)

      // 4️⃣ Invitados disponibles (los que no tienen mesa)
      const disponibles: Invitado[] =
        invitados
          ?.filter((inv) => !inv.mesa_id)
          .map((inv) => ({
            id: inv.id,
            nombre: inv.nombre,
            confirmado: inv.confirmado,
            familia: inv.familia?.nombre_familia ?? 'Sin familia'


          })) || []

      setInvitadosConfirmados(disponibles)
    }

    fetchData()
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


  const eliminarMesa = async (id: string) => {

    // 1️⃣ Liberar invitados asignados a esa mesa
    const { error: updateError } = await supabase
      .from('invitados')
      .update({ mesa_id: null })
      .eq('mesa_id', id)

    if (updateError) {
      console.error('Error liberando invitados:', updateError)
      return
    }

    // 2️⃣ Borrar la mesa
    const { error: deleteError } = await supabase
      .from('mesas')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error eliminando mesa:', deleteError)
      return
    }

    // 3️⃣ Actualizar estado local
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

  /*----------------Buscador de usuarios-------->*/
  const [busqueda, setBusqueda] = useState('')


  const mesasFiltradas = mesas.filter((mesa) => {
    if (!busqueda.trim()) return true

    const texto = busqueda.toLowerCase()

    // Buscar por nombre de mesa
    if (mesa.nombre.toLowerCase().includes(texto)) return true

    // Buscar por invitados (nombre o familia)
    const coincideInvitado = mesa.invitados.some((inv) =>
      inv.nombre.toLowerCase().includes(texto) ||
      inv.familia.toLowerCase().includes(texto)
    )

    return coincideInvitado
  })

  /* ------------------ UI ------------------ */

  return (
    <div className="space-y-10">

      {/* Crear mesa */}
      <div className="bg-[#fdfaf6] border border-[#e8dfd6] rounded-2xl p-8 shadow-sm">

        <h2 className="text-2xl font-bentinck text-[#7a5c3e] mb-6">
          Mesas
        </h2>

        {/* SUBSECCIÓN CREAR */}
        <h3 className="text-lg font-semibold text-[#7a5c3e] text-left mb-4">

          Crear mesa
        </h3>

        <div className="flex flex-wrap gap-4 items-end mb-8">

          <div className="flex flex-col">
            <label className="text-sm text-[#7a5c3e] mb-1">
              Nombre de mesa
            </label>
            <input
              type="text"
              placeholder="Ej: Mesa 1"
              value={nombreMesa}
              onChange={(e) => setNombreMesa(e.target.value)}
              className="border p-2 rounded w-48"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-[#7a5c3e] mb-1">
              Cantidad
            </label>
            <input
              type="number"
              value={capacidad}
              onChange={(e) => setCapacidad(Number(e.target.value))}
              className="border p-2 rounded w-24"
              min={1}
            />
          </div>

          <button
            onClick={agregarMesa}
            className="bg-[#5C4632] text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        {/* BUSCADOR (solo si existen mesas) */}
        {mesas.length === 0 && (
          <p className="text-sm text-[#7a5c3e] opacity-70 mt-6">
            Aún no has creado ninguna mesa.
          </p>
        )}

        {/* BUSCADOR (solo si existen mesas) */}
        {mesas.length > 0 && (
          <>
            {/* Línea divisoria elegante */}
            <div className="my-8">
              <div className="h-px bg-[#5C4632] opacity-30 w-full"></div>
            </div>

            <h3 className="text-lg font-semibold text-[#7a5c3e] text-left mb-4">

              Buscar
            </h3>

            <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
              <div className="flex flex-col w-full md:w-96">
                <label className="text-sm text-[#7a5c3e] mb-1">
                  Buscar mesa, familia o persona
                </label>
                <input
                  type="text"
                  placeholder="Ej: Mesa 3, Pérez, Juan..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="text-sm text-[#7a5c3e] underline mt-2 md:mt-0"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          </>
        )}
      </div>


      {/* Listado mesas */}
      <div className="grid md:grid-cols-2 gap-6">

        {mesasFiltradas.map((mesa) => (

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
