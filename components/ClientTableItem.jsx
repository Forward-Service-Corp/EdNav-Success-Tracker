import React, { useEffect, useState } from 'react';
import { useClients } from '/contexts/ClientsContext';
import { PinIcon } from 'lucide-react';
import { useNavigators } from '../contexts/NavigatorsContext';
import { useEditing } from '../contexts/EditingContext';
import { useActivities } from '../contexts/ActivityContext';
import { getBadgeColor, getBGColor } from '../lib/ColorMap';

export default function ClientTableItem({ person, i, statusCollapse, menuOpen, filterOpen }) {
  const { setSelectedActivity } = useActivities();
  const { selectedClient, setSelectedClient } = useClients(null);
  const { selectedNavigator } = useNavigators();
  const { setEditing } = useEditing();


  const getActivities = async (person) => {
    const res = await fetch('/api/activities?clientId=' + person._id);
    const json = await res.json();
    await setSelectedActivity(prev => ({
      ...prev,
      activities: json.data
    }));
  };

  function getScreenWidth() {
    return window.innerWidth;
  }

  function useScreenWidth() {
    const [screenWidth, setScreenWidth] = useState(getScreenWidth());

    useEffect(() => {
      function handleResize() {
        setScreenWidth(getScreenWidth());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [screenWidth]);

    return screenWidth;
  }

  const screenWidth = useScreenWidth();
  const personStatus = person.clientStatus;
  const statusAbbr1 = personStatus.substring(0, 1);

  return (
    <tr key={person.email + i}
        onClick={() => {
          if (selectedClient?._id === person._id) {
            setSelectedClient(null);
            // noinspection JSCheckFunctionSignatures
            setEditing('');
          } else {
            const nextClient = person;
            setSelectedClient(null);
            setSelectedClient(nextClient);

            getActivities(person).then();
            // noinspection JSCheckFunctionSignatures
            setEditing('');
            setEditing('client');
          }
        }}
        className={` ${statusCollapse?.includes(person?.clientStatus) ? 'hidden' : 'visible'} client-table-item ${selectedClient?._id === person._id ? filterOpen ? 'sticky top-[47px] bottom-0 z-50' : 'sticky top-0 bottom-0 z-50' : 'relative'} ${selectedClient?._id === person?._id ? getBGColor(selectedClient?.clientStatus) : ''}`}>
      <td className={`px-6 font-medium  max-w-[160px] truncate`}>{person?.first_name + ' ' + person.last_name}</td>
      <td className={` max-w-[160px] truncate ${menuOpen ? 'hidden' : ''}`}>{person.latestInteraction}</td>
      <td className={` max-w-[160px] truncate ${menuOpen ? 'hidden' : ''}`}>{person.group}</td>
      <td className={` max-w-[160px] truncate ${menuOpen ? 'hidden' : ''}`}>{person.fep}</td>
      <td className={` max-w-[160px] truncate ${menuOpen ? 'hidden' : ''}`}>{person.region}</td>
      <td className={``}><PinIcon size={20}
                                  className={`${selectedNavigator && selectedNavigator.pinned && selectedNavigator?.pinned.includes(person?._id) ? 'visible' : 'hidden'} text-base-content/70`} />
      </td>
      <td className={``}>
        <div
          className={`w-[15px] m-3 2xl:w-fit ${selectedClient?._id === person._id ? 'badge bg-white text-black border-0 text-xs px-3' : getBadgeColor(person?.clientStatus)}`}>{(screenWidth < 1536 ? statusAbbr1 : '') + (screenWidth >= 1536 ? personStatus : '')}</div>
      </td>
    </tr>
  );
}
