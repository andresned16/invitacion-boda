'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { ChevronLeft, ChevronRight } from "lucide-react"


/* =====================================================
   PAGE (desktop)
===================================================== */

type PageProps = {
    front: string
    back: string
    index: number
    currentPage: number
}

function Page({ front, back, index, currentPage }: PageProps) {
    const frontTex = useTexture(front)
    const backTex = useTexture(back)
    const groupRef = useRef<THREE.Group>(null)

    const isFlipped = index < currentPage

    const thickness = 0.015
    const xOffset = -index * thickness
    const zOffset = isFlipped ? index * 0.002 : -index * 0.002

    useLayoutEffect(() => {
        if (!groupRef.current) return
        gsap.set(groupRef.current.rotation, {
            y: isFlipped ? -Math.PI : 0,
        })
    }, [])

    useLayoutEffect(() => {
        if (!groupRef.current) return
        gsap.to(groupRef.current.rotation, {
            y: isFlipped ? -Math.PI : 0,
            duration: 0.8,
            ease: 'power2.inOut',
        })
    }, [isFlipped])

    return (
        <group ref={groupRef} position={[xOffset, 0, zOffset]}>
            <mesh position={[1.25, 0, 0]}>
                <planeGeometry args={[2.5, 3.5]} />
                <meshStandardMaterial map={frontTex} />
            </mesh>

            <mesh position={[1.25, 0, 0]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[2.5, 3.5]} />
                <meshStandardMaterial map={backTex} />
            </mesh>
        </group>
    )
}

/* =====================================================
   MOBILE PAGE (con animación real)
===================================================== */

function MobilePage({
    textures,
    currentPage,
    setCurrentPage,
}: {
    textures: string[]
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}) {
    const { viewport } = useThree()
    const pivotRef = useRef<THREE.Group>(null)

    const [displayPage, setDisplayPage] = useState(currentPage)
    const [nextPage, setNextPage] = useState<number | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)

    const loadedTextures = useTexture(textures)

    // 🔥 Sincroniza cuando cambie desde botones externos
    useEffect(() => {
        setDisplayPage(currentPage)
    }, [currentPage])

    const pageWidth = 2.5
    const pageHeight = 3.5
    const desiredHeight = viewport.height * 0.85
    const scale = desiredHeight / pageHeight

    const hasNext = displayPage < loadedTextures.length - 1

    const flipForward = () => {
        if (!pivotRef.current) return
        if (isAnimating) return
        if (!hasNext) return

        setIsAnimating(true)
        setNextPage(displayPage + 1)

        gsap.fromTo(
            pivotRef.current.rotation,
            { y: 0 },
            {
                y: -Math.PI,
                duration: 0.9,
                ease: 'power2.inOut',
                onComplete: () => {
                    const newPage = displayPage + 1
                    setDisplayPage(newPage)
                    setCurrentPage(newPage)

                    pivotRef.current!.rotation.y = 0
                    setNextPage(null)
                    setIsAnimating(false)
                },
            }
        )
    }

    return (
        <group scale={scale}>
            <group
                ref={pivotRef}
                onClick={flipForward}
                position={[-pageWidth / 2, 0, 0]}
            >
                <group position={[pageWidth / 2, 0, 0]}>

                    {/* Página actual visible */}
                    <mesh>
                        <planeGeometry args={[pageWidth, pageHeight]} />
                        <meshBasicMaterial
                            map={loadedTextures[displayPage]}
                            toneMapped={false}
                            side={THREE.DoubleSide}
                        />
                    </mesh>

                    {/* Página que aparece durante la animación */}
                    {nextPage !== null && (
                        <mesh rotation={[0, Math.PI, 0]}>
                            <planeGeometry args={[pageWidth, pageHeight]} />
                            <meshBasicMaterial
                                map={loadedTextures[nextPage]}
                                toneMapped={false}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    )}

                </group>
            </group>
        </group>
    )
}



/* =====================================================
   BOOK
===================================================== */

function Book({
    currentPage,
    setCurrentPage,
}: {
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}) {
    const { size } = useThree()
    const isMobile = size.width < 640

    const pages: [string, string][] = [
        ['/images/book/page1.jpg', '/images/book/page2.jpg'],
        ['/images/book/page3.jpg', '/images/book/page4.jpg'],
        ['/images/book/page5.jpg', '/images/book/page6.jpg'],
    ]

    /* ---------- MOBILE MODE ---------- */
    if (isMobile) {
        const flatPages = pages.flat()

        return (
            <MobilePage
                textures={flatPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        )
    }

    /* ---------- DESKTOP MODE ---------- */
    return (
        <group scale={1.4}>
            {pages.map(([front, back], index) => (
                <Page
                    key={index}
                    front={front}
                    back={back}
                    index={index}
                    currentPage={currentPage}
                />
            ))}
        </group>
    )
}

/* =====================================================
   MAIN
===================================================== */

export default function Book3D() {
    const [currentPage, setCurrentPage] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const totalPages = isMobile ? 5 : 2

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full h-[500px]">
                <Canvas
                    key={isMobile ? 'mobile' : 'desktop'}
                    camera={{
                        position: [0, 0, isMobile ? 4 : 6],
                        fov: 50,
                    }}
                >
                    {!isMobile && (
                        <>
                            <ambientLight intensity={0.7} />
                            <directionalLight position={[5, 5, 5]} intensity={0.8} />
                        </>
                    )}

                    <Suspense fallback={null}>
                        <Book
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </Suspense>
                </Canvas>

            </div>

            <div className="mt-10 flex justify-center gap-6">

                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                    disabled={currentPage === 0}
                    className="
      inline-flex
      items-center
      gap-2
      bg-[#5C4632]
      text-white
      text-sm
      px-8
      py-3
      tracking-wider
      hover:opacity-90
      transition
      font-bentinck
      disabled:opacity-40
      disabled:cursor-not-allowed
    "
                >
                    <ChevronLeft size={18} />
                    Anterior
                </button>

                <button
                    onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="
      inline-flex
      items-center
      gap-2
      bg-[#5C4632]
      text-white
      text-sm
      px-8
      py-3
      tracking-wider
      hover:opacity-90
      transition
      font-bentinck
      disabled:opacity-40
      disabled:cursor-not-allowed
    "
                >
                    Siguiente
                    <ChevronRight size={18} />
                </button>

            </div>

        </div>
    )
}
