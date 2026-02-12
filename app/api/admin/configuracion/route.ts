import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CONFIG_ID = '115026b7-0617-479d-8518-be50386e212b'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { error } = await supabase
      .from('configuracion')
      .update({
        fecha_limite_confirmacion: body.fecha_limite_confirmacion,
        timezone_evento: body.timezone_evento,
      })
      .eq('id', CONFIG_ID)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }
}
