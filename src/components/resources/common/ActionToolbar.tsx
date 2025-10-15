import { FiX, FiArrowLeft, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { GiBookshelf } from 'react-icons/gi';
import { ActionButton } from './ActionButton';
import { Tab } from '@/types/enums';
import { ActionToolbarProps } from '@/types/props';
import Dialog from './Dialog';
import { useState } from 'react';
import { Button } from '@/components/Button';


export default function ActionToolBar({ mode, setMode, handleOnClose, itemType, isDisabled }: ActionToolbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const handleBack = (params: { isOK?: boolean } = { isOK: false }) => {
        const { isOK = false } = params
        if ((mode == 'edit' || mode == 'create') && !isOK) {
            setIsOpen(true)
            return
        }
        setIsOpen(false)
        if (mode === 'edit' || mode === 'delete' || mode === 'relate' || mode === 'validate' || mode === 'derive') {
            setMode('view')
            return
        }
        handleOnClose();
    }
    return (
        <div className="absolute inset-x-0 top-0 p-2 sm:px-4 flex justify-between items-center">
            {/* Botón izquierdo */}
            <div>
                {mode === 'view'
                    ? <ActionButton icon={FiX} variant="close" onClick={handleOnClose} />
                    : mode !== 'create' ? <ActionButton icon={FiArrowLeft} variant="back" onClick={handleBack} />
                        : null
                }
                {
                    mode === 'create' && (
                        <ActionButton icon={FiX} variant="close" onClick={handleBack} />
                    )
                }
            </div>

            {/* Botones derechos: agrupa en un <div> con wrap */}
            <div className="flex flex-wrap gap-2">
                {mode === 'view' && (
                    <>
                        <ActionButton icon={FiEdit} variant="edit" onClick={() => setMode('edit')} />
                        <ActionButton icon={FiTrash2} variant="delete" onClick={() => setMode('delete')} />
                    </>
                )}
                {itemType === Tab.Decks && mode === 'view' && (
                    <ActionButton icon={FiPlus} label="Relacionar" variant="relate" onClick={() => setMode('relate')} />
                )}
                {
                    itemType === Tab.Notes && mode === 'view' && (
                        <>
                            <ActionButton label='Validar' icon={AiOutlineCheckCircle} variant='validate' onClick={() => setMode('validate')} />
                            <ActionButton label='Derivar Flashcard' icon={GiBookshelf} variant='derive' onClick={() => setMode('derive')} isDisabled={isDisabled} />
                        </>
                    )
                }
            </div>

            {/* Confirm dialog */}
            <Dialog isOpen={isOpen} style=''>
                <div className="flex flex-col gap-4 p-4 sm:p-6 bg-white rounded-lg mx-auto sm:mx-auto max-w-xs">
                    <h2 className="text-lg font-bold text-gray-900 text-center">¿Desea guardar los cambios?</h2>
                    <p className="text-gray-600 text-center">Si sale de la página, los cambios no se guardarán.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancelar</Button>
                        <Button variant="danger" onClick={() => handleBack({ isOK: true })}>Continuar</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
