// EventoInfo.tsx
type Props = {
    tipo: 'Recepción' | 'Conferencia'
    fecha: string
    hora: string
    lugar: string
}

export default function EventoInfo({ tipo, fecha, hora, lugar }: Props) {
    return (
        <div className="relative bg-[#faf7f2] p-8 border-2 border-dashed border-[#b08b5a] max-w-sm mx-auto">
            <h3 className="text-center text-xl tracking-widest font-serif text-[#5c4632] mb-6">
                {tipo.toUpperCase()}
            </h3>

            <div className="h-px bg-[#b08b5a] mb-6" />

            <ul className="space-y-3 text-left text-sm text-[#3b2f24]">
                <li className="flex gap-2">
                    <span className="w-20 text-[#7a5c3e] uppercase tracking-wider">
                        Fecha
                    </span>
                    <span>{fecha}</span>
                </li>

                <li className="flex gap-2">
                    <span className="w-20 text-[#7a5c3e] uppercase tracking-wider">
                        Hora
                    </span>
                    <span>{hora}</span>
                </li>

                <li className="flex gap-2">
                    <span className="w-20 text-[#7a5c3e] uppercase tracking-wider">
                        Lugar
                    </span>
                    <span>{lugar}</span>
                </li>
            </ul>

            <div className="absolute bottom-4 right-4 w-14 h-14 rounded-full border-2 border-[#b08b5a] flex items-center justify-center text-xs text-[#b08b5a] rotate-[-12deg]">
                RSVP
            </div>
        </div>
    )
}
