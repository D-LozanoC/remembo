import { flashcardProps } from "@/types/props";
import FlashcardCreate from "./FlashcardCreate";
import FlashcardForm from "./FlashcardForm";
import FlashcardView from "./FlashcardView";
import { Delete } from "../Delete";

export default function Flashcard ({ data, mode, actions }: flashcardProps) {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 mt-6">
            {mode === 'create' && <FlashcardCreate handleCreate={actions.handleCreate} />}
            {data && mode === 'edit' && <FlashcardForm handleUpdate={actions.handleUpdate} data={data} />}
            {data && mode === 'view' && <FlashcardView data={data} />}
            {mode == 'delete' && (
                <>
                    <Delete
                        onConfirm={() => { actions.handleDelete(data.id) }}
                    />
                </>
            )}
        </div>
    )
}