import { EditIcon, SaveIcon } from "lucide-react";
import moment from "moment/moment";
import { useState } from "react";

function ClientProfileUnlockableRight({
  selectedClient,
  section,
  isNarrow,
  hasValidKey,
}) {
  const [dateValue, setDateValue] = useState("");
  const [editDate, setEditDate] = useState(false);

  const handleDateChange = (e) => {
    selectedClient[section].referralDate = e.target.value;
  };

  const handleEdit = () => {
    setEditDate(true);
  };

  const handleDateSave = () => {
    setEditDate(false);
  };

  // const handleDateCancel = () => {
  //   setEditDate(false);
  //   console.log("cancel");
  //   console.log(selectedClient[section]);
  // }

  return (
    <div className={`flex w-full justify-between gap-4`}>
      <div className={`flex w-full items-center justify-between gap-2`}>
        {hasValidKey(selectedClient[section], "referralDate") ? (
          <div
            className={`text-base-content/60 border-base-content/15 mt-2 flex w-full items-center justify-between gap-2`}
          >
            <div>
              <span className={`mr-3 block text-sm whitespace-nowrap`}>
                Completion date
              </span>
              <span className={`text-lg`}>
                {moment(selectedClient[section]?.referralDate).calendar()}
              </span>
            </div>
            <div className={`flex items-baseline justify-baseline`}>
              <button
                onClick={handleEdit}
                className={`btn btn-xs ${!editDate ? "visible" : "hidden"}`}
              >
                <EditIcon className={`h-5 w-5`} />
              </button>
              <button
                className={`btn btn-xs ${editDate ? "visible" : "hidden"}`}
                onClick={handleDateSave}
              >
                <SaveIcon className={`h-5 w-5`} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className={`text-base-content/60 font-medium`}>
              Completion date
            </div>
            <div className={`text-sm md:text-base`}>TBD</div>
          </div>
        )}
        <input
          type="date"
          name={`achievementDate`}
          onChange={handleDateChange}
          value={dateValue}
          id={`achievementDate`}
          className={`input input-sm ${!editDate ? "hidden" : "visible"}`}
        />
      </div>
    </div>
  );
}

export default ClientProfileUnlockableRight;
