import React, { useRef, useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useClient } from '../contexts/ClientContext';
import { generateSentence } from '../utils/generateSentence';

function ProgressButton({ item, index, isDisabled }) {
  const [saving, setSaving] = useState(false);
  const [count, setCount] = useState(7);
  const [counting, setCounting] = useState(false);
  const intervalRef = useRef(null);
  const { selectedClient, setSelectedClient } = useClient();

  const saveItem = async () => {
    setSaving(true);
    let statement = '';
    try {
      statement = generateSentence(
        selectedClient?.navigator || 'Navigator',
        `${selectedClient.first_name || ''} ${selectedClient.last_name || ''}`.trim() || 'Client',
        item?.name || null,
        Array.isArray([selectedClient?.trackable?.program]) ? [selectedClient?.trackable?.program] : []
      );
    } catch (error) {
      console.error('Error generating sentence for single-select:', error);
    }
    try {
      const res = await fetch(`/api/clients/update?clientId=${selectedClient?._id}&trackable=${index}`, {
        method: 'POST',
        body: JSON.stringify({
          completed: true,
          name: item?.name,
          type: 'activity',
          clientEmail: selectedClient?.email || '',
          navigator: selectedClient?.navigator || 'Unknown',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          selection: item.name || '',
          path: [selectedClient?.trackable?.program],
          statement: statement || '',
          selectedDate: new Date().toISOString(),
          fep: selectedClient?.fep || ''
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }
      const data = await res.json();
      await setSelectedClient(data.client);
      setSaving(false); // Trigger UI update on success
    } catch (error) {
      console.error('Error saving item:', error);
      setSaving(false);
      return {
        error: true,
        message: 'Error saving item'
      };
    }
  };

  const startCount = () => {
    if (counting) {
      clearInterval(intervalRef.current);
      setCounting(false);
      setCount(7);
      return;
    }

    setCounting(true);
    let currentCount = 7;
    setCount(currentCount);
    intervalRef.current = setInterval(() => {
      currentCount -= 1;
      setCount(currentCount);
      if (currentCount === 0) {
        clearInterval(intervalRef.current);
        setCounting(false);
        saveItem().then();
      }
    }, 1000);
  };

  return (
    <button
      key={index}
      disabled={isDisabled || saving}
      className={`cursor-pointer text-nowrap ${isDisabled || saving ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={startCount}
    >
      {item?.completed === true ? (
        <span
          className={`border-success flex items-center justify-center rounded-full border pr-2`}>
              <span className={`mr-1`}>
               <CheckCircleIcon className={`text-success h-6 w-6`} />
              </span>
          {item?.name}
            </span>
      ) : (
        <span
          className={`${counting ? 'text-warning border-warning' : 'border-base-content/40'}  flex items-center justify-center rounded-full border pr-2`}>
              <span className={`mr-1`}>
                <span
                  className={`${counting ? 'text-warning border-warning' : 'border-base-content/40'} m-[2px] block h-5 w-5 rounded-full border text-center text-xs`}>
                  {counting ? count.toString() : null}
                </span>
              </span>
          {item?.name}
            </span>
      )}
    </button>
  );
}

export default ProgressButton;