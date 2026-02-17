export type FinanzaDB = {
  id: string
  concepto: string
  presupuesto: number
  pagado: number
  created_at: string
}

// Obtener todas
export async function obtenerFinanzas(): Promise<FinanzaDB[]> {
  const res = await fetch('/api/finanzas')

  if (!res.ok) {
    console.error('Error obteniendo finanzas')
    return []
  }

  return res.json()
}

// Crear
export async function crearFinanza(
  concepto: string,
  presupuesto: number,
  pagado: number
) {
  await fetch('/api/finanzas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ concepto, presupuesto, pagado })
  })
}

// Actualizar
export async function actualizarFinanza(
  id: string,
  concepto: string,
  presupuesto: number,
  pagado: number
) {
  await fetch('/api/finanzas', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, concepto, presupuesto, pagado })
  })
}

// Eliminar
export async function eliminarFinanza(id: string) {
  await fetch(`/api/finanzas?id=${id}`, {
    method: 'DELETE'
  })
}
