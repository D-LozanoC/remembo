import { AnswerReview } from "@/types/study-session"

export function ResponseLabel({ item }: { item: AnswerReview }) {
  return (
    <div
      className={`p-4 rounded-lg border ${item.isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'} text-left`}
    >
      <p className="font-medium text-gray-800">
        {item.isCorrect ? '✅' : '❌'} {item.question}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Tu respuesta:</strong> {item.userAnswer ?? 'Sin respuesta'}
      </p>
      {!item.isCorrect && (
        <p className="text-sm text-gray-600">
          <strong>Correcta:</strong> {item.correctAnswer}
        </p>
      )}
      <p className="text-xs text-gray-500">
        Tiempo: {item.timeSpent} segundos
      </p>
    </div>
  )
}