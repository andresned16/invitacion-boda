import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const CONFIG_ID = '115026b7-0617-479d-8518-be50386e212b'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { error } = await supabaseAdmin
      .from('configuracion')
      .update({
        fecha_limite_confirmacion: body.fecha_limite_confirmacion,
        timezone_evento: body.timezone_evento
      })
      .eq('id', CONFIG_ID)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
