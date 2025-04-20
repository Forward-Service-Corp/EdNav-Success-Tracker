import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import { useClients } from '@/contexts/ClientsContext';

function ClientProfileTabeOrientation() {
  const { selectedClient } = useClients();
  const [, setDateValue] = useState({
    orientation: {
      referralDate: selectedClient?.orientation?.referralDate || null,
      completionDate: selectedClient?.orientation?.completionDate || null
    },
    tabe: {
      referralDate: selectedClient?.tabe?.referralDate || null,
      completionDate: selectedClient?.tabe?.completionDate || null
    },
    transcripts: {
      referralDate: selectedClient?.transcripts?.referralDate || null,
      completionDate: selectedClient?.transcripts?.completionDate || null
    }
  });

  useEffect(() => {
    setDateValue({
      orientation: {
        referralDate: selectedClient?.orientation?.referralDate || null,
        completionDate: selectedClient?.orientation?.completionDate || null
      },
      tabe: {
        referralDate: selectedClient?.tabe?.referralDate || null,
        completionDate: selectedClient?.tabe?.completionDate || null
      },
      transcripts: {
        referralDate: selectedClient?.transcripts?.referralDate || null,
        completionDate: selectedClient?.transcripts?.completionDate || null
      }
    });
  }, [selectedClient]);

  function hasValidKey(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key) && !!obj[key];
  }

  return (
    <div className="grid grid-cols-1 gap-6 text-xs">
      <div
        className={`card card-sm bg-base-200 border-1 border-base-content/10 rounded-lg mr-6 p-6 shadow ${selectedClient.orientation?.referralDate ? '' : 'opacity-50 blur-[2px]'}`}>
        <div className={`text-2xl`}>Orientation</div>
        <div className="flex mt-6 gap-3 items-start">
          <div className={`w-1/2`}>
            <div className={`flex items-end gap-2 mb-2`}>
              {
                hasValidKey(selectedClient?.orientation, 'referralDate') ? (
                  <div>
                    <div className={`font-medium text-base-content/60`}>Referral Date</div>
                    <div className={`text-sm`}>{moment(selectedClient?.orientation?.referralDate).calendar()}</div>
                  </div>
                ) : (
                  <div>
                    <div className={`font-medium text-base-content/60`}>Referral Date</div>
                    <div className={`text-sm`}>TBD</div>
                  </div>
                )
              }

            </div>
          </div>
          <div className={`w-1/2`}>
            <div className={`flex items-end gap-2 mb-2`}>
              {
                hasValidKey(selectedClient?.orientation, 'completionDate') ? (
                  <div>
                    <div className={`text-sm font-medium`}>Completion Date</div>
                    {moment(selectedClient?.orientation?.completionDate).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`font-medium text-base-content/60`}>Completion Date</div>
                    <div className={`text-sm`}>TBD</div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>

      <div
        className={`card card-sm bg-base-200 border-1 border-base-content/10 rounded-lg mr-6 p-6 shadow ${selectedClient.tabe?.referralDate ? '' : 'opacity-50 blur-[2px]'}`}>
        <div className={`text-2xl`}>TABE</div>
        <div className="flex mt-6 gap-3 items-start">
          <div className={`w-1/2`}>
            <div className={`flex items-end gap-2 mb-2`}>
              {
                hasValidKey(selectedClient?.tabe, 'referralDate') ? (
                  <div>
                    <div className={`text-sm font-medium`}>Referral Date</div>
                    {moment(selectedClient?.tabe?.referralDate).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`font-medium text-base-content/60`}>Referral Date</div>
                    <div className={`text-sm`}>TBD</div>
                  </div>
                )
              }
            </div>
          </div>
          <div className={`w-1/2`}>
            <div className={`flex items-end gap-2 mb-2`}>
              {
                hasValidKey(selectedClient?.tabe, 'completionDate') ? (
                  <div>
                    <div className={`text-sm font-medium`}>Completion Date</div>
                    {moment(selectedClient?.tabe?.completionDate).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`font-medium text-base-content/60`}>Completion Date</div>
                    <div className={`text-sm`}>TBD</div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>

      <div
        className={`card card-sm bg-base-200 border-1 border-base-content/10 rounded-lg mr-6 p-6 shadow ${selectedClient.transcripts?.referralDate ? '' : 'opacity-50 blur-[2px]'}`}>
        <div className={`text-2xl`}>Transcripts</div>
        <div className="flex mt-6 gap-3 items-start">
          <div className={`w-1/2`}>
            <div className={`flex items-end gap-2 mb-2`}>
              {
                hasValidKey(selectedClient?.transcripts, 'referralDate') ? (
                  <div>
                    <div className={`text-sm font-medium`}>Referral Date</div>
                    {moment(selectedClient?.transcripts?.referralDate).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`font-medium text-base-content/60`}>Referral Date</div>
                    <div className={`text-sm`}>TBD</div>
                  </div>
                )
              }
            </div>
          </div>
          <div className={`w-1/2`}>
            <div className={`flex items-end gap-2 mb-2`}>
              {
                hasValidKey(selectedClient?.transcripts, 'completionDate') ? (
                  <div>
                    <div className={`text-sm font-medium`}>Completion Date</div>
                    {moment(selectedClient?.transcripts?.completionDate).calendar()}
                  </div>
                ) : (
                  <div>
                    <div className={`font-medium text-base-content/60`}>Completion Date</div>
                    <div className={`text-sm`}>TBD</div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ClientProfileTabeOrientation;
