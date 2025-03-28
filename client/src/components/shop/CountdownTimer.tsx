"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  timeRemaining: string; //"1h 20m", "15m", "30s"
  onExpire?: () => void;
  className?: string;
}

export const CountdownTimer = ({
  timeRemaining,
  onExpire,
  className = "text-white text-xs",
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(parseTimeRemaining(timeRemaining));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft <= 0) return <span className="text-red-400">Expired</span>;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <span className={className}>
      {hours > 0 ? `${hours}h ` : ""}
      {minutes > 0 ? `${minutes}m ` : ""}
      {hours === 0 && minutes === 0 ? `${seconds}s` : ""}
    </span>
  );
};

function parseTimeRemaining(timeStr: string): number {
  const parts = timeStr.split(" ");
  let totalMs = 0;

  for (const part of parts) {
    if (part.includes("h")) {
      totalMs += parseInt(part) * 60 * 60 * 1000;
    } else if (part.includes("m")) {
      totalMs += parseInt(part) * 60 * 1000;
    } else if (part.includes("s")) {
      totalMs += parseInt(part) * 1000;
    }
  }

  return totalMs;
}
