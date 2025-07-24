"use client";

import { SummaryPage } from '@/shared/sections/study-session/SummaryPage';

export default function StudySession() {
  const handleStartExam = () => {
    console.log("Starting exam...");
    // Logic to start the exam can be added here
  }

  return (
    <SummaryPage onClick={handleStartExam} />
  );
}