import React, { useState } from 'react';
import moment from 'moment';
import { useClient } from '../contexts/ClientContext';

function ClientProfileUnlockableSection({ isNarrow, section }) {
  const { selectedClient } = useClient();
  const [dateValue, setDateValue] = useState(null);
  const [editDate, setEditDate] = useState(false);

  function hasValidKey(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key) && !!obj[key];
  }

  return (
    <div id={section} className={`relative`}>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient[section]?.completed === true ? 'invisible' : 'visible'}`}
      >
        <div
          className={`text-base-content bg-base-300/70 m-auto max-w-3/4 rounded-lg p-4 md:p-6 text-center shadow text-sm md:text-base`}
        >
          Add an activity regarding {section} to activate this area.
        </div>
      </div>
      <div
        className={`card card-sm bg-base-200 border-base-content/10 relative mx-3 md:mr-6 rounded-lg border-1 p-3 md:p-6 shadow ${selectedClient[section] ? '' : 'opacity-50 blur-[2px]'}`}
      >
        <div className={`${isNarrow ? 'text-lg' : 'text-2xl'} uppercase font-light tracking-wider`}>{section}</div>
        <div className="mt-4 md:mt-6 flex items-start gap-2 md:gap-3 flex-col md:flex-row">
          <div className={`w-full md:w-1/2`}>
            <div className={`mb-2 flex items-end gap-2`}>
              {hasValidKey(selectedClient[section], 'referralDate') ? (
                <div>
                  <div className={`text-base-content/60 font-medium`}>
                    Referral Date
                  </div>
                  <div className={`text-sm md:text-base`}>
                    {moment(
                      selectedClient[section]?.referralDate
                    ).calendar()}
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
              {hasValidKey(selectedClient[section], 'completionDate') ? (
                <div>
                  <div className={`font-medium`}>Completion Date</div>
                  <div className={`text-sm md:text-base`}>
                    {moment(
                      selectedClient[section]?.completionDate
                    ).calendar()}
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
        <button onClick={() => {
          setEditDate(true);
        }} className={`btn btn-outline btn-info btn-xs md:btn-sm mt-4 md:mt-6 mb-1`}>
          Edit Dates
        </button>
      </div>
    </div>
  );
}

export default ClientProfileUnlockableSection;