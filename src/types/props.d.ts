import { Dispatch, SetStateAction } from "react"
import { FullDeck, FullFlashcard, FullNote } from "./resources"
import { Tab } from "./enums"
import { IconType } from "react-icons"
import { Mode } from "./resources"
import { Note, Deck, Flashcard } from "@prisma/client"

export type paginationProps = {
    page: number,
    setPage: Dispatch<SetStateAction<number>>,
    perPage: number,
    setPerPage: Dispatch<SetStateAction<number>>,
    totalPages: number
}

export type collectionProps = {
    items: FullNote[] | FullDeck[] | FullFlashcard[],
    handleItemClick: (data: FullNote | FullDeck | FullFlashcard) => void
}

export type filtersProps = {
    search: string,
    setSearch: Dispatch<SetStateAction<string>>,
    setPage: Dispatch<SetStateAction<number>>,
    subject: string,
    setSubject: Dispatch<SetStateAction<string>>,
    tab: Tab,
    subjects: string[],
    setOrder: Dispatch<SetStateAction<'asc' | 'desc'>>,
    order: 'asc' | 'desc',
    setMode: Dispatch<SetStateAction<Mode>>,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    setItem: Dispatch<SetStateAction<{ data: FullNote | FullDeck | FullFlashcard | null, dataType: Tab.Decks | Tab.Flashcards | Tab.Notes } | null>>
}

export type dialogProps = {
    isOpen: boolean,
    children: React.ReactNode,
    style?: string
}

export interface resourceProps {
    item: {
        data: FullNote | FullDeck | FullFlashcard | null,
        dataType: Tab.Decks | Tab.Flashcards | Tab.Notes
    } | null,
    setItem: Dispatch<SetStateAction<{ data: FullNote | FullDeck | FullFlashcard | null, dataType: Tab.Decks | Tab.Flashcards | Tab.Notes } | null>>
    setIsOpen: Dispatch<SetStateAction<boolean>>
    handleUpdate: (data: Partial<FullNote | FullDeck | FullFlashcard>) => void
    handleDelete: (id: string) => void
    handleRelate: ({ deck, flashcards }: { deck: Partial<Deck>, flashcards: Partial<Flashcard>[] }) => void
    handleCreate: (data: Partial<Note | Deck | Flashcard>) => void
    mode: Mode,
    setMode: Dispatch<SetStateAction<Mode>>
}

export type noteProps = {
    data: FullNote;
    mode: Mode;
    actions: {
        handleUpdate: (data: Partial<FullNote>) => void;
        handleDelete: (id: string) => void;
        handleCreate: (data: Partial<Note>) => void;
        onClick?: (data: Flashcard) => void
    }
}

export type deckProps = {
    data: FullDeck;
    mode: Mode;
    actions: {
        handleUpdate: (data: Partial<FullDeck>) => void;
        handleDelete: (id: string) => void;
        handleCreate: (data: Partial<Deck>) => void;
        handleRelate: ({ deck, flashcards }: { deck: Partial<Deck>, flashcards: Partial<Flashcard>[] }) => Promise<void>;
    }
}

export type flashcardProps = {
    data: FullFlashcard;
    mode: Mode;
    actions: {
        handleUpdate: (data: Partial<FullFlashcard>) => void;
        handleDelete: (id: string) => void;
        handleCreate: (data: Partial<Flashcard>) => void;
    }
}

export interface ActionButtonProps {
    icon: IconType;
    label?: string;
    variant: 'close' | 'edit' | 'delete' | 'back' | 'relate';
    onClick: () => void;
}

export interface ActionToolbarProps {
    mode: 'view' | 'edit' | 'delete' | 'relate' | 'create';
    setMode: Dispatch<SetStateAction<'view' | 'edit' | 'delete' | 'relate' | 'create'>>;
    handleOnClose: () => void;
    itemType?: Tab;
}

export interface FeedbackMessageProps {
    type: "success" | "error";
    message: ReactNode;
    onDismiss?: () => void;
    className?: string;
    iconSize?: number;
}