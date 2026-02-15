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
  comments
`)

    .order('nombre_familia')

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}

// ✏️ Actualizar familia
export const actualizarFamilia = async (
  id: string,
  invitados: string[],
  comments: string
) => {
  const { error } = await supabase
    .from('familias')
    .update({
      invitados_confirmados: invitados,
      cantidad_invitados: invitados.length,
      confirmado: invitados.length > 0,
      comments: comments || null,
    })
    .eq('id', id)

  if (error) {
    console.error(error)
    throw error
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
export async function crearFamilia(
  nombre: string,
  invitados: string[]
) {
  const slug = await generarSlugUnico(nombre)

  const { error } = await supabase
    .from('familias')
    .insert({
      nombre_familia: nombre,
      slug_familia: slug,
      invitados_posibles: invitados,
      invitados_confirmados: [],
      cantidad_invitados: 0,
      confirmado: false,
    })

  if (error) {
    console.error(error)
    return null
  }

  return slug
}
