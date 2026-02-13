export default function Itinerario() {
    const eventos = [
        { hora: '2:30 PM', titulo: 'Conferencia Biblica', icono: '⛪' },
        { hora: '5:00 PM', titulo: 'Recepción', icono: '🥂' },
        { hora: '5:30 PM', titulo: 'Entrada de los novios', icono: '💃🕺' },
        { hora: '6:00 PM', titulo: 'Fotografías', icono: '📸' },
        { hora: '7:00 PM', titulo: 'Cena', icono: '🍽️' },
        { hora: '8:00 PM', titulo: 'Baile de los novios', icono: '💞' },
        { hora: '8:30 PM', titulo: 'Disfruta la fiesta', icono: '🪩' },
        { hora: '12:00 AM', titulo: 'Comienzo de nuestra Historia', icono: '💍' },
    ]

    return (
        <section className="py-16 sm:py-20 px-4 sm:px-6">
            <h2 className="text-center text-4xl sm:text-5xl font-kingsguard mb-14 sm:mb-16 text-[#7a5c3e]">
                Itinerario
            </h2>

            <div className="relative max-w-md sm:max-w-xl mx-auto">

                {/* Línea vertical SIEMPRE visible */}
                <div className="absolute left-1/2 top-0 h-full w-[2px] bg-[#b08b5a] -translate-x-1/2" />

                <ul className="space-y-10 sm:space-y-12">
                    {eventos.map((evento, index) => (
                        <li
                            key={index}
                            className="relative grid grid-cols-[1fr_1fr] items-center"
                        >

                            {/* Evento izquierda */}
                            <div className="
                                flex justify-end items-center gap-2
                                pr-8 sm:pr-10
                                text-[#3b2f24]
                            ">
                                <span className="text-base sm:text-lg">
                                    {evento.icono}
                                </span>

                                <span className="
                                    font-medium
                                    font-bentinck
                                    text-xs sm:text-sm md:text-base
                                    text-right
                                    leading-snug
                                ">
                                    {evento.titulo}
                                </span>
                            </div>

                            {/* Hora derecha */}
                            <div className="
                                pl-8 sm:pl-10
                                text-xs sm:text-sm md:text-base
                                tracking-wide
                                text-[#7a5c3e]
                                text-left
                                font-bentinck
                            ">
                                {evento.hora}
                            </div>

                            {/* Punto central */}
                            <span
                                className="
                                    absolute
                                    left-1/2
                                    top-1/2
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    w-3 h-3 sm:w-4 sm:h-4
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
