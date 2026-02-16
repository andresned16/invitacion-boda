import { supabase } from '@/lib/supabase'

export type FamiliaAdmin = {
  id: string
  nombre_familia: string
  slug_familia: string
  invitados_posibles: string[]
  invitados_confirmados: string[] | null
  cantidad_invitados: number
  confirmado: boolean
  created_at: string
  comments: string | null
  anfitrion: string
}

const SLUGS_RESERVADOS = ['admin', 'api', 'login', 'dashboard']

// 🔎 Obtener familias
export async function obtenerFamilias(): Promise<FamiliaAdmin[]> {
  const { data, error } = await supabase
    .from('familias')
    .select(`
      id,
      nombre_familia,
      slug_familia,
      invitados_posibles,
      invitados_confirmados,
      cantidad_invitados,
      confirmado,
      created_at,
      comments,
      anfitrion
    `)
    .order('nombre_familia')

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}

// ✏️ Actualizar familia
export async function actualizarFamilia(
  id: string,
  nombreFamilia: string,
  invitadosPosibles: string[],
  invitadosConfirmados: string[],
  comments: string,
  anfitrion: string
) {
  // 1️⃣ Actualizar tabla familias
  const { error } = await supabase
    .from('familias')
    .update({
      nombre_familia: nombreFamilia,
      invitados_posibles: invitadosPosibles,
      invitados_confirmados: invitadosConfirmados,
      comments,
      anfitrion,
      cantidad_invitados: invitadosConfirmados.length,
      confirmado: invitadosConfirmados.length > 0
    })
    .eq('id', id)

  if (error) throw error

  // -------------------------------------
  // 2️⃣ SINCRONIZAR TABLA INVITADOS
  // -------------------------------------

  // Obtener invitados actuales en BD
  const { data: invitadosActuales } = await supabase
    .from('invitados')
    .select('*')
    .eq('familia_id', id)

  const nombresActuales = invitadosActuales?.map(i => i.nombre) ?? []

  // 🔹 A) Insertar nuevos invitados
  const nuevos = invitadosPosibles.filter(
    nombre => !nombresActuales.includes(nombre)
  )

  if (nuevos.length > 0) {
    await supabase.from('invitados').insert(
      nuevos.map(nombre => ({
        familia_id: id,
        nombre,
        confirmado: invitadosConfirmados.includes(nombre),
        anfitrion
      }))
    )
  }

  // 🔹 B) Eliminar invitados borrados
  const eliminados = nombresActuales.filter(
    nombre => !invitadosPosibles.includes(nombre)
  )

  if (eliminados.length > 0) {
    await supabase
      .from('invitados')
      .delete()
      .eq('familia_id', id)
      .in('nombre', eliminados)
  }

  // 🔹 C) Actualizar confirmados
  // Primero todos en false
  await supabase
    .from('invitados')
    .update({ confirmado: false })
    .eq('familia_id', id)

  // Luego marcar solo seleccionados
  if (invitadosConfirmados.length > 0) {
    await supabase
      .from('invitados')
      .update({ confirmado: true })
      .eq('familia_id', id)
      .in('nombre', invitadosConfirmados)
  }
}


// 🗑 Eliminar familia
export async function eliminarFamilia(id: string) {
  return await supabase
    .from('familias')
    .delete()
    .eq('id', id)
}

// 🔤 Generar slug base
function generarSlug(nombre: string) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// 🔤 Generar slug único
export async function generarSlugUnico(nombre: string) {
  const baseSlug = generarSlug(nombre)

  if (SLUGS_RESERVADOS.includes(baseSlug)) {
    let contador = 2
    let nuevoSlug = `${baseSlug}-${contador}`

    while (SLUGS_RESERVADOS.includes(nuevoSlug)) {
      contador++
      nuevoSlug = `${baseSlug}-${contador}`
    }

    return nuevoSlug
  }

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

  while (
    slugsExistentes.includes(nuevoSlug) ||
    SLUGS_RESERVADOS.includes(nuevoSlug)
  ) {
    contador++
    nuevoSlug = `${baseSlug}-${contador}`
  }

  return nuevoSlug
}

// ➕ Crear familia
// ➕ Crear familia
export async function crearFamilia(
  nombre: string,
  invitados: string[],
  anfitrion: string
) {
  const slug = await generarSlugUnico(nombre)

  // 1️⃣ Crear familia y obtener el registro creado
  const { data: familia, error } = await supabase
    .from('familias')
    .insert({
      nombre_familia: nombre,
      slug_familia: slug,
      invitados_posibles: invitados,
      invitados_confirmados: [],
      cantidad_invitados: 0,
      confirmado: false,
      comments: '',
      anfitrion
    })
    .select()
    .single()

  if (error || !familia) {
    console.error(error)
    return null
  }

  // 2️⃣ Insertar invitados en tabla "invitados"
  const invitadosInsert = invitados.map((nombreInvitado) => ({
    familia_id: familia.id,
    nombre: nombreInvitado,
    confirmado: false,
    mesa_id: null
  }))

  const { error: errorInvitados } = await supabase
    .from('invitados')
    .insert(invitadosInsert)

  if (errorInvitados) {
    console.error('Error insertando invitados:', errorInvitados)
  }

  return slug
}
