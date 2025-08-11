import { Button } from '@/components/Button';
import { SummaryLabel } from '@/shared/sections/study-session/components/SummaryLabel';

interface EndSummaryProps {
  timeSpent: string;
  correctAnswers: number;
  totalQuestions: number;
}

export function EndSummary({ timeSpent, correctAnswers, totalQuestions }: EndSummaryProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 flex py-12 justify-center">
      <section className="max-w-6xl mx-auto text-center text-white py-10 bg-white backdrop-blur-lg rounded-lg shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800 pb-2">¡Sesión finalizada!</h1>

        <div className='flex flex-col gap-4'>
          <SummaryLabel title="Respuestas correctas" value={`${correctAnswers} / ${totalQuestions}`} />
          <SummaryLabel title="Tiempo total" value={timeSpent} />
        </div>

        <Button className="mt-4 text-lg">
          Entendido!
        </Button>
      </section>
    </main>
  );
}