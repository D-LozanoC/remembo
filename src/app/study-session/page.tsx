"use client";
import { useState } from 'react';

import { StartSummary } from '@/shared/sections/study-session/components/StartSummary';
import { QuestionRenderer } from '@/shared/sections/study-session/components/QuestionRenderer';
import { calculateTotalTimeSpent } from '@/shared/sections/study-session/utils';

type UserAnswer = {
  questionId: number;
  userAnswer: string;
  timeSpent: number;
};

export default function StudySession() {
  const questions = [
    { id: 1, question: "What is calculus?", answer: "A branch of mathematics.", options: ["A branch of mathematics.", "A musical instrument."] },
    { id: 2, question: "What is the derivative?", answer: "A measure of how a function changes.", options: ["A measure of how a function changes.", "A type of integral.", "A mathematical constant."] },
  ]

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});

  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});

  const currentQuestion = currentQuestionIndex !== null ? questions[currentQuestionIndex] : null;
  console.log('User answer ', userAnswers);

  const handleAnswer = (questionId: number, answer: string) => {

    if (questionStartTime !== null) {
      const timeSpentMs = Date.now() - questionStartTime;

      const answerData: UserAnswer = {
        questionId,
        userAnswer: answer,
        timeSpent: timeSpentMs,
      };

      setUserAnswers((prev) => ({
        ...prev,
        [questionId]: answerData,
      }));

      setQuestionTimes((prev) => ({
        ...prev,
        [questionId]: timeSpentMs,
      }));
    }

    if (currentQuestionIndex !== null && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      setCurrentQuestionIndex(null);
      setQuestionStartTime(null);
      const totalTimeSpent = calculateTotalTimeSpent(questionTimes);
      console.log('Tiempo total gastado en preguntas:', totalTimeSpent.formatted, 'segundos');
    }
  };

  const handleStartExam = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuestionTimes({});
    setQuestionStartTime(Date.now());
  };

  if (currentQuestion) {
    return (
      <QuestionRenderer
        question={currentQuestion}
        onAnswer={handleAnswer}
      />
    );
  }

  return (
    <StartSummary onClick={handleStartExam} />
  );
}