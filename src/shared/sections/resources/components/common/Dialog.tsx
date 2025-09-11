import { dialogProps } from "@/types/props"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

export default function Dialog({
    children,
    isOpen,
    style
}: dialogProps) {
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (isOpen) ref.current?.showModal()
        else ref.current?.close()
    }, [isOpen])

    // Si no está abierto, no renderizar nada
    if (!isOpen) return null

    // Renderizar el modal en el body usando createPortal
    return createPortal(
        <div
            className={`
                fixed inset-0 bg-black/50 flex items-center justify-center transition-all duration-300
                opacity-100 pointer-events-auto
                ${style ? style : ''}
            `}
            style={{ zIndex: 9999 }} // Aumenté el z-index para asegurar que esté por encima
        >
            <div
                className={` 
                    w-full sm:max-w-3xl
                    max-h-full sm:max-h-[80vh]
                    transition-transform duration-300
                    scale-100
                `}
            >
                {children}
            </div>
        </div>,
        document.body
    )
}