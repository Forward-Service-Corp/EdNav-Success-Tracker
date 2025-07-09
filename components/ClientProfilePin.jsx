"use client";
import React, { useEffect, useState } from 'react';
import { useClient } from '../contexts/ClientContext';
import { PinIcon } from 'lucide-react';
import { useNavigator } from '../contexts/NavigatorsContext';

function ClientProfilePin() {
  const { selectedClient } = useClient();
  const { selectedNavigator, setSelectedNavigator } = useNavigator();
  const [, setPinned] = useState([]);

  useEffect(() => {
    if (selectedNavigator?.pinned) {
      setPinned(selectedNavigator?.pinned);
    }
  }, [selectedNavigator?.pinned]);

  let savePinned;
  savePinned = async () => {
    const data = await fetch(`/api/navigators/update?clientId=${selectedClient?._id}&navigatorId=${selectedNavigator?.name}`, {
      method: 'POST'
    });
    const json = await data.json();
    await setSelectedNavigator(json.navigator);
  };

  async function handlePinClick(event) {
    await event.stopPropagation();
    setPinned((prev) => {
      if (prev.includes(selectedClient?._id)) {
        return prev.filter((id) => id !== selectedClient?._id);
      } else {
        return [...prev, selectedClient?._id];
      }
    });
    await savePinned().then();
  }

  return (
    <div className={` mr-3 max-h-[36px]`}>
      <button
        className={`p-[6px] rounded-full bg-base-300/30 border-1 border-base-300 flex items-center justify-center max-h-[30px] max-w-[30px] ${selectedNavigator && selectedNavigator.pinned?.length > 0 && selectedNavigator.pinned?.includes(selectedClient?._id) ? 'text-warning bg-warning/30 border-warning' : 'text-base-content/20'}`}
        onClick={handlePinClick}>
        <PinIcon
          className={`hover:text-base-content/80 ${selectedNavigator && selectedNavigator.pinned?.length > 0 && selectedNavigator.pinned?.includes(selectedClient?._id) ? 'text-warning' : 'text-base-content/20'}`}
        />
      </button>
    </div>
  );
}

export default ClientProfilePin;