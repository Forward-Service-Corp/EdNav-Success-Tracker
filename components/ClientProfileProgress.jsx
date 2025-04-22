import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useClients } from "../contexts/ClientsContext";

function ClientProfileProgress({
  hasTrackable,
  setHasTrackable,
  updated,
  setUpdated,
  hasTrackableCopy,
}) {
  const { selectedClient } = useClients();

  const handleTrackableUpdate = async () => {
    const graduated =
      hasTrackable.filter((item) => item.completed === true).length ===
      hasTrackable.length;
    if (graduated) {
      setHasTrackable((prevState) => {
        return [...prevState, { programComplete: true }];
      });
    }
    const res = await fetch(`/api/trackable?clientId=${selectedClient._id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedClient),
      method: "POST",
    });
    const data = await res.json();
    if (data.error) {
      console.error(data.error);
    }
    setUpdated(false);
  };

  function calculateCompletionPercentage(items) {
    if (!items?.length) return 0;

    const completedCount = items.filter((item) => item?.completed).length;
    const totalCount = items?.length;

    return ((completedCount / totalCount) * 100).toFixed(1);
  }

  return (
    <div className={`relative`}>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient?.trackable?.program === "GED" || selectedClient?.trackable?.program === "HSED" ? "invisible" : "visible"}`}
      >
        <div
          className={`text-base-content bg-base-300 m-auto max-w-3/4 rounded p-6 text-center shadow`}
        >
          Add an activity regarding GED or HSED to activate this area.
        </div>
      </div>
      <div
        className={`card bg-base-200 border-base-content/10 relative mx-6 rounded border-1 shadow-sm ${selectedClient?.trackable?.program === "GED" || selectedClient?.trackable?.program === "HSED" ? "" : "opacity-50 blur-[2px]"}`}
      >
        <div className="card-body">
          <div className={`mt-0 mb-4 flex items-center justify-between`}>
            <div>
              <div className={`text-2xl`}>
                {selectedClient?.trackable?.program} Progress -{" "}
                {calculateCompletionPercentage(
                  selectedClient?.trackable?.items,
                )}
                %
              </div>
              <p className={`text-info`}>
                If you are having trouble selecting items, please refresh the
                page.
              </p>
            </div>

            <div
              onClick={handleTrackableUpdate}
              className={`text-secondary cursor-pointer font-light underline ${updated ? "visible" : "hidden"}`}
            >
              Save Progress
            </div>
          </div>
          <div className="card-actions justify-end">
            <progress
              className="progress progress-success"
              value={calculateCompletionPercentage(
                selectedClient?.trackable?.items,
              )}
              max="100"
            ></progress>
            <div className={`mt-4 flex flex-wrap gap-3`}>
              {hasTrackable?.map((item, index) => {
                return (
                  <button
                    key={index}
                    disabled={hasTrackableCopy[index]?.completed === true}
                    className={`cursor-pointer text-nowrap disabled:cursor-not-allowed`}
                    onClick={() => {
                      const hasTrackableState = !hasTrackable[index].completed;
                      setHasTrackable((prevState) => {
                        const newItems = [...prevState];
                        newItems[index].completed = hasTrackableState;
                        setUpdated(true);
                        return newItems;
                      });
                    }}
                  >
                    {item.completed === true ? (
                      <span
                        className={`border-success flex items-center justify-center rounded-full border pr-2`}
                      >
                        <span className={`mr-1`}>
                          <CheckCircleIcon className={`text-success h-6 w-6`} />
                        </span>
                        {item.name}
                      </span>
                    ) : (
                      <span
                        className={`border-base-content/40 flex items-center justify-center rounded-full border pr-2`}
                      >
                        <span className={`mr-1`}>
                          <span
                            className={`text-base-content/40 m-[2px] block h-5 w-5 rounded-full border`}
                          />
                        </span>
                        {item.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfileProgress;