"use client";
import { useState } from "react";
// import { cn } from '../lib/utils'
// import { Progress } from 'daisyui'
import { useSession } from "next-auth/react";

export default function TeamGoalProgressBar({ initialProgress = 0, onUpdate }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [progress, setProgress] = useState(initialProgress);

  const handleChange = (e) => {
    const value = Number(e.target.value);
    setProgress(value);
    onUpdate?.(value);
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Team Goal Progress</span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>

      <progress
        className="progress progress-success w-full"
        value={progress}
        max="100"
      ></progress>

      {isAdmin && (
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleChange}
          className="range range-success"
        />
      )}

      {progress === 100 && (
        <div className="mt-2 text-center text-lg font-bold text-green-600">
          🎉 Goal Achieved! 🎯
        </div>
      )}
    </div>
  );
}
