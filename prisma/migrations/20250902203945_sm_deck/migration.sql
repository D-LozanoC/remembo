-- CreateTable
CREATE TABLE "public"."DeckAlgorithmState" (
    "deckId" TEXT NOT NULL,
    "easiness" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastScore" INTEGER NOT NULL DEFAULT 0,
    "targetSecondsPerItem" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeckAlgorithmState_pkey" PRIMARY KEY ("deckId")
);

-- CreateTable
CREATE TABLE "public"."DeckFlashcard" (
    "deckId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),

    CONSTRAINT "DeckFlashcard_pkey" PRIMARY KEY ("deckId","flashcardId")
);

-- CreateTable
CREATE TABLE "public"."StudySessionDeck" (
    "studySessionId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "accuracy" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "nextReview" TIMESTAMP(3),

    CONSTRAINT "StudySessionDeck_pkey" PRIMARY KEY ("studySessionId","deckId")
);

-- CreateTable
CREATE TABLE "public"."StudySessionFlashcard" (
    "studySessionId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "deckId" TEXT,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER,

    CONSTRAINT "StudySessionFlashcard_pkey" PRIMARY KEY ("studySessionId","flashcardId")
);

-- CreateIndex
CREATE INDEX "DeckFlashcard_flashcardId_idx" ON "public"."DeckFlashcard"("flashcardId");

-- CreateIndex
CREATE INDEX "StudySessionDeck_deckId_idx" ON "public"."StudySessionDeck"("deckId");

-- CreateIndex
CREATE INDEX "StudySessionFlashcard_flashcardId_idx" ON "public"."StudySessionFlashcard"("flashcardId");

-- AddForeignKey
ALTER TABLE "public"."DeckAlgorithmState" ADD CONSTRAINT "DeckAlgorithmState_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeckFlashcard" ADD CONSTRAINT "DeckFlashcard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeckFlashcard" ADD CONSTRAINT "DeckFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "public"."Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionDeck" ADD CONSTRAINT "StudySessionDeck_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "public"."StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionDeck" ADD CONSTRAINT "StudySessionDeck_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionFlashcard" ADD CONSTRAINT "StudySessionFlashcard_studySessionId_fkey" FOREIGN KEY ("studySessionId") REFERENCES "public"."StudySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionFlashcard" ADD CONSTRAINT "StudySessionFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "public"."Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudySessionFlashcard" ADD CONSTRAINT "StudySessionFlashcard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
