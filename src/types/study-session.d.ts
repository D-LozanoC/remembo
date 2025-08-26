interface Question {
  id: number;
  question: string;
  answer: string;
  options: string[];
};

interface UserAnswer {
  questionId: number;
  userAnswer: string;
  timeSpent: number;
};

interface AnswerReview {
  questionId: number;
  question: string;
  correctAnswer: string;
  userAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number;
}

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

interface StartSummaryProps {
  questions: Array<Question>;
  lastSessionData: {
    date: string;
    accuracy: string;
  };
  malletName: string;
  onClick: () => void;
}
