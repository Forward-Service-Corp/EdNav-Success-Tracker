import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { useClients } from '@/contexts/ClientsContext';

function ClientProfileTabeOrientation() {
  const { selectedClient } = useClients();
  const [, setDateValue] = useState({
    orientation: {
      referralDate: selectedClient?.orientation?.referralDate || null,
      completionDate: selectedClient?.orientation?.completionDate || null,
    },
    tabe: {
      referralDate: selectedClient?.tabe?.referralDate || null,
      completionDate: selectedClient?.tabe?.completionDate || null,
    },
    transcripts: {
      referralDate: selectedClient?.transcripts?.referralDate || null,
      completionDate: selectedClient?.transcripts?.completionDate || null,
    },
  });

  useEffect(() => {
    setDateValue({
      orientation: {
        referralDate: selectedClient?.orientation?.referralDate || null,
        completionDate: selectedClient?.orientation?.completionDate || null,
      },
      tabe: {
        referralDate: selectedClient?.tabe?.referralDate || null,
        completionDate: selectedClient?.tabe?.completionDate || null,
      },
      transcripts: {
        referralDate: selectedClient?.transcripts?.referralDate || null,
        completionDate: selectedClient?.transcripts?.completionDate || null,
      },
    });
  }, [selectedClient]);

  function hasValidKey(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key) && !!obj[key];
  }

  return (
    <div className="relative grid grid-cols-1 gap-6">
      <div id="orientation" className={`relative`}>
        <div
          className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient?.orientation?.referralDate ? "invisible" : "visible"}`}
        >
          <div
            className={`text-base-content bg-base-300/70 m-auto max-w-3/4 rounded-lg p-6 text-center shadow`}
          >
            Add an activity regarding Orientation to activate this area.
          </div>
        </div>
        <div
          className={`card card-sm bg-base-200 border-base-content/10 relative mr-6 rounded-lg border-1 p-6 shadow ${selectedClient?.orientation?.referralDate ? "" : "opacity-50 blur-[2px]"}`}
        >
          <div className={`text-2xl`}>Orientation</div>
          <div className="mt-6 flex items-start gap-3">
            <div className={`w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.orientation, "referralDate") ? (
                  <div>
                    <div className={`text-base-content/60 font-medium`}>
                      Referral Date
                    </div>
                    <div className={``}>
                      {moment(
                        selectedClient?.orientation?.referralDate,
                      ).calendar()}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={`text-base-content/60 font-medium`}>
                      Referral Date
                    </div>
                    <div className={``}>TBD</div>
                  </div>
                )}
              </div>
            </div>
            <div className={`w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.orientation, "completionDate") ? (
                  <div>
                    <div className={`font-medium`}>Completion Date</div>
                    {moment(
                      selectedClient?.orientation?.completionDate,
                    ).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`text-base-content/60 font-medium`}>
                      Completion Date
                    </div>
                    <div className={``}>TBD</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className={`btn btn-outline btn-info btn-sm mt-6 mb-1`}>
            Edit Dates
          </button>
        </div>
      </div>
      <div id="tabe" className={`relative`}>
        <div
          className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient?.tabe?.referralDate ? "invisible" : "visible"}`}
        >
          <div
            className={`text-base-content bg-base-300 m-auto max-w-3/4 rounded-lg p-6 text-center shadow`}
          >
            Add an activity regarding TABE to activate this area.
          </div>
        </div>
        <div
          className={`card card-sm bg-base-200 border-base-content/10 relative mr-6 rounded-lg border-1 p-6 shadow ${selectedClient?.tabe?.referralDate ? "" : "opacity-50 blur-[2px]"}`}
        >
          <div className={`text-2xl`}>TABE</div>
          <div className="mt-6 flex items-start gap-3">
            <div className={`w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.tabe, "referralDate") ? (
                  <div>
                    <div className={`font-medium`}>Referral Date</div>
                    {moment(selectedClient?.tabe?.referralDate).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`text-base-content/60 font-medium`}>
                      Referral Date
                    </div>
                    <div className={``}>TBD</div>
                  </div>
                )}
              </div>
            </div>
            <div className={`w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.tabe, "completionDate") ? (
                  <div>
                    <div className={`font-medium`}>Completion Date</div>
                    {moment(selectedClient?.tabe?.completionDate).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`text-base-content/60 font-medium`}>
                      Completion Date
                    </div>
                    <div className={``}>TBD</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="transcripts" className={`relative`}>
        <div
          className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient?.transcripts?.referralDate ? "invisible" : "visible"}`}
        >
          <div
            className={`text-base-content bg-base-300/70 m-auto max-w-3/4 rounded p-6 text-center shadow`}
          >
            Add an activity regarding Transcripts to activate this area.
          </div>
        </div>
        <div
          className={`card card-sm bg-base-200 border-base-content/10 mr-6 rounded border-1 p-6 shadow ${selectedClient?.transcripts?.referralDate ? "" : "opacity-50 blur-[2px]"}`}
        >
          <div className={`text-2xl`}>Transcripts</div>
          <div className="mt-6 flex items-start gap-3">
            <div className={`w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.transcripts, "referralDate") ? (
                  <div>
                    <div className={`font-medium`}>Referral Date</div>
                    {moment(
                      selectedClient?.transcripts?.referralDate,
                    ).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`text-base-content/60 font-medium`}>
                      Referral Date
                    </div>
                    <div className={``}>TBD</div>
                  </div>
                )}
              </div>
            </div>
            <div className={`w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.transcripts, "completionDate") ? (
                  <div>
                    <div className={`font-medium`}>Completion Date</div>
                    {moment(
                      selectedClient?.transcripts?.completionDate,
                    ).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`text-base-content/60 font-medium`}>
                      Completion Date
                    </div>
                    <div className={``}>TBD</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfileTabeOrientation;
