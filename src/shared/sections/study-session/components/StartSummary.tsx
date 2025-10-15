import { Button } from '@/components/Button';
import { SummaryLabel } from '@/shared/sections/study-session/components/SummaryLabel';
import { StartSummaryProps } from '@/types/study-session';

export function StartSummary({ questions, lastSessionData, malletName, onClick }: StartSummaryProps) {
  const questionsCount = questions?.length || 0;
  const questionsTime = questionsCount * 5; // Assuming each question takes 5 seconds
  const mockData = [
    { title: 'Cantidad de tarjetas', value: `${questionsCount} tarjetas` },
    { title: 'Tiempo estimado', value: `${questionsTime} segundos` },
    { title: 'Mazo', value: malletName },
    { 
      title: lastSessionData ? 'Última sesión' : "¡Primera sesión!", 
      value: lastSessionData 
        ? `${lastSessionData.date} - ${lastSessionData.accuracy} acertado` 
        : '' 
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 flex py-12 justify-center">
      <section className="max-w-6xl mx-auto text-center text-white py-10 bg-white backdrop-blur-lg rounded-lg shadow-lg p-10">
        <h1 className="text-3xl font-bold text-gray-800 pb-2">¡Hora de repasar!</h1>
        <h2 className="text-base text-gray-800">Estas preguntas fueron elegidas especialmente para ti según tu ritmo de estudio.</h2>

        <div className="mt-4 space-y-4">
          {mockData.map((item, index) => (
            <SummaryLabel key={index} title={item.title} value={item.value} />
          ))}
        </div>

        <Button onClick={onClick} className="mt-4 text-lg">
          Empezar examen
        </Button>
      </section>
    </main>
  );
}