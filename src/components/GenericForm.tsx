'use client';

import { DeckForm } from "./resources/ResourceViews/Deck/DeckForm";
import { FlashcardForm } from "./resources/ResourceViews/Flashcard/FlashcardForm";
import { NoteForm } from "./resources/ResourceViews/Note/NoteForm";


type Props = {
    type: 'deck' | 'note' | 'flashcard';
    data: any;
    onCancel: () => void;
    onSave: (data: any) => void;
};

const GenericForm: React.FC<Props> = ({ type, data, onCancel, onSave }) => {
    if (type === 'deck') return <DeckForm data={data} onCancel={onCancel} onSave={onSave} />;
    if (type === 'note') return <NoteForm data={data} onCancel={onCancel} onSave={onSave} />;
    return <FlashcardForm data={data} onCancel={onCancel} onSave={onSave} />;
};

export default GenericForm;
