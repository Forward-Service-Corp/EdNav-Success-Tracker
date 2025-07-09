import React from "react";
import TeamGoalProgressBar from "@/components/TeamGoalProgressBar";

function DashboardContainer() {
  return (
    <div
      className={`bg-base-200 h-full w-full items-center justify-center rounded p-6 shadow`}
    >
      <div className={`box-border grid h-full w-full grid-cols-4 gap-6`}>
        <div className={`bg-base-100 col-span-full rounded shadow`}>
          <div className={`flex h-full flex-col items-center justify-center`}>
            <div className={`text-4xl font-bold`}>Dashboard</div>
            <div className={`text-base-content`}>This is the dashboard</div>
          </div>
        </div>
        <div className={`bg-base-100 col-span-full rounded shadow`}>
          <div className={`flex h-full flex-col items-center justify-center`}>
            <TeamGoalProgressBar onUpdate={undefined} />
          </div>
        </div>
        <div className={`bg-base-100 col-span-2 rounded shadow`}>
          <div className={`flex h-full flex-col items-center justify-center`}>
            <div className={`text-4xl font-bold`}>Clients</div>
            <div className={`text-base-content`}>
              This is the clients section
            </div>
          </div>
        </div>
        <div className={`bg-base-100 col-span-2 rounded shadow`}>
          <div className={`flex h-full flex-col items-center justify-center`}>
            <div className={`text-4xl font-bold`}>Activities</div>
            <div className={`text-base-content`}>
              This is the activities section
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;