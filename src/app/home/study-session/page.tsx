"use client";
import { useState } from "react";

import { StartSummary } from "@/shared/sections/study-session/components/StartSummary";
import { EndSummary } from "@/shared/sections/study-session/components/EndSummary";
import { QuestionRenderer } from "@/shared/sections/study-session/components/QuestionRenderer";
import { calculateTotalTimeSpent, calculateCorrectAnswers } from "@/shared/sections/study-session/utils";
import { UserAnswer } from "@/types/study-session";
/*

Al comienzo de la sesión se ha de revisar en localStorage si hay una sesión en curso
Usar localStorage para guardar el progreso de la sesión en caso de que el usuario recargue la página o salga accidentalmente
Si la hay, cargar el estado de la sesión (pregunta actual, respuestas dadas, tiempos, etc) y continuar desde ahí
Si no la hay, hacer un fetch de a la sesión de estudio (preguntas, mazo, etc) y empezar desde el inicio
En cada pregunta, guardar en localStorage la pregunta actual, las respuestas dadas hasta ahora y los tiempos
Al finalizar la sesión, eliminar la sesión del localStorage
*/
export default function StudySession() {
  
  const questions = [
    { id: 1, question: "What is calculus?", answer: "A branch of mathematics.", options: ["A branch of mathematics.", "A musical instrument."] },
    { id: 2, question: "What is the derivative?", answer: "A measure of how a function changes.", options: ["A measure of how a function changes.", "A type of integral.", "A mathematical constant."] },
  ];
  const mallet = "Calculo diferencial"; // Example mallet name, replace with actual data if available
  const lastSession = {
    date: "01/10/2023",
    accuracy: "80%",
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = currentQuestionIndex !== null ? questions[currentQuestionIndex] : null;

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
      setIsFinished(true);
      setCurrentQuestionIndex(null);
      setQuestionStartTime(null);
    }
  };

  const handleStartExam = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuestionTimes({});
    setIsFinished(false);
    setQuestionStartTime(Date.now());
  };

  if (isFinished) {
    const totalTimeSpent = calculateTotalTimeSpent(questionTimes);
    const totalCorrect = calculateCorrectAnswers(questions, userAnswers);

    return (
      <EndSummary
        timeSpent={totalTimeSpent.formatted}
        correctAnswers={totalCorrect}
        totalQuestions={questions.length}
        questions={questions}
        userAnswers={userAnswers}
      />
    );
  }

  if (currentQuestion) {
    return <QuestionRenderer question={currentQuestion} onAnswer={handleAnswer} />;
  }

  return <StartSummary questions={questions} malletName={mallet} lastSessionData={lastSession} onClick={handleStartExam} />;
}