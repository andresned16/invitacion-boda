import { supabase } from '@/lib/supabase'

export type FinanzaDB = {
  id: string
  concepto: string
  presupuesto: number
  pagado: number
  created_at: string
}

// Obtener todas
export async function obtenerFinanzas() {
  const { data, error } = await supabase
    .from('finanzas')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return data as FinanzaDB[]
}

// Crear
export async function crearFinanza(
  concepto: string,
  presupuesto: number,
  pagado: number
) {
  const { error } = await supabase.from('finanzas').insert([
    { concepto, presupuesto, pagado }
  ])

  if (error) console.error(error)
}

// Actualizar
export async function actualizarFinanza(
  id: string,
  concepto: string,
  presupuesto: number,
  pagado: number
) {
  const { error } = await supabase
    .from('finanzas')
    .update({ concepto, presupuesto, pagado })
    .eq('id', id)

  if (error) console.error(error)
}

// Eliminar
export async function eliminarFinanza(id: string) {
  const { error } = await supabase
    .from('finanzas')
    .delete()
    .eq('id', id)

  if (error) console.error(error)
}
