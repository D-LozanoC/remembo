'use client'

import { Dialog, DialogPanel } from '@headlessui/react'

export const DeleteConfirmationModal = ({
    open,
    onClose,
    onConfirm,
}: {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}) => (
    <Dialog open={open} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md bg-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Confirmar eliminación</h3>
                <p className="mb-6">¿Estás seguro que quieres eliminar este recurso?</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Eliminar
                    </button>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
)