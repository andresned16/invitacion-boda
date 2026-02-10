'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useLayoutEffect, useRef, useState, useEffect, useMemo } from 'react'
import { useTexture, ContactShadows } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const pages: [string, string][] = [
    ['/images/book/page1.jpg', '/images/book/page2.jpg'],
    ['/images/book/page3.jpg', '/images/book/page4.jpg'],
    ['/images/book/page5.jpg', '/images/book/page6.jpg'],
    ['/images/book/page7.jpg', '/images/book/page8.jpg'],
    ['/images/book/page9.jpg', '/images/book/page10.jpg'],
    ['/images/book/page11.jpg', '/images/book/page12.jpg'],
]

const desktopTotal = pages.length
const mobileTotal = pages.flat().length - 1

/* =====================================================
    MOBILE PAGE (LÓGICA DE DOBLE BUFFER)
===================================================== */
function MobilePage({ textures, currentPage, direction }: { textures: string[], currentPage: number, direction: 'forward' | 'backward' }) {
    const { viewport, gl } = useThree()
    const pivotRef = useRef<THREE.Group>(null)
    const isAnimatingRef = useRef(false)
    const loadedTextures = useTexture(textures)

    useEffect(() => {
        loadedTextures.forEach(tex => {
            tex.colorSpace = THREE.SRGBColorSpace
            gl.initTexture(tex) 
            tex.needsUpdate = true
        })
    }, [loadedTextures, gl])

    const [displayPage, setDisplayPage] = useState(currentPage)
    
    // 1. Definimos isForward aquí arriba para que esté disponible en todo el componente
    const isForward = direction === 'forward'

    const pageWidth = 2.5
    const pageHeight = 3.5
    const scale = Math.min((viewport.height * 0.85) / pageHeight, (viewport.width * 0.9) / pageWidth)

   useLayoutEffect(() => {
        if (!pivotRef.current || currentPage === displayPage || isAnimatingRef.current) return
        
        isAnimatingRef.current = true
        // Hacemos visible la hoja justo antes de empezar a moverla
        pivotRef.current.visible = true;

        const startRotation = isForward ? 0 : -Math.PI
        const endRotation = isForward ? -Math.PI : 0

        pivotRef.current.rotation.y = startRotation

        gsap.to(pivotRef.current.rotation, {
            y: endRotation,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                setDisplayPage(currentPage)
                isAnimatingRef.current = false
                // LÓGICA CLAVE: Ocultamos la hoja al terminar para que no estorbe
                if (pivotRef.current) {
                    pivotRef.current.visible = false;
                }
            },
        })
    }, [currentPage, direction, displayPage, isForward])

    return (
        <group scale={scale}>
            {/* PAGINA DE FONDO */}
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[pageWidth, pageHeight]} />
                <meshBasicMaterial 
                    map={loadedTextures[isForward ? currentPage : displayPage]} 
                    toneMapped={false} 
                />
            </mesh>

            {/* LA HOJA QUE SE MUEVE */}
            {/* Iniciamos con visible={false} para que no aparezca el "fantasma" al cargar */}
            <group ref={pivotRef} position={[-pageWidth / 2, 0, 0.01]} visible={false}>
                <group position={[pageWidth / 2, 0, 0]}>
                    <mesh>
                        <planeGeometry args={[pageWidth, pageHeight]} />
                        <meshBasicMaterial 
                            map={loadedTextures[isForward ? displayPage : currentPage]} 
                            toneMapped={false} 
                            side={THREE.DoubleSide} 
                        />
                    </mesh>
                </group>
            </group>
        </group>
    )
}

