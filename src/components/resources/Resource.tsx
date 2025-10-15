import { Tab } from "@/types/enums"
import { resourceProps } from "@/types/props"
import { FullDeck, FullFlashcard, FullNote } from "@/types/resources";
import { useEffect, useState } from "react";
import Note from "./ResourceViews/Note/Note";
import Deck from "./ResourceViews/Deck/Deck";
import Flashcard from "./ResourceViews/Flashcard/Flashcard";
import { Loader } from "@/components/Loader";
import ActionToolBar from "./common/ActionToolbar";

export default function Resource({
    item,
    setItem,
    setIsOpen,
    handleUpdate,
    handleDelete,
    handleRelate,
    handleCreate,
    handleValidate,
    handleDerivateFlashcards,
    mode,
    setMode,
    isDisabled
}: resourceProps) {
    const [resource, setResource] = useState<FullNote | FullDeck | FullFlashcard | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchResource = async () => {
            try {
                setIsLoading(true)
                if (!item?.data) return
                setResource(item.data)
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        fetchResource()
    }, [item?.data])

    const View = isLoading ? (
        <div className="flex items-center justify-center py-8">
            <Loader />
        </div>
    ) : (
        <>
            {item?.dataType === Tab.Notes && (
                <Note
                    data={resource as FullNote}
                    mode={mode}
                    actions={{ handleUpdate, handleDelete, handleCreate, handleValidate, handleDerivateFlashcards, setItem }}
                />
            )}
            {item?.dataType === Tab.Decks && (
                <Deck
                    data={resource as FullDeck}
                    mode={mode}
                    actions={{ handleUpdate, handleDelete, handleCreate, handleRelate }}
                />
            )}
            {item?.dataType === Tab.Flashcards && (
                <Flashcard
                    data={resource as FullFlashcard}
                    mode={mode}
                    actions={{ handleUpdate, handleDelete, handleCreate }}
                />
            )}
        </>
    )

    const handleOnClose = () => {
        setIsOpen(false)
        setResource(null)
        setMode('view')
        setItem(null)
    }

    return (
        <div
            className="
          relative flex flex-col bg-white rounded-lg shadow-lg
          w-full max-w-full sm:max-w-2xl
          max-h-full sm:max-h-[80vh] overflow-auto mx-auto
        "
        >
            <div className="sticky top-0 z-10 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <ActionToolBar
                    mode={mode}
                    setMode={setMode}
                    handleOnClose={handleOnClose}
                    itemType={item?.dataType}
                    isDisabled={isDisabled}
                />
            </div>

            <div className="p-4">
                {View}
            </div>
        </div>
    )
}
