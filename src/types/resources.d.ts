import { Deck, Flashcard, Note } from "@prisma/client";

export type FullNote = Note & {
    flashcards: FullFlashcard[],
    _count: {
        flashcards: number
    }
}
export type FullDeck = Deck & {
    flashcards: Flashcard[]
}
export type FullFlashcard = Flashcard & {
    note?: Note,
    decks: Deck[]
}

export type Mode = 'view' | 'edit' | 'create' | 'relate' | 'delete'