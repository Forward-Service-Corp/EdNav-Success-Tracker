import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useClient } from '../contexts/ClientContext';

function ProgressButton({ item, index, isDisabled }) {
  const [saving, setSaving] = useState(false);
  const { selectedClient, setSelectedClient } = useClient();

  const saveItem = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/update?clientId=${selectedClient?._id}&trackable=${index}`, {
        method: 'POST',
        body: JSON.stringify({
          completed: true,
          name: item.name
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        const text = await res.text(); // handle non-JSON error responses
        throw new Error(`Server error ${res.status}: ${text}`);
      }
      const data = await res.json();
      console.log(data);
      await setSelectedClient(data.client);
    } catch (error) {
      console.error('Error saving item:', error);
      setSaving(false);
      return {
        error: true,
        message: 'Error saving item'
      };
    }
  };

  return (
    <button
      key={index}
      disabled={isDisabled || saving}
      className={`cursor-pointer text-nowrap ${isDisabled || saving ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={saveItem}
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
        <span className={`border-base-content/40 flex items-center justify-center rounded-full border pr-2`}>
              <span className={`mr-1`}>
                <span className={`text-base-content/40 m-[2px] block h-5 w-5 rounded-full border`} />
              </span>
          {item?.name}
            </span>
      )}
    </button>
  );
}

export default ProgressButton;