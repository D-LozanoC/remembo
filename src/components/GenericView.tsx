import { DeckView } from "./resources/ResourceViews/Deck/DeckView";
import { FlashcardView } from "./resources/ResourceViews/Flashcard/FlashcardView";
import { NoteView } from "./resources/ResourceViews/Note/NoteView";


type Props = {
    type: 'deck' | 'note' | 'flashcard';
    data: any;
};

const GenericView: React.FC<Props> = ({ type, data }) => {
    if (type === 'deck') return <DeckView data={data} />;
    if (type === 'note') return <NoteView data={data} />;
    return <FlashcardView data={data} />;
};

export default GenericView;
