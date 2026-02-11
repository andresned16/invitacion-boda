import Image from "next/image";

import { supabase } from '@/lib/supabase'
import Portada from '@/components/invitacion/Portada'
import Countdown from '@/components/invitacion/Countdown'

export default async function Home() {
  return (
    <>
      <Portada />
    </>
  )
}
