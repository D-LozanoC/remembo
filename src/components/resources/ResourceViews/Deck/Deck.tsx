import { deckProps } from "@/types/props";
import DeckCreate from "./DeckCreate";
import DeckForm from "./DeckForm";
import DeckView from "./DeckView";
import { Delete } from "../Delete";
import DeckRelate from "./DeckRelate";
export default function Deck ({
    data,
    mode,
    actions
}: deckProps) {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 mt-6">
            {mode === 'create' && <DeckCreate handleCreate={actions.handleCreate} />}
            {data && mode === 'edit' && <DeckForm handleUpdate={actions.handleUpdate} data={data} />}
            {data && mode === 'view' && <DeckView data={data} />}
            {mode == 'delete' && (<Delete onConfirm={() => { actions.handleDelete(data.id) }} />)}
            {mode === 'relate' && (<DeckRelate deck={data} handleRelate={actions.handleRelate} />)}
        </div>
    )
}