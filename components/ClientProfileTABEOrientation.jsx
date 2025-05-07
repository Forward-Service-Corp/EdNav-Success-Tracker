import React, { useEffect, useState } from 'react';
import { useClient } from '/contexts/ClientContext';
import ClientProfileUnlockableSection from './ClientProfileUnlockableSection';

function ClientProfileTabeOrientation({ isNarrow }) {
  const { selectedClient } = useClient();
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
    console.log('ClientProfileTABEOrientation: selectedClient updated:', {
      hasOrientation: !!selectedClient?.orientation?.referralDate,
      hasTabe: !!selectedClient?.tabe?.referralDate,
      hasTranscripts: !!selectedClient?.transcripts?.referralDate
    });
    
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
        .filter(item => item && item?.completed === true)
        .map(item => item?.name?.toString().toLowerCase());

      // console.log('Checking trackable items for TABE/Orientation sections:', completedItems);

      // If we have completed trackable items but sections aren't unlocked,
      // force the sections to unlock by updating DOM directly
      setTimeout(() => {
        if (completedItems.includes('orientation') && !selectedClient?.orientation?.referralDate) {
          // console.log('Force unlocking an orientation section based on trackable item');
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

        // if (completedItems.includes('tabe') && !selectedClient?.tabe?.referralDate) {
        //   // console.log('Force unlocking tabe section based on trackable item');
        //   const section = document.getElementById('tabe');
        //   if (section) {
        //     try {
        //       const overlay = section.querySelector('.absolute');
        //       if (overlay) overlay.classList.add('invisible');
        //
        //       const card = section.querySelector('.card');
        //       if (card) card.classList.remove('opacity-50', 'blur-[2px]');
        //     } catch (e) {
        //       console.error('Error forcing tabe section unlock:', e);
        //     }
        //   }
        // }
        //
        // if (completedItems.includes('HS Transcripts') && !selectedClient?.transcripts?.referralDate) {
        //   // console.log('Force unlocking transcripts section based on trackable item');
        //   const section = document.getElementById('transcripts');
        //   if (section) {
        //     try {
        //       const overlay = section.querySelector('.absolute');
        //       if (overlay) overlay.classList.add('invisible');
        //
        //       const card = section.querySelector('.card');
        //       if (card) card.classList.remove('opacity-50', 'blur-[2px]');
        //     } catch (e) {
        //       console.error('Error forcing transcripts section unlock:', e);
        //     }
        //   }
        // }
      }, 300); // Give some time for the component to render
    }
  }, [selectedClient]);

  return (
    <div className="relative grid grid-cols-1 gap-3 md:gap-6">
      <ClientProfileUnlockableSection section="orientation" isNarrow={isNarrow} />
      <ClientProfileUnlockableSection section="tabe" isNarrow={isNarrow} />
      {selectedClient && selectedClient?.trackable?.program === 'HSED' && (
        <ClientProfileUnlockableSection section="transcripts" isNarrow={isNarrow} />)}

    </div>
  );
}

// Default props
ClientProfileTabeOrientation.defaultProps = {
  isNarrow: false
};

export default ClientProfileTabeOrientation;