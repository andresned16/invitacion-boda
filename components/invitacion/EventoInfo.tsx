// EventoInfo.tsx
type Evento = {
    titulo: 'Conferencia Biblica' | 'Recepción'
    hora: string
    lugar: string
    ubicacionUrl: string
}

type Props = {
    eventos: Evento[]
}

export default function EventoInfo({ eventos }: Props) {
    return (
        <div className="relative max-w-md mx-2 md:mx-auto">
            {/* SELLO */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                <img
                    src="/images/sello.png"
                    alt="Sello"
                    className="w-16 h-16 rotate-[-8deg]"
                />
            </div>

            {/* CARTA */}
            <div
                className="
                    relative
                    z-10
                    p-8
                    pt-12
                    border-2
                    border-dashed
                    border-[#b08b5a]
                    bg-cover
                    bg-center
                    space-y-16
                "
                style={{
                    backgroundImage: "url('/images/papel.jpg')",
                }}
            >
                {eventos.map((evento, index) => {
                    const icono =
                        evento.titulo === 'Conferencia Biblica'
                            ? '/images/discursoLogo.png'
                            : '/images/baileLogo.png'

                    const fondoDecorativo =
                        evento.titulo === 'Conferencia Biblica'
                            ? "url('/images/mapamundi.png')"
                            : "url('/images/playa.png')"

                    return (
                        <div key={index} className="relative">
                            {/* FONDO DECORATIVO POR SECCIÓN */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-center
                                    bg-no-repeat
                                    bg-contain
                                    opacity-30
                                    z-0
                                    pointer-events-none
                                "
                                style={{
                                    backgroundImage: fondoDecorativo,
                                }}
                            />

                            {/* CONTENIDO */}
                            <div className="relative z-10">
                                {/* TÍTULO */}
                                <h3 className="text-center text-xl tracking-widest font-serif text-[#5c4632] mb-2 font-bentinck">
                                    {evento.titulo.toUpperCase()}
                                </h3>

                                {/* ÍCONO */}
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={icono}
                                        alt={evento.titulo}
                                        className="w-14 h-14 opacity-80"
                                    />
                                </div>

                                {/* INFO */}
                                <ul className="space-y-3 text-left text-sm text-[#3b2f24]">

                                    <li className="flex gap-2">
                                        <span className="w-20 text-[#7a5c3e] uppercase tracking-wider font-bentinck">
                                            Hora
                                        </span>
                                        <span>{evento.hora}</span>
                                    </li>

                                    <li className="flex gap-2">
                                        <span className="w-20 text-[#7a5c3e] uppercase tracking-wider font-bentinck">
                                            Lugar
                                        </span>
                                        <span>{evento.lugar}</span>
                                    </li>
                                </ul>

                                {/* BOTÓN */}
                                <div className="mt-6 flex justify-center">
                                    <a
                                        href={evento.ubicacionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            inline-block
                                            bg-[#5C4632]
                                            text-white
                                            text-sm
                                            px-6
                                            py-2
                                            tracking-wider
                                            hover:opacity-90
                                            transition
                                            font-bentinck
                                        "
                                    >
                                        Ver ubicación
                                    </a>
                                </div>
                            </div>

                            {/* SEPARADOR */}
                            {index < eventos.length - 1 && (
                                <div className="relative z-10 my-12 flex items-center gap-4">
                                    <div className="flex-1 h-px bg-[#b08b5a]" />
                                    <span className="text-xs tracking-widest text-[#b08b5a]">
                                        ✦
                                    </span>
                                    <div className="flex-1 h-px bg-[#b08b5a]" />
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* RSVP DECORATIVO */}
                <div
                    className="absolute bottom-4 right-4 w-14 h-14 rounded-full border-2 border-[#b08b5a] flex items-center justify-center text-xs text-[#b08b5a] rotate-[-12deg] font-kingsguard"
                    style={{ textShadow: '0 0 1px #b08b5a' }}
                >
                    K&A
                </div>

            </div>
        </div>
    )
}