/* =====================================================
    PAGE (DESKTOP) - Sin cambios
===================================================== */
function Page({ front, back, index, currentPage }: { front: string, back: string, index: number, currentPage: number }) {
    const frontRaw = useTexture(front)
    const backRaw = useTexture(back)
    const groupRef = useRef<THREE.Group>(null)

    const [frontTex, backTex] = useMemo(() => {
        const f = frontRaw.clone(); f.colorSpace = THREE.SRGBColorSpace; f.needsUpdate = true;
        const b = backRaw.clone(); b.colorSpace = THREE.SRGBColorSpace; b.needsUpdate = true;
        return [f, b]
    }, [frontRaw, backRaw])

    const isFlipped = index < currentPage

    useLayoutEffect(() => {
        if (!groupRef.current) return
        gsap.to(groupRef.current.rotation, {
            y: isFlipped ? -Math.PI : 0,
            duration: 0.8,
            ease: 'power2.inOut',
        })
    }, [isFlipped])

    return (
        <group ref={groupRef} position={[-index * -0.01, 0, isFlipped ? index * 0.002 : -index * 0.002]}>
            <mesh position={[1.25, 0, 0]}>
                <planeGeometry args={[2.5, 3.5]} />
                <meshBasicMaterial map={frontTex} toneMapped={false} side={THREE.FrontSide} />
            </mesh>
            <mesh position={[1.25, 0, 0]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[2.5, 3.5]} />
                <meshBasicMaterial map={backTex} toneMapped={false} side={THREE.FrontSide} />
            </mesh>
        </group>
    )
}

/* =====================================================
    BOOK CONTAINER
===================================================== */
function Book({ currentPage, direction }: { currentPage: number, direction: 'forward' | 'backward' }) {
    const { size } = useThree()
    const isMobile = size.width < 640
    const groupDesktopRef = useRef<THREE.Group>(null)

    useLayoutEffect(() => {
        if (isMobile || !groupDesktopRef.current) return
        let targetX = 0
        if (currentPage === 0) targetX = -1.7
        else if (currentPage === desktopTotal) targetX = 1.7
        gsap.to(groupDesktopRef.current.position, { x: targetX, duration: 0.8, ease: 'power2.inOut' })
    }, [currentPage, isMobile])

    return (
        <>
            <group position={[0, 0.1, 0]}>
                {isMobile ? (
                    <MobilePage textures={pages.flat()} currentPage={currentPage} direction={direction} />
                ) : (
                    <group ref={groupDesktopRef} scale={1.4} position={[-1.7, 0, 0]}>
                        {pages.map(([front, back], index) => (
                            <Page key={index} front={front} back={back} index={index} currentPage={currentPage} />
                        ))}
                    </group>
                )}
            </group>
            <ContactShadows opacity={0.5} scale={8} blur={2} far={2.5} resolution={512} color="#2a1e14" position={[0, -2.2, 0]} />
        </>
    )
}

/* =====================================================
    MAIN CANVAS
===================================================== */
export default function Book3D() {
    const [currentPage, setCurrentPage] = useState(0)
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640)
        check(); window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const totalPages = isMobile ? mobileTotal : desktopTotal

    const goNext = () => {
        if (currentPage < totalPages) {
            setDirection('forward')
            setCurrentPage((p) => p + 1)
        }
    }

    const goPrev = () => {
        if (currentPage > 0) {
            setDirection('backward')
            setCurrentPage((p) => p - 1)
        }
    }

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full h-[500px]">
                <Canvas
                    key={isMobile ? 'mobile' : 'desktop'}
                    camera={{ position: [0, 0, isMobile ? 4 : 6], fov: 50 }}
                    gl={{ toneMapping: THREE.NoToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
                >
                    <ambientLight intensity={1.2} />
                    <Suspense fallback={null}>
                        <Book currentPage={currentPage} direction={direction} />
                    </Suspense>
                </Canvas>
            </div>
            <div className="mt-4 flex justify-center gap-6">
                <button onClick={goPrev} disabled={currentPage === 0} className="inline-flex items-center gap-2 bg-[#5C4632] text-white text-sm px-8 py-3 tracking-wider hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={18} /> Anterior
                </button>
                <button onClick={goNext} disabled={currentPage === totalPages} className="inline-flex items-center gap-2 bg-[#5C4632] text-white text-sm px-8 py-3 tracking-wider hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    Siguiente <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}