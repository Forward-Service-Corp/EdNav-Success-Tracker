"use client";
import React, { useEffect, useState } from 'react';
import { useClient } from '@/contexts/ClientContext';
import { PinIcon } from 'lucide-react';
import { useNavigator } from '@/contexts/NavigatorsContext';

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
    const data = await fetch(`/api/education-navigators`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        navigator: selectedNavigator?._id,
        clientId: selectedClient?._id,
      }),
    });
    const json = await data.json();
    setSelectedNavigator(json.updatedNavigator);
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
    <div>
      <button className={`p-2 pr-4`} onClick={handlePinClick}>
        <PinIcon
          className={`hover:text-base-content/80 ${selectedNavigator && selectedNavigator.pinned?.length > 0 && selectedNavigator.pinned?.includes(selectedClient?._id) ? "text-base-content" : "text-base-content/20"}`}
        />
      </button>
    </div>
  );
}

export default ClientProfilePin;