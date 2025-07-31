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