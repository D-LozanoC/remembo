'use client'

import { Button } from "@/components/Button"
import SuccessAlert from "@/components/SuccessAlert"
import { useState } from "react"

export const Delete = ({
    onConfirm,
}: {
    onConfirm: () => void
}) => {

    return (
        <>
            <div className="text-gray-900 max-w-lg mx-auto flex flex-col gap-6 text-center items-center">
                <h3 className="text-xl font-semibold">Confirmar eliminación</h3>
                <p className="text-base text-gray-700">
                    ¿Estás seguro que quieres eliminar este recurso?
                </p>
                <Button onClick={onConfirm} variant="danger" className="w-1/2">
                    Eliminar
                </Button>
            </div>
        </>
    )
}
