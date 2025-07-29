"use client";
import { useState } from 'react';

import { StartSummary } from '@/shared/sections/study-session/StartSummary';
import { QuestionRenderer } from '@/shared/sections/study-session/QuestionRenderer';

export default function StudySession() {
  const questions = [
    { id: 1, question: "What is calculus?", answer: "A branch of mathematics.", options: ["A branch of mathematics.", "A musical instrument."], type: "multiple-choice" },
    { id: 2, question: "What is the derivative?", answer: "A measure of how a function changes.", options: ["A measure of how a function changes.", "A type of integral.", "A mathematical constant."], type: "multiple-choice" },
  ]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const currentQuestion = currentQuestionIndex !== null ? questions[currentQuestionIndex] : null;
  console.log('User answer', userAnswers);

  const handleAnswer = (questionId: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));

    if (currentQuestionIndex !== null && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(null); // finaliza el examen
    }
  };

  const handleStartExam = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
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