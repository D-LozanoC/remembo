"use client"

import { Button } from "@/components/Button"
import Dialog from "@/components/resources/common/Dialog"
import { useEffect, useState } from "react"
import { dateToLocalInputValue } from "../utils"
import FeedbackMessage from "@/components/resources/common/FeedbackMessage"
import { Loader } from "@/components/Loader"

interface EditSessionTimeDialogProps {
    isOpen: boolean
    onClose: () => void
    initialDateTime: Date
    onSave: (sessionId: string, newDate: Date) => Promise<boolean>
    sessionId: string
}

export default function EditSessionTimeDialog({
    isOpen,
    onClose,
    initialDateTime,
    onSave,
    sessionId
}: EditSessionTimeDialogProps) {
    const [currentDate, setCurrentDate] = useState<Date>(new Date(initialDateTime))
    const [dateTime, setDateTime] = useState<Date>(currentDate)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [type, setType] = useState<"success" | "error">("success")

    useEffect(() => {
        setMessage(null)
        const newDate = new Date(initialDateTime)
        setCurrentDate(newDate)
        setDateTime(newDate)
    }, [isOpen, initialDateTime])

    const handleSave = async () => {
        if (loading) return
        setLoading(true)
        const saved = await onSave(sessionId, dateTime)
        setCurrentDate(dateTime)
        setLoading(false)

        if (saved) {
            setType("success")
            setMessage("Hora de la sesión actualizada")
        } else {
            setType("error")
            setMessage("Ha habido un error al actualizar la hora de la sesión")
        }
    }

    return (
        <Dialog isOpen={isOpen}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto transform transition-all duration-300 ease-in-out">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                    Cambiar hora de la sesión
                </h2>

                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Fecha y hora
                </label>
                <input
                    type="datetime-local"
                    value={dateToLocalInputValue(dateTime)}
                    onChange={(e) => setDateTime(new Date(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6 transition-all"
                />

                <div className="flex justify-end gap-3">
                    <Button variant="neutral" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={dateTime.getTime() === currentDate.getTime()}
                        className="disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        Guardar
                    </Button>
                </div>
                <div className="mt-4 items-center">
                    <div className="flex justify-center">
                        {loading && <Loader />}
                    </div>
                    <FeedbackMessage
                        message={message}
                        type={type}
                        onDismiss={() => setMessage(null)}
                    />
                </div>
            </div>
        </Dialog>
    )
}
