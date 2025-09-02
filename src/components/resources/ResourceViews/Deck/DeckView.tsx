import { FullDeck } from "@/types/resources";

export default function DeckView ({ data }: { data: FullDeck }) {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
            {/* Header */}
            <div className="space-y-4 border-b pb-4 sm:pb-6">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">{data.title}</h1>

                <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs sm:text-sm">
                        📚 {data.subject}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs sm:text-sm">
                        🏷️ {data.topic}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-6 text-xs sm:text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>Creado: {new Date(data.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>🔄</span>
                        <span>Actualizado: {new Date(data.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Flashcards Section */}
            <div>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Flashcards ({data.flashcards.length})
                </h2>
                <div className="grid gap-4">
                    {data.flashcards.map(fc => (
                        <div
                            key={fc.id}
                            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md border hover:border-indigo-100 transition"
                        >
                            <h3 className="text-base text-gray-800 sm:text-lg font-semibold mb-2 flex items-center">
                                <span className="mr-2">❓</span>{fc.question}
                            </h3>
                            <ul className="list-disc list-inside text-sm sm:text-base space-y-1 ml-4 mb-4 text-gray-700">
                                {fc.answers.map((ans, i) => (
                                    <li key={i}>{ans}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}