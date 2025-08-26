import { collectionProps } from "@/types/props"
import { FullFlashcard, FullNote, FullDeck } from "@/types/resources"

export default function Collection({
    items,
    handleItemClick
}: collectionProps) {
    const isFlashcard = (item: FullNote | FullDeck | FullFlashcard): item is FullFlashcard => {
        return 'question' in item;
    };

    const isNote = (item: FullNote | FullDeck | FullFlashcard): item is FullNote => {
        return 'title' in item && !('question' in item);
    };

    const isDeck = (item: FullNote | FullDeck | FullFlashcard): item is FullDeck => {
        return 'title' in item;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-2">
            {items.map((item) => (
                <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                >
                    <div className="h-32 sm:h-36 flex items-center justify-center text-gray-300 text-4xl">
                        {isFlashcard(item) && '❓' || isNote(item) && '📄' || isDeck(item) && '📓'}
                    </div>
                    <div className="p-4 text-center font-medium text-indigo-700 truncate">
                        {isFlashcard(item) ? item.question : isNote(item) ? item.title : isDeck(item) ? item.title : 'Untitled'}
                    </div>
                </div>
            ))}
        </div>
    )
}
