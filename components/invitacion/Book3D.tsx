'use client'

import { Canvas, useThree } from '@react-three/fiber'
import {
    Suspense,
    useLayoutEffect,
    useRef,
    useState,
    useEffect,
    useMemo,
} from 'react'
import { useTexture, ContactShadows } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/* =====================================================
    DATA
===================================================== */
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
    PAGE (DESKTOP)
===================================================== */
type PageProps = {
    front: string
    back: string
    index: number
    currentPage: number
}

function Page({ front, back, index, currentPage }: PageProps) {
    const frontRaw = useTexture(front)
    const backRaw = useTexture(back)

    const [frontTex, backTex] = useMemo(() => {
        const f = frontRaw.clone(); f.colorSpace = THREE.SRGBColorSpace; f.needsUpdate = true;
        const b = backRaw.clone(); b.colorSpace = THREE.SRGBColorSpace; b.needsUpdate = true;
        return [f, b]
    }, [frontRaw, backRaw])

    const groupRef = useRef<THREE.Group>(null)
    const isFlipped = index < currentPage
    const thickness = -0.01
    const xOffset = -index * thickness
    const zOffset = isFlipped ? index * 0.002 : -index * 0.002

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
    MOBILE PAGE (SOLUCIÓN AL CASCADING RENDER)
===================================================== */
function MobilePage({ textures, currentPage }: { textures: string[], currentPage: number }) {
    const { viewport } = useThree()
    const pivotRef = useRef<THREE.Group>(null)
    const rawTextures = useTexture(textures)

    const loadedTextures = useMemo(() => {
        return rawTextures.map((t) => {
            const tex = t.clone(); tex.colorSpace = THREE.SRGBColorSpace; tex.needsUpdate = true;
            return tex
        })
    }, [rawTextures])

    const [displayPage, setDisplayPage] = useState(currentPage)
    const [isAnimating, setIsAnimating] = useState(false)
    const previousPage = useRef(currentPage)

    const pageWidth = 2.5
    const pageHeight = 3.5
    const scale = Math.min((viewport.height * 0.85) / pageHeight, (viewport.width * 0.9) / pageWidth)

    useEffect(() => {
        if (!pivotRef.current || currentPage === previousPage.current || isAnimating) return

        const direction = currentPage > previousPage.current ? -1 : 1

        // Usamos requestAnimationFrame para evitar el renderizado en cascada síncrono
        const animationFrame = requestAnimationFrame(() => {
            setIsAnimating(true)

            gsap.fromTo(pivotRef.current!.rotation, { y: 0 }, {
                y: direction * Math.PI,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    previousPage.current = currentPage
                    setDisplayPage(currentPage)
                    setIsAnimating(false)
                    if (pivotRef.current) pivotRef.current.rotation.y = 0
                },
            })
        })

        return () => cancelAnimationFrame(animationFrame)
    }, [currentPage, isAnimating])

    const goingForward = currentPage > displayPage
    const pageBelow = isAnimating ? currentPage : displayPage
    const pivotX = goingForward ? -pageWidth / 2 : pageWidth / 2

    return (
        <group scale={scale}>
            <mesh>
                <planeGeometry args={[pageWidth, pageHeight]} />
                <meshBasicMaterial map={loadedTextures[pageBelow]} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            <group ref={pivotRef} position={[pivotX, 0, 0]}>
                <group position={[-pivotX, 0, 0]}>
                    <mesh>
                        <planeGeometry args={[pageWidth, pageHeight]} />
                        <meshBasicMaterial map={loadedTextures[displayPage]} toneMapped={false} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            </group>
        </group>
    )
}

/* =====================================================
    BOOK CONTAINER
===================================================== */
function Book({ currentPage }: { currentPage: number }) {
    const { size } = useThree()
    const isMobile = size.width < 640
    const groupDesktopRef = useRef<THREE.Group>(null)

    // Animación de posición para Escritorio
    useLayoutEffect(() => {
        if (isMobile || !groupDesktopRef.current) return

        // 1. Posición centrada cuando el libro está abierto (lomo al centro)
        let targetX = 0 
        
        if (currentPage === 0) {
            // 2. Portada: movemos a la izquierda para centrar la hoja derecha
            targetX = -1.7 
        } else if (currentPage === desktopTotal) {
            // 3. Contraportada: movemos a la DERECHA para que la hoja izquierda 
            // quede centrada exactamente donde estaba la portada.
            targetX = 1.7 
        }

        gsap.to(groupDesktopRef.current.position, {
            x: targetX,
            duration: 0.8,
            ease: 'power2.inOut',
        })
    }, [currentPage, isMobile])

    return (
        <>
            <group position={[0, 0.1, 0]}>
                {isMobile ? (
                    <MobilePage textures={pages.flat()} currentPage={currentPage} />
                ) : (
                    <group 
                        ref={groupDesktopRef} 
                        scale={1.4} 
                        // Iniciamos en la posición de portada cerrada
                        position={[-1.7, 0, 0]} 
                    >
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
                )}
            </group>
            
            <ContactShadows
                opacity={0.5}      
                scale={8}           
                blur={2}          
                far={2.5}
                resolution={512}
                color="#2a1e14"     
                position={[0, -2.2, 0]}
            />
        </>
    )
}

/* =====================================================
    MAIN CANVAS
===================================================== */
export default function Book3D() {
    const [currentPage, setCurrentPage] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640)
        check(); window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const totalPages = isMobile ? mobileTotal : desktopTotal

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
                        <Book currentPage={currentPage} />
                    </Suspense>
                </Canvas>
            </div>
            <div className="mt-4 flex justify-center gap-6">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))} disabled={currentPage === 0} className="inline-flex items-center gap-2 bg-[#5C4632] text-white text-sm px-8 py-3 tracking-wider hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={18} /> Anterior
                </button>
                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="inline-flex items-center gap-2 bg-[#5C4632] text-white text-sm px-8 py-3 tracking-wider hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    Siguiente <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}