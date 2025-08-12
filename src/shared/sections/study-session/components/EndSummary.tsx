import { Button } from '@/components/Button';
import { SummaryLabel } from '@/shared/sections/study-session/components/SummaryLabel';
import { getAnswersReview } from '@/shared/sections/study-session/utils';
import { EndSummaryProps } from '@/types/study-session';

export function EndSummary({
  timeSpent,
  correctAnswers,
  totalQuestions,
  questions,
  userAnswers
}: EndSummaryProps) {
  const reviewData = getAnswersReview(questions, userAnswers);

  return (
    <main className="min-h-screen md:min-w-[700px] bg-gradient-to-b from-indigo-600 to-purple-700 flex py-12 justify-center">
      <section className="max-w-6xl mx-auto text-center text-white py-10 bg-white backdrop-blur-lg rounded-lg shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800 pb-2">¡Sesión finalizada!</h1>

        <div className='flex flex-col gap-4'>
          <SummaryLabel title="Respuestas correctas" value={`${correctAnswers} / ${totalQuestions}`} />
          <SummaryLabel title="Tiempo total" value={timeSpent} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalle por pregunta</h2>
          <div className="space-y-3">
            {reviewData.map((item) => (
              <div
                key={item.questionId}
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
            ))}
          </div>
        </div>

        <Button className="mt-6 text-lg">
          Entendido!
        </Button>
      </section>
    </main>
  );
}
