type Question = {
  id: number;
  question: string;
  answer: string; // respuesta correcta
  options: string[];
};

type UserAnswers = Record<number, {
  questionId: number;
  userAnswer: string;
  timeSpent: number;
}>;

export function calculateTotalTimeSpent(questionTimes: Record<number, number>): {
  seconds: number;
  formatted: string;
} {
  const totalMilliseconds = Object.values(questionTimes).reduce((total, time) => total + time, 0);
  const totalSeconds = Math.round(totalMilliseconds / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formatted = minutes > 0
    ? `${minutes} min ${seconds} s`
    : `${seconds} s`;

  return {
    seconds: totalSeconds,
    formatted
  };
}

export function calculateCorrectAnswers(
  questions: Question[],
  userAnswers: UserAnswers
): number {
  return questions.reduce((total, question) => {
    const userAnswer = userAnswers[question.id];
    if (!userAnswer) return total;

    const isCorrect = userAnswer.userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    return isCorrect ? total + 1 : total;
  }, 0);
}
