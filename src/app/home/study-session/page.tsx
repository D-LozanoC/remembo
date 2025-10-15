"use client";
import { useEffect, useState } from "react";

import { StartSummary } from "@/shared/sections/study-session/components/StartSummary";
import { EndSummary } from "@/shared/sections/study-session/components/EndSummary";
import { QuestionRenderer } from "@/shared/sections/study-session/components/QuestionRenderer";
import {
  calculateTotalTimeSpent,
  calculateCorrectAnswers,
  loadSessionProgress,
  StudySessionState,
  saveSessionProgress,
  saveUserAnswer,
  clearSessionProgress,
  getAnswersPayload,
  getFinishPayload,
} from "@/shared/sections/study-session/utils";
import { Question, UserAnswer } from "@/types/study-session";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "@/components/Loader";
import { AnswerPayload } from "@/app/api/study-session/answer/route";
import { FinishPayload } from "@/app/api/study-session/finish/route";

export default function StudySession() {
  const session = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [mallet, setMallet] = useState<string | null>(null);
  const [deckID, setDeckId] = useState<string>("");
  const [lastSession, setLastSession] = useState<{
    date: string;
    accuracy: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados de progreso
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const [postFetch, setPostFetch] = useState<{ answers: boolean, finish: boolean }>({ answers: false, finish: false })

  // Carga al reanudar
  useEffect(() => {
    if (!sessionId) return;
    const saved = loadSessionProgress(sessionId);
    console.log({ saved })
    if (saved) {
      setQuestions(saved.questions);
      setMallet(saved.mallet);
      setLastSession(saved.lastSession);
      setCurrentQuestionIndex(saved.currentQuestionIndex);
      setUserAnswers(saved.userAnswers);
      setQuestionTimes(saved.questionTimes);
      setQuestionStartTime(saved.questionStartTime);
      setIsFinished(saved.isFinished);
      setIsLoading(false);
    }
  }, [sessionId]);

  // Fetch inicial
  useEffect(() => {
    if (questions.length > 0) return; // revisa si esta cargado en localStorage

    const fetchSessionData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/study-session?sessionId=${sessionId}`);
        if (!res.ok) {
          throw new Error(`Error fetching session data: ${res.statusText}`);
        }
        const { questions, mallet, lastSession, deckId } = await res.json();

        if (questions.length > 0) setQuestions(questions);
        if (mallet) setMallet(mallet);
        if (lastSession) setLastSession(lastSession);
        if (deckId) setDeckId(deckId)
      } catch (error: unknown) {
        console.error("Failed to fetch session data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, questions.length]);

  useEffect(() => {
    if (isFinished && sessionId) {
      const sendAnswers = async () => {
        const answersPayload: AnswerPayload = getAnswersPayload(questions, userAnswers, sessionId);
        const finishPayload: FinishPayload = getFinishPayload(answersPayload, deckID)
        try {
          const res_answer = await fetch("/api/study-session/answer", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(answersPayload),
          });
          const res_finish = await fetch("/api/study-session/finish", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finishPayload),
          })
          if (res_answer.ok) {
            setPostFetch(prev => ({ ...prev, answers: true }));
          }
          if (res_finish.ok) {
            setPostFetch(prev => ({ ...prev, finish: true }));
          }
        } catch (error) {
          console.error("Error fetching /api/study-session/answer: ", error);
        }
      };
      sendAnswers();
    }
  }, [isFinished]);

  const currentQuestion = currentQuestionIndex !== null ? questions[currentQuestionIndex] : null;

  if (!sessionId) {
    router.push("/home/study");
    return null;
  }
  // Persiste el estado en el localStorage
  const persistState = (partial?: Partial<StudySessionState>) => {
    console.log("Persisting state: ", partial);

    const state: StudySessionState = {
      questions,
      mallet,
      lastSession,
      currentQuestionIndex,
      userAnswers,
      questionTimes,
      questionStartTime,
      isFinished,
      ...partial,
    };
    try {
      saveSessionProgress(sessionId, state);

    } catch (error) {
      console.error("Error saving session progress:", error);
    }
  };

  // Usado para resolver cada pregunta
  const handleAnswer = (questionIdx: number, questionId: string, answer: string) => {
    if (questionStartTime !== null) {
      const timeSpentMs = Date.now() - questionStartTime;

      const answerData: UserAnswer = {
        questionId,
        questionIdx,
        userAnswer: answer,
        timeSpent: timeSpentMs,
      };

      // Guardar en estados locales
      const newUserAnswers = {
        ...userAnswers,
        [questionIdx]: answerData,
      };

      const newQuestionTimes = {
        ...questionTimes,
        [questionIdx]: timeSpentMs,
      };

      setUserAnswers(newUserAnswers);
      setQuestionTimes(newQuestionTimes);

      persistState({
        userAnswers: newUserAnswers,
        questionTimes: newQuestionTimes,
      })

      // Guardar respuesta en localStorage
      saveUserAnswer(sessionId, questionIdx, answerData, timeSpentMs);
    }

    if (
      currentQuestionIndex !== null &&
      currentQuestionIndex < questions.length - 1
    ) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionStartTime(Date.now());

      persistState({
        currentQuestionIndex: nextIndex,
        questionStartTime: Date.now(),
      });
    } else {
      // Momento en el que finaliza la sesión.
      setIsFinished(true);
      setCurrentQuestionIndex(null);
      setQuestionStartTime(null);

      persistState({
        isFinished: true,
        currentQuestionIndex: null,
        questionStartTime: null,
      });

      // Elimina la sesión del localStorage
      clearSessionProgress(sessionId);
    }
  };

  // Inicio de la sesión
  const handleStartExam = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuestionTimes({});
    setIsFinished(false);
    const startTime = Date.now();
    setQuestionStartTime(startTime);

    persistState({
      currentQuestionIndex: 0,
      userAnswers: {},
      questionTimes: {},
      isFinished: false,
      questionStartTime: startTime,
    });
  };

  if (session.data?.user == null) return <div>Please log in to start a study session.</div>;

  if (isLoading) {
    return (
      <main className="flex justify-center items-center h-screen w-screen">
        <Loader />
      </main>
    );
  }

  if (isFinished) {
    const totalTimeSpent = calculateTotalTimeSpent(questionTimes);
    const totalCorrect = calculateCorrectAnswers(questions, userAnswers);

    if (!postFetch.answers) {
      return (
        <div className="flex items-center justify-center h-screen w-screen">
          <span className="text-red-600 font-medium">
            Hubo un error al cargar las respuestas
          </span>
        </div>
      );
    }

    if (!postFetch.finish) {
      return (
        <div className="flex items-center justify-center h-screen w-screen">
          <span className="text-gray-600 font-medium">
            Cargando información…
          </span>
        </div>
      );
    }

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
    return (
      <QuestionRenderer question={currentQuestion} onAnswer={handleAnswer} />
    );
  }

  return (
    <StartSummary
      questions={questions}
      malletName={mallet ?? ""}
      lastSessionData={lastSession}
      onClick={handleStartExam}
    />
  );
}
