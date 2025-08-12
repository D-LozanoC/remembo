import { Question, UserAnswer, UserAnswers } from '@/types/study-session';

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

export function getAnswersReview(
  questions: Question[],
  userAnswers: Record<number, UserAnswer>
) {
  return questions.map((q) => {
    const userAnswer = userAnswers[q.id]?.userAnswer || null;
    const isCorrect = userAnswer === q.answer;

    return {
      questionId: q.id,
      question: q.question,
      correctAnswer: q.answer,
      userAnswer,
      isCorrect,
      timeSpent: Math.round((userAnswers[q.id]?.timeSpent || 0) / 1000) // segundos
    };
  });
}
