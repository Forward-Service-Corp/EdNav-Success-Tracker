"use client";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function OneActivityInstantTest() {
  const { data: feed, mutate } = useSWR("/api/feed", fetcher);

  const addOneActivity = () => {
    const newActivity = {
      _id: crypto.randomUUID(),
      text: "🚨 ONE activity — instant injection test",
      user: "Drew",
      createdAt: new Date().toISOString(),
      comments: [],
      localOnly: true,
    };

    if (!feed) return;

    // Set it directly using m"ignorePatterns": [
    //     ".storybook/",
    //     "storybook-static/",
    //     "cypress/",
    //     "tests/"
    //   ],utate from useSWR
    mutate((current) => [newActivity, ...current], false);
  };

  return (
    <div className="space-y-4 p-4">
      <button onClick={addOneActivity} className="btn btn-primary">
        Add One Instant Activity
      </button>

      <ul className="space-y-2">
        {feed?.map((activity) => (
          <li key={activity._id} className="rounded border bg-gray-100 p-2">
            <div>
              <strong>{activity.user}</strong>: {activity.text}
            </div>
            {activity.localOnly && (
              <div className="text-sm text-orange-500">(local)</div>
            )}
          </li>
        )) || <li>Loading feed...</li>}
      </ul>
    </div>
  );
}
