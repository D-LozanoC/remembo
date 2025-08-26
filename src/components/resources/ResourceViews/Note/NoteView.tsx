import { FullFlashcard, FullNote } from "@/types/resources";
import MDEditor from '@uiw/react-md-editor';

export default function ({
    data,
    onClick
}: {
    data: FullNote,
    onClick?: (data: FullFlashcard) => void
}) {
    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <header className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{data.title}</h1>
                <div className="flex flex-wrap gap-2 text-sm sm:text-base text-gray-500">
                    <span><strong>Subject:</strong> {data.subject}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                        {data.topic}
                    </span>
                </div>
            </header>

            {/* Content */}
            <article className="prose prose-sm sm:prose-lg text-gray-700 whitespace-pre-line">
                <div data-color-mode="light">
                    <MDEditor.Markdown source={data.content} />
                </div>
            </article>

            {/* Timestamps */}
            <section className="flex flex-col sm:flex-row sm:space-x-4 text-xs sm:text-sm text-gray-500">
                <div><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</div>
                <div><strong>Updated:</strong> {new Date(data.updatedAt).toLocaleString()}</div>
            </section>

            {/* Flashcards */}
            <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    Flashcards ({data._count.flashcards})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.flashcards.map(card => (
                        <div
                            key={card.id}
                            onClick={() => onClick?.({ ...card, note: data })}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                        >
                            <p className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{card.question}</p>
                            <div className="flex flex-wrap gap-2">
                                {card.answers.map((ans, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm"
                                    >
                                        {ans}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

