export type Question = {
  id: number;
  question: string;
  answer: string;
  options: string[];
};

export type UserAnswer = {
  questionId: number;
  userAnswer: string;
  timeSpent: number;
};

export type UserAnswers = Record<number, UserAnswer>;

interface EndSummaryProps {
  timeSpent: string;
  correctAnswers: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: Record<number, UserAnswer>;
}

interface QuestionRendererProps {
  question: Question;
  onAnswer: (questionId: number, answer: string) => void;
}

type AnswerReview = {
  questionId: number;
  question: string;
  correctAnswer: string;
  userAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number;
}
