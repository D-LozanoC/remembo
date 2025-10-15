import { noteProps } from "@/types/props";
import NoteCreate from "./NoteCreate";
import NoteForm from "./NoteForm";
import NoteView from "./NoteView";
import { Delete } from "../Delete";
import NoteValidate from "./NoteValidate";
import NoteDerivate from "./NoteDerivate";

export default function Note({ data, mode, actions }: noteProps) {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 mt-6">
            {mode === 'create' && <NoteCreate handleCreate={actions.handleCreate} />}
            {data && mode === 'edit' && <NoteForm data={data} handleUpdate={actions.handleUpdate} />}
            {data && mode === 'view' && <NoteView data={data} onClick={actions.onClick} />}
            {mode == 'delete' && (
                <>
                    <Delete
                        onConfirm={() => { actions.handleDelete(data.id) }}
                    />
                </>
            )}
            {mode === 'validate' && (<NoteValidate data={data} handleValidate={actions.handleValidate} setItem={actions.setItem} />)}
            {mode === 'derive' && (<NoteDerivate data={data} handleDerivateFlashcards={actions.handleDerivateFlashcards}/>)}
        </div>
    )
}