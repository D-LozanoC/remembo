import { QuestionRendererProps } from "@/types/study-session";

export function QuestionRenderer({ question, onAnswer }: QuestionRendererProps) {
  const handleAnswer = (answer: string) => {
    onAnswer(question.id, answer);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 flex py-12 justify-center">
      <section className="max-w-6xl h-max flex flex-col mx-auto text-center text-white py-10 bg-white backdrop-blur-lg rounded-lg shadow-lg p-10">
        <h2 className="text-xl text-black font-semibold mb-4">{question.question}</h2>
        {
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full justify-items-center pb-4">
            {question.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full h-full text-left text-black px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              >
                {option}
              </button>
            ))}
          </div>
        }
      </section>
    </main>
  );
}