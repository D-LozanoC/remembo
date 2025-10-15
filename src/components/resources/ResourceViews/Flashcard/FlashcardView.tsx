import { FullFlashcard } from "@/types/resources";

export default function FlashcardView ({
    data
}: {
    data: FullFlashcard
}) {
    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Info */}
            <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{data.question}</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                    Creado: {new Date(data.createdAt).toLocaleDateString()} | Actualizado: {new Date(data.updatedAt).toLocaleDateString()}
                </p>
            </div>

            {/* Answers */}
            <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Respuestas:</h3>
                <ul className="list-disc list-inside text-sm sm:text-base space-y-1 text-gray-700">
                    {data.answers.map((ans, idx) => (
                        <li key={idx}>{ans}</li>
                    ))}
                </ul>
            </div>

            {/* Nota asociada */}
            {data.note && (
                <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Nota Asociada:</h3>
                    <p className="font-medium text-gray-800">{data.note.title}</p>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-3">{data.note.content}</p>
                    <div className="text-xs sm:text-sm text-gray-500">
                        Tema: {data.note.topic} | Materia: {data.note.subject}
                    </div>
                </div>
            )}

            {/* Decks asociados */}
            {data.decks && data.decks?.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Decks Asociados:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data.decks.map(deck => (
                            <div key={deck.id} className="p-3 bg-gray-50 rounded-lg border">
                                <p className="font-medium text-gray-800">{deck.title}</p>
                                <p className="text-xs sm:text-sm text-gray-500">Tema: {deck.topic} | Materia: {deck.subject}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
