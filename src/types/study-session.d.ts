interface Question {
  id: string;
  idx: number;
  question: string;
  answer: string;
  options: string[];
};

interface UserAnswer {
  questionId: string;
  questionIdx: number;
  userAnswer: string;
  timeSpent: number;
};

interface AnswerReview {
  questionId: string;
  questionIdx: number;
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
  onAnswer: (questionIdx: number, questionId:string, answer: string) => void;
}

interface StartSummaryProps {
  questions: Array<Question>;
  lastSessionData: {
    date: string;
    accuracy: string;
  } | null;
  malletName: string;
  onClick: () => void;
}