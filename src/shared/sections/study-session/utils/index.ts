import { AnswerPayload } from '@/app/api/study-session/answer/route';
import { FinishPayload } from '@/app/api/study-session/finish/route';
import { Question, UserAnswer, UserAnswers, AnswerReview } from '@/types/study-session';

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
    const userAnswer = userAnswers[question.idx];
    if (!userAnswer) return total;

    const isCorrect = userAnswer.userAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();
    return isCorrect ? total + 1 : total;
  }, 0);
}

export function getAnswersPayload(
  questions: Question[],
  userAnswers: UserAnswers,
  studySession: string
): AnswerPayload {
  const questionsPayload = questions.map((q) => {
    const userAnswer = userAnswers[q.idx];
    const isCorrect = userAnswer.userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
    return {
      studySessionId: studySession,
      flashcardId: q.id,
      isCorrect,
      timeSpent: userAnswer.timeSpent
    };
  });

  return {
    questions: questionsPayload
  };
}

export function scheduleAtNoon(baseDate: Date, days: number): Date {
  const roundedDays = Math.round(days);
  const newDate = new Date(baseDate);
  newDate.setDate(newDate.getDate() + roundedDays);
  newDate.setHours(12, 0, 0, 0);
  return newDate;
}

export function I(rep: number, ef: number, q: number): number {
  return Math.pow(ef * q, rep - 1);
}

export function getFinishPayload(
  answerPayload: AnswerPayload,
  deckId: string
): FinishPayload {
  let duration = 0
  let correct = 0
  for (const q of answerPayload.questions) {
    duration += q.timeSpent || 0
    if (q.isCorrect) correct++
  }
  const accuracy = answerPayload.questions.length > 0 ? (correct / answerPayload.questions.length) * 100 : 0
  let qTotal = 0
  for (const q of answerPayload.questions) {
    if (!q.timeSpent) continue;
    if (q.isCorrect) qTotal+= Math.max(0, 1 - (q.timeSpent/30000));
  }
  const avgQ = qTotal / answerPayload.questions.length
  return {
    deckId,
    accuracy,
    duration,
    sessionId: answerPayload.questions[0].studySessionId,
    q: avgQ,
    flashcardsIds: answerPayload.questions.map(q => q.flashcardId)
  }
}

export function getAnswersReview(
  questions: Question[],
  userAnswers: Record<number, UserAnswer>
): AnswerReview[] {
  return questions.map((q) => {
    const userAnswer = userAnswers[q.idx]?.userAnswer || null;
    const isCorrect = userAnswer === q.answer;

    return {
      questionId: q.id,
      questionIdx: q.idx,
      question: q.question,
      correctAnswer: q.answer,
      userAnswer,
      isCorrect,
      timeSpent: Math.round((userAnswers[q.idx]?.timeSpent || 0) / 1000) // segundos
    };
  });
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) as T : null;
}

// Tipo del estado completo de la sesión
export interface StudySessionState {
  questions: Question[];
  mallet: string | null;
  lastSession: { date: string; accuracy: string } | null;

  currentQuestionIndex: number | null;
  userAnswers: UserAnswers;
  questionTimes: Record<number, number>;
  questionStartTime: number | null;
  isFinished: boolean;
}

/**
 * Obtiene la key en localStorage para una sessionId concreta
 */
function getSessionKey(sessionId: string): string {
  return `studySession:${sessionId}`;
}

/**
 * Guarda todo el estado de la sesión
 */
export function saveSessionProgress(sessionId: string, state: StudySessionState): void {
  setItem<StudySessionState>(getSessionKey(sessionId), state);
}

/**
 * Carga el estado de la sesión (o null si no existe)
 */
export function loadSessionProgress(sessionId: string): StudySessionState | null {
  return getItem<StudySessionState>(getSessionKey(sessionId));
}

/**
 * Borra la sesión del localStorage (por ejemplo al terminarla)
 */
export function clearSessionProgress(sessionId: string): void {
  localStorage.removeItem(getSessionKey(sessionId));
}

/**
 * Actualiza campos parciales del estado (merge)
 */
export function updateSessionProgress(
  sessionId: string,
  partial: Partial<StudySessionState>
): StudySessionState | null {
  const current = loadSessionProgress(sessionId);
  if (!current) return null;
  const newState = { ...current, ...partial };
  saveSessionProgress(sessionId, newState);
  return newState;
}

/**
 * Guarda una respuesta del usuario para una pregunta específica
 */
export function saveUserAnswer(
  sessionId: string,
  questionId: number,
  answerData: UserAnswer,
  questionTime?: number
): StudySessionState | null {
  const current = loadSessionProgress(sessionId);
  if (!current) return null;

  const updatedAnswers: UserAnswers = {
    ...current.userAnswers,
    [questionId]: answerData,
  };

  const updatedTimes: Record<number, number> = {
    ...current.questionTimes,
    ...(questionTime ? { [questionId]: questionTime } : {}),
  };

  const newState: StudySessionState = {
    ...current,
    userAnswers: updatedAnswers,
    questionTimes: updatedTimes,
  };

  saveSessionProgress(sessionId, newState);
  return newState;
}

/**
 * Marca la sesión como terminada y la elimina del localStorage.
 */
export function finishSession(sessionId: string): void {
  clearSessionProgress(sessionId);
}