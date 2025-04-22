// CompletionCheckmark.tsx

import React from "react";

type Props = {
  completed: boolean;
};

export const CompletionCheckmark: React.FC<Props> = ({ completed }) => {
  CompletionCheckmark.displayName = "CompletionCheckmark";
  return (
    <span
      className={`inline-block w-4 h-4 rounded-full ${
        completed ? "bg-green-500" : "bg-gray-300"
      }`}
      aria-label={completed ? "Completed" : "Incomplete"}
    />
  );
};


// parameters: {
//   docs: {
//     description: {
//       component: 'A tiny dot that indicates completion status. Used throughout the Tracker UI to quickly show completion at-a-glance.',
//     },
//   },
// },