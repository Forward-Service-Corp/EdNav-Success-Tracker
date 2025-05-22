import React, { useState } from "react";
import moment from "moment";
import { useClient } from "../contexts/ClientContext";

function ClientProfileUnlockableSection({ isNarrow, section }) {
  const { selectedClient } = useClient();
  const [dateValue, setDateValue] = useState("");
  const [editDate, setEditDate] = useState(false);

  function hasValidKey(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key) && !!obj[key];
  }

  return (
    <div id={section} className={`relative`}>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient[section]?.completed === true ? "invisible" : "visible"}`}
      >
        <div
          className={`text-base-content bg-base-300/70 m-auto max-w-3/4 rounded-lg p-4 text-center text-sm shadow md:p-6 md:text-base`}
        >
          Add an activity regarding {section} to activate this area.
        </div>
      </div>
      <div
        className={`bg-base-200 border-base-content/10 relative rounded-lg border-1 p-3 shadow md:p-6 ${selectedClient[section] ? "" : "opacity-50 blur-[2px]"}`}
      >
        <div
          className={`${isNarrow ? "text-lg" : "text-xl"} font-light tracking-wider uppercase`}
        >
          {section}
        </div>
        <div className="flex flex-col items-start gap-2 md:flex-row md:gap-3">
          <div className={`w-full md:w-1/2`}>
            <div className={`mb-2 flex items-end gap-2`}>
              {hasValidKey(selectedClient[section], "referralDate") ? (
                <div>
                  <div className={`text-base-content/60 font-medium`}>
                    Referral Date
                  </div>
                  <div className={`text-sm md:text-base`}>
                    {moment(selectedClient[section]?.referralDate).calendar()}
                  </div>
                </div>
              ) : (
                <div>
                  <div className={`text-base-content/60 font-medium`}>
                    Referral Date
                  </div>
                  <div className={`text-sm md:text-base`}>TBD</div>
                </div>
              )}
            </div>
          </div>
          <div className={`w-full md:w-1/2`}>
            <div className={`mb-2 flex items-end gap-2`}>
              {hasValidKey(selectedClient[section], "completionDate") ? (
                <div>
                  <div className={`font-medium`}>Completion Date</div>
                  <div className={`text-sm md:text-base`}>
                    {moment(selectedClient[section]?.completionDate).calendar()}
                  </div>
                </div>
              ) : (
                <div>
                  <div className={`text-base-content/60 font-medium`}>
                    Completion Date
                  </div>
                  <div className={`text-sm md:text-base`}>TBD</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <input
          type="date"
          name={`achievementDate`}
          value={dateValue}
          id={`achievementDate`}
          className={`input input-sm ${!editDate ? "hidden" : "visible"}`}
          onChange={(e) => {
            setDateValue(e.target.value);
          }}
        />
        <div className={`flex flex-row gap-2 md:flex-col md:gap-3`}>
          <button
            onClick={() => {
              setEditDate(!editDate);
            }}
            className={`btn btn-outline btn-info btn-xs md:btn-sm mt-4 mb-1 md:mt-6`}
          >
            {editDate ? "Cancel" : "Edit"}
          </button>
          <button
            className={`btn btn-outline btn-sm ${editDate ? "visible" : "hidden"}`}
            onClick={() => {
              selectedClient[section].referralDate = dateValue;
              selectedClient[section].completionDate = dateValue;
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClientProfileUnlockableSection;