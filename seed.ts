import { Subjects } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { prisma } from '@/config/prisma';

const userId = 'cm8dh9m6b0002w7zknzyw8o3p';

// Enum de Subjects como array
const subjects = Object.values(Subjects);

async function main() {
    console.log('Seeding data...');

    // Crear 10 notas
    const createdNotes = [];
    for (let i = 0; i < 20; i++) {
        const note = await prisma.note.create({
            data: {
                subject: subjects[i % subjects.length],
                content: faker.lorem.paragraphs(2),
                title: faker.lorem.sentence(),
                topic: faker.lorem.word(),
                userId
            },
        });
        createdNotes.push(note);
    }

    // Crear 10 flashcards
    const createdFlashcards = [];
    for (let i = 0; i < 20; i++) {
        const flashcard = await prisma.flashcard.create({
            data: {
                question: faker.lorem.sentence(),
                answers: [faker.lorem.word(), faker.lorem.word()],
                isDerived: true,
                userId,
                noteId: createdNotes[i % createdNotes.length].id,
            },
        });
        createdFlashcards.push(flashcard);
    }

    // Crear 10 decks
    for (let i = 0; i < 20; i++) {
        // Asociar aleatoriamente 2 notas y 2 flashcards
        const randomFlashcards = faker.helpers.arrayElements(createdFlashcards, 2);

        await prisma.deck.create({
            data: {
                title: faker.lorem.sentence(),
                topic: faker.lorem.word(),
                subject: subjects[i % subjects.length],
                userId,
                flashcards: {
                    connect: randomFlashcards.map((fc) => ({ id: fc.id })),
                },
            },
        });
    }

    console.log('✅ Datos de ejemplo creados correctamente.');
}

main()
    .catch((e) => {
        console.error('❌ Error al crear los datos:', e);
        process.exit(1);
    })
