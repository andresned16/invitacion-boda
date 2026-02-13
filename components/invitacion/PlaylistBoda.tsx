'use client'
import { Music } from "lucide-react"


export default function PlaylistBoda() {
    const playlistUrl = "https://open.spotify.com/playlist/0pTrCIjfhGhlzNI0S2t16d"
    const embedUrl = "https://open.spotify.com/embed/playlist/0pTrCIjfhGhlzNI0S2t16d"

    return (
        <section className="py-24 text-center fade-up">

            <h2 className="text-5xl font-kingsguard mb-6 text-[#7a5c3e]">
                Nuestra Playlist
            </h2>

            <p className="font-bentinck text-lg text-[#5c4632] mb-10 max-w-xl mx-auto">
                Queremos que nuestra boda tenga la música que tú también amas.
                Agrega esa canción que no puede faltar en la pista de baile 🎶
            </p>

            <div className="flex justify-center px-4">
                <iframe
                    src={embedUrl}
                    width="100%"
                    height="380"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-2xl shadow-xl max-w-3xl w-full"
                />
            </div>

            <div className="mt-10">
                <a
                    href='https://open.spotify.com/playlist/0pTrCIjfhGhlzNI0S2t16d?si=0rbWehdXTdqlB42et5e0Xg&pt=2140ff2fb2af28956b2947d8b14beca0'
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
    inline-flex
    items-center
    gap-2
    bg-[#5C4632]
    hover:opacity-90
    transition-all
    duration-300
    text-white
    font-bentinck
    px-8
    py-3
    shadow-lg
    text-sm
  "
                >
                    <Music size={18} />
                    Agregar canción en Spotify
                </a>

            </div>
        </section>
    )
}
