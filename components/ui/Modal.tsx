import { ReactNode } from 'react'

interface ModalProps {
    open: boolean
    onClose: () => void
    children: ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div
                className="
        relative 
        bg-[#FDEEDC]            /* curuba claro */
        rounded-3xl
        shadow-2xl
        w-full max-w-lg 
        p-6 
        border-8 
        border-guayaba-trenza 
        transform transition-transform duration-300
        hover:scale-105
        before:absolute before:inset-0 before:rounded-3xl before:border-4 before:border-dashed before:border-guayaba-trenza before:pointer-events-none
    "
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>

        </div>
    )
}
