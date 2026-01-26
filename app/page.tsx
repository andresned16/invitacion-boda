import Image from "next/image";

import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data } = await supabase
    .from('familias')
    .select('slug_familia')

  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
}