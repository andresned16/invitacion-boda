export default function Itinerario() {
    const eventos = [
        { hora: '4:00 PM', titulo: 'Ceremonia', icono: '⛪' },
        { hora: '6:00 PM', titulo: 'Recepción', icono: '🥂' },
        { hora: '6:10 PM', titulo: 'Entrada de los novios', icono: '💃🕺' },
        { hora: '6:30 PM', titulo: 'Fotografía', icono: '📸' },
        { hora: '7:30 PM', titulo: 'Baile de los novios', icono: '💞' },
        { hora: '8:00 PM', titulo: 'Brindis', icono: '🍾' },
        { hora: '9:00 PM', titulo: 'Cena', icono: '🍽️' },
        { hora: '10:00 PM', titulo: 'Disfruta la fiesta', icono: '🪩' },
        { hora: '12:00 M', titulo: 'Felices para siempre', icono: '💍' },
    ]

    return (
        <section className="py-20 px-6 bg-[#f7f3ee]">
            <h2 className="text-center text-4xl font-kingsguard mb-16 text-[#7a5c3e]">
                Itinerario
            </h2>

            <div className="relative max-w-xl mx-auto">
                {/* Línea vertical */}
                <div className="absolute left-1/2 top-0 h-full w-[2px] bg-[#b08b5a] -translate-x-1/2" />

                <ul className="space-y-12">
                    {eventos.map((evento, index) => (
                        <li
                            key={index}
                            className="relative grid grid-cols-[1fr_1fr] items-center"
                        >
                            {/* Hora */}
                            <div className="text-right pr-10 text-sm tracking-wide text-[#7a5c3e]">
                                {evento.hora}
                            </div>

                            {/* Evento */}
                            <div className="pl-10 flex items-center gap-3 text-[#3b2f24]">
                                <span className="text-xl">{evento.icono}</span>
                                <span className="font-medium">{evento.titulo}</span>
                            </div>

                            {/* Punto central (absoluto) */}
                            <span
                                className="
                                absolute
                                left-1/2
                                top-1/2
                                -translate-x-1/2
                                -translate-y-1/2
                                w-4 h-4
                                rounded-full
                                bg-[#b08b5a]
                                z-10
                                "
                            />
                        </li>

                    ))}
                </ul>
            </div>
        </section>
    )
}
