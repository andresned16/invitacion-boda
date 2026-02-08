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
import { useTexture } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/* =====================================================
   DATA (UNA SOLA FUENTE DE VERDAD)
===================================================== */

const pages: [string, string][] = [
  ['/images/book/page1.jpg', '/images/book/page2.jpg'],
  ['/images/book/page3.jpg', '/images/book/page4.jpg'],
  ['/images/book/page5.jpg', '/images/book/page6.jpg'],
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

  const frontTex = useMemo(() => {
    const tex = frontRaw.clone()
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    return tex
  }, [frontRaw])

  const backTex = useMemo(() => {
    const tex = backRaw.clone()
    tex.colorSpace = THREE.SRGBColorSpace
    tex.needsUpdate = true
    return tex
  }, [backRaw])

  const groupRef = useRef<THREE.Group>(null)
  const isFlipped = index < currentPage

  const thickness = 0.015
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
        <meshBasicMaterial map={frontTex} toneMapped={false} />
      </mesh>

      <mesh position={[1.25, 0, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial map={backTex} toneMapped={false} />
      </mesh>
    </group>
  )
}

/* =====================================================
   MOBILE PAGE
===================================================== */

function MobilePage({
  textures,
  currentPage,
}: {
  textures: string[]
  currentPage: number
}) {
  const { viewport } = useThree()
  const pivotRef = useRef<THREE.Group>(null)

  const rawTextures = useTexture(textures)

  const loadedTextures = useMemo(() => {
    return rawTextures.map((t) => {
      const tex = t.clone()
      tex.colorSpace = THREE.SRGBColorSpace
      tex.needsUpdate = true
      return tex
    })
  }, [rawTextures])

  const [displayPage, setDisplayPage] = useState(currentPage)
  const previousPage = useRef(currentPage)

  const pageWidth = 2.5
  const pageHeight = 3.5
  const desiredHeight = viewport.height * 0.85
  const scale = desiredHeight / pageHeight

  useEffect(() => {
    if (!pivotRef.current) return
    if (currentPage === previousPage.current) return

    const fromPage = previousPage.current
    const toPage = currentPage

    const goingForward = toPage > fromPage
    const direction = goingForward ? -1 : 1

    gsap.fromTo(
      pivotRef.current.rotation,
      { y: 0 },
      {
        y: direction * Math.PI,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          if (!pivotRef.current) return
          pivotRef.current.rotation.y = 0
          setDisplayPage(toPage)
          previousPage.current = toPage
        },
      }
    )
  }, [currentPage])

  const isAnimating = displayPage !== currentPage
  const goingForward = currentPage > displayPage

  const pageBelow = isAnimating ? currentPage : displayPage

  const pivotX = goingForward
    ? -pageWidth / 2
    : pageWidth / 2

  return (
    <group scale={scale}>
      {/* Página inferior */}
      <mesh>
        <planeGeometry args={[pageWidth, pageHeight]} />
        <meshBasicMaterial
          map={loadedTextures[pageBelow]}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Página que rota */}
      <group ref={pivotRef} position={[pivotX, 0, 0]}>
        <group position={[-pivotX, 0, 0]}>
          <mesh>
            <planeGeometry args={[pageWidth, pageHeight]} />
            <meshBasicMaterial
              map={loadedTextures[displayPage]}
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
   BOOK
===================================================== */

function Book({ currentPage }: { currentPage: number }) {
  const { size } = useThree()
  const isMobile = size.width < 640

  if (isMobile) {
    return (
      <MobilePage
        textures={pages.flat()}
        currentPage={currentPage}
      />
    )
  }

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

  const totalPages = isMobile ? mobileTotal : desktopTotal

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full h-[500px]">
        <Canvas
          key={isMobile ? 'mobile' : 'desktop'}
          camera={{
            position: [0, 0, isMobile ? 4 : 6],
            fov: 50,
          }}
          gl={{
            toneMapping: THREE.NoToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <Suspense fallback={null}>
            <Book currentPage={currentPage} />
          </Suspense>
        </Canvas>
      </div>

      <div className="mt-10 flex justify-center gap-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="inline-flex items-center gap-2 bg-[#5C4632] text-white text-sm px-8 py-3 tracking-wider hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
          Anterior
        </button>

        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-2 bg-[#5C4632] text-white text-sm px-8 py-3 tracking-wider hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
