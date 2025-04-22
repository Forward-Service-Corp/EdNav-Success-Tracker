import React, { useEffect, useState } from "react";
import { SignIn } from "@/components/sign-in";

export default function MetricsHome() {
  const [metrics, setMetrics] = useState([{ name: "Clients", value: 0 }]);

  const fetchMetrics = async () => {
    const response = await fetch("/api/metrics");
    const data = await response.json();
    setMetrics([
      { name: "Total Active Clients", value: data.totalClients },
      {
        name: " Enrollments Last Month",
        value:
          data.enrolledClientsPerMonth[data.enrolledClientsPerMonth.length - 1]
            .count,
      },
      {
        name: " Graduations Last Month",
        value:
          data.graduatedClientsPerMonth[
            data.graduatedClientsPerMonth.length - 1
          ].count,
      },
      {
        name: " Referrals Last Month",
        value:
          data.clientsReferredPerMonth[data.clientsReferredPerMonth.length - 1]
            .count,
      },
    ]);
  };

  useEffect(() => {
    fetchMetrics().then();
  }, []);

  return (
    <div className="bg-white py-14 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-8xl font-light text-balance uppercase">
              <span className={`font-bold italic`}>
                <span className={`text-info relative drop-shadow`}>ED</span>
                <span className={`text-warning mr-0 -ml-4`}>NAV</span>
              </span>{" "}
              <span className={`block text-4xl font-light uppercase`}>
                Success Tracker
              </span>
            </h2>
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-0.5 overflow-hidden rounded text-center sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col bg-gray-400/5 p-8">
              <dt className="/6 font-semibold text-gray-600">{"stat.name"}</dt>
              <dd className="text-base-content order-first text-3xl font-semibold tracking-tight">
                <SignIn />
              </dd>
            </div>
            {metrics?.map((stat, i) => (
              <div key={i} className="flex flex-col bg-gray-400/5 p-8">
                <dt className="/6 font-semibold text-gray-600">{stat.name}</dt>
                <dd className="text-base-content order-first text-3xl font-semibold tracking-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
