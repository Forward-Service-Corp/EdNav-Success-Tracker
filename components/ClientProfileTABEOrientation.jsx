import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { useClients } from '/contexts/ClientsContext';

function ClientProfileTabeOrientation({ isNarrow }) {
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
    // console.log('ClientProfileTABEOrientation: selectedClient updated:', {
    //   hasOrientation: !!selectedClient?.orientation?.referralDate,
    //   hasTabe: !!selectedClient?.tabe?.referralDate,
    //   hasTranscripts: !!selectedClient?.transcripts?.referralDate
    // });
    
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

    // Check for trackable items that should unlock sections
    if (selectedClient?.trackable?.items && Array.isArray(selectedClient.trackable.items)) {
      const completedItems = selectedClient.trackable.items
        .filter(item => item && item.completed === true)
        .map(item => item.name.toLowerCase());

      // console.log('Checking trackable items for TABE/Orientation sections:', completedItems);

      // If we have completed trackable items but sections aren't unlocked,
      // force the sections to unlock by updating DOM directly
      setTimeout(() => {
        if (completedItems.includes('orientation') && !selectedClient?.orientation?.referralDate) {
          // console.log('Force unlocking orientation section based on trackable item');
          const section = document.getElementById('orientation');
          if (section) {
            try {
              const overlay = section.querySelector('.absolute');
              if (overlay) overlay.classList.add('invisible');

              const card = section.querySelector('.card');
              if (card) card.classList.remove('opacity-50', 'blur-[2px]');
            } catch (e) {
              console.error('Error forcing orientation section unlock:', e);
            }
          }
        }

        if (completedItems.includes('tabe') && !selectedClient?.tabe?.referralDate) {
          // console.log('Force unlocking tabe section based on trackable item');
          const section = document.getElementById('tabe');
          if (section) {
            try {
              const overlay = section.querySelector('.absolute');
              if (overlay) overlay.classList.add('invisible');

              const card = section.querySelector('.card');
              if (card) card.classList.remove('opacity-50', 'blur-[2px]');
            } catch (e) {
              console.error('Error forcing tabe section unlock:', e);
            }
          }
        }

        if (completedItems.includes('transcripts') && !selectedClient?.transcripts?.referralDate) {
          // console.log('Force unlocking transcripts section based on trackable item');
          const section = document.getElementById('transcripts');
          if (section) {
            try {
              const overlay = section.querySelector('.absolute');
              if (overlay) overlay.classList.add('invisible');

              const card = section.querySelector('.card');
              if (card) card.classList.remove('opacity-50', 'blur-[2px]');
            } catch (e) {
              console.error('Error forcing transcripts section unlock:', e);
            }
          }
        }
      }, 300); // Give some time for the component to render
    }
  }, [selectedClient]);

  function hasValidKey(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key) && !!obj[key];
  }

  return (
    <div className="relative grid grid-cols-1 gap-3 md:gap-6">
      <div id="orientation" className={`relative`}>
        <div
          className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient?.orientation?.referralDate ? "invisible" : "visible"}`}
        >
          <div
            className={`text-base-content bg-base-300/70 m-auto max-w-3/4 rounded-lg p-4 md:p-6 text-center shadow text-sm md:text-base`}
          >
            Add an activity regarding Orientation to activate this area.
          </div>
        </div>
        <div
          className={`card card-sm bg-base-200 border-base-content/10 relative mx-3 md:mr-6 rounded-lg border-1 p-3 md:p-6 shadow ${selectedClient?.orientation?.referralDate ? '' : 'opacity-50 blur-[2px]'}`}
        >
          <div className={`${isNarrow ? 'text-lg' : 'text-2xl'}`}>Orientation</div>
          <div className="mt-4 md:mt-6 flex items-start gap-2 md:gap-3 flex-col md:flex-row">
            <div className={`w-full md:w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.orientation, "referralDate") ? (
                  <div>
                    <div className={`text-base-content/60 font-medium`}>
                      Referral Date
                    </div>
                    <div className={`text-sm md:text-base`}>
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
                    <div className={`text-sm md:text-base`}>TBD</div>
                  </div>
                )}
              </div>
            </div>
            <div className={`w-full md:w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.orientation, "completionDate") ? (
                  <div>
                    <div className={`font-medium`}>Completion Date</div>
                    <div className={`text-sm md:text-base`}>
                      {moment(
                        selectedClient?.orientation?.completionDate
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
          <button className={`btn btn-outline btn-info btn-xs md:btn-sm mt-4 md:mt-6 mb-1`}>
            Edit Dates
          </button>
        </div>
      </div>
      <div id="tabe" className={`relative`}>
        <div
          className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient?.tabe?.referralDate ? "invisible" : "visible"}`}
        >
          <div
            className={`text-base-content bg-base-300 m-auto max-w-3/4 rounded-lg p-4 md:p-6 text-center shadow text-sm md:text-base`}
          >
            Add an activity regarding TABE to activate this area.
          </div>
        </div>
        <div
          className={`card card-sm bg-base-200 border-base-content/10 relative mx-3 md:mr-6 rounded-lg border-1 p-3 md:p-6 shadow ${selectedClient?.tabe?.referralDate ? '' : 'opacity-50 blur-[2px]'}`}
        >
          <div className={`${isNarrow ? 'text-lg' : 'text-2xl'}`}>TABE</div>
          <div className="mt-4 md:mt-6 flex items-start gap-2 md:gap-3 flex-col md:flex-row">
            <div className={`w-full md:w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.tabe, "referralDate") ? (
                  <div>
                    <div className={`font-medium`}>Referral Date</div>
                    <div className={`text-sm md:text-base`}>
                      {moment(selectedClient?.tabe?.referralDate).calendar()}
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
                {hasValidKey(selectedClient?.tabe, "completionDate") ? (
                  <div>
                    <div className={`font-medium`}>Completion Date</div>
                    <div className={`text-sm md:text-base`}>
                      {moment(selectedClient?.tabe?.completionDate).calendar()}
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
        </div>
      </div>
      <div id="transcripts" className={`relative`}>
        <div
          className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient?.transcripts?.referralDate ? "invisible" : "visible"}`}
        >
          <div
            className={`text-base-content bg-base-300/70 m-auto max-w-3/4 rounded p-4 md:p-6 text-center shadow text-sm md:text-base`}
          >
            Add an activity regarding Transcripts to activate this area.
          </div>
        </div>
        <div
          className={`card card-sm bg-base-200 border-base-content/10 mx-3 md:mr-6 rounded border-1 p-3 md:p-6 shadow ${selectedClient?.transcripts?.referralDate ? '' : 'opacity-50 blur-[2px]'}`}
        >
          <div className={`${isNarrow ? 'text-lg' : 'text-2xl'}`}>Transcripts</div>
          <div className="mt-4 md:mt-6 flex items-start gap-2 md:gap-3 flex-col md:flex-row">
            <div className={`w-full md:w-1/2`}>
              <div className={`mb-2 flex items-end gap-2`}>
                {hasValidKey(selectedClient?.transcripts, "referralDate") ? (
                  <div>
                    <div className={`font-medium`}>Referral Date</div>
                    <div className={`text-sm md:text-base`}>
                      {moment(
                        selectedClient?.transcripts?.referralDate
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
                {hasValidKey(selectedClient?.transcripts, "completionDate") ? (
                  <div>
                    <div className={`font-medium`}>Completion Date</div>
                    <div className={`text-sm md:text-base`}>
                      {moment(
                        selectedClient?.transcripts?.completionDate
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
        </div>
      </div>
    </div>
  );
}

// Default props
ClientProfileTabeOrientation.defaultProps = {
  isNarrow: false
};

export default ClientProfileTabeOrientation;