import { Button } from '@/components/Button';
import { SummaryLabel } from '@/shared/sections/study-session/components/SummaryLabel';
import { getAnswersReview } from '@/shared/sections/study-session/utils';
import { ResponseLabel } from '@/shared/sections/study-session/components/ResponseLabel';
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
    <main className="min-h-screen  bg-gradient-to-b from-indigo-600 to-purple-700 flex py-12 justify-center">
      <section className="max-w-6xl text-center text-white py-10 bg-white backdrop-blur-lg rounded-lg shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800 pb-2">¡Sesión finalizada!</h1>

        <div className='flex flex-col gap-4'>
          <SummaryLabel title="Respuestas correctas" value={`${correctAnswers} / ${totalQuestions}`} />
          <SummaryLabel title="Tiempo total" value={timeSpent} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalle por pregunta</h2>
          <div className="space-y-3">
            {reviewData.map((item) => (
              <ResponseLabel key={item.questionId} item={item} />
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
