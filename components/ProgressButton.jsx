import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

function ProgressButton({ item, index, handleItemClick, isDisabled, isDatabaseCompleted, isUnsavedSelection }) {
  const [saving, setSaving] = useState(false);
  const saveItem = async () => {
    setSaving(true);
    try {
      await fetch(`/api/trackables/${item._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          completed: true
        })
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <button
      key={index}
      disabled={isDisabled || saving}
      className={`cursor-pointer text-nowrap ${isDisabled || saving ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={() => handleItemClick(index)}
      title={isDatabaseCompleted
        ? 'This item is already saved in the database and cannot be changed'
        : isUnsavedSelection
          ? 'Selected but not yet saved to database'
          : ''}
    >
      {item.completed === true ? (
        <span
          className={`${isDatabaseCompleted ? 'border-success' : 'border-warning'} flex items-center justify-center rounded-full border pr-2`}>
              <span className={`mr-1`}>
                <CheckCircleIcon className={`${isDatabaseCompleted ? 'text-success' : 'text-warning'} h-6 w-6`} />
              </span>
          {item.name}
          {!isDatabaseCompleted && (
            <span className="ml-1 text-[10px] text-warning">(not saved)</span>
          )}
            </span>
      ) : (
        <span className={`border-base-content/40 flex items-center justify-center rounded-full border pr-2`}>
              <span className={`mr-1`}>
                <span className={`text-base-content/40 m-[2px] block h-5 w-5 rounded-full border`} />
              </span>
          {item.name}
            </span>
      )}
    </button>
  );
}

export default ProgressButton;