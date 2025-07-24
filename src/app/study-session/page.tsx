"use client";

import { StartSummary } from '@/shared/sections/study-session/StartSummary';

export default function StudySession() {
  /*const questions = [
    { id: 1, question: "What is calculus?", answer: "A branch of mathematics.", options: ["A branch of mathematics.", "A type of food.", "A musical instrument."], type: "multiple-choice" },
    { id: 2, question: "What is the derivative?", answer: "A measure of how a function changes.", options: ["A measure of how a function changes.", "A type of integral.", "A mathematical constant."], type: "multiple-choice" },
    { id: 3, question: "Explain the Fundamental Theorem of Calculus.", answer: "It connects differentiation and integration.", options: ["It connects differentiation and integration.", "It is a type of limit.", "It is a method for solving equations."], type: "short-answer" },
    { id: 4, question: "Calculate the integral of x^2.", answer: "The integral is (1/3)x^3 + C.", options: [], type: "calculation" },
    { id: 5, question: "Calculus is a science", answer: "False", options: ["True", "False"], type: "true-false" }
  ] */

  const handleStartExam = () => {

  }

  return (
    <StartSummary onClick={handleStartExam} />
  );
}