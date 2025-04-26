// /components/blocks/molecules/ClientRow.tsx

import { useClients } from '@/contexts/ClientsContext';
import { useEditing } from '@/contexts/EditingContext';
import { getBGColor } from '@/lib/ColorMap';
import { Dispatch, SetStateAction } from 'react';
import AvatarCircle from '../atoms/AvatarCircle';
import ClientNameBlock from '../atoms/ClientNameBlock';
import StatusBadge from '../atoms/StatusBadge';

type Edit = 'client' | null;
type ClientRowProps = {
  person: any; // Feel free to replace `any` with your actual Client type
  selected: boolean;
  setOpenPanel: (panel: string | null) => void;
};

export default function ClientRow({
                                    person,
                                    selected,
                                    setOpenPanel
                                  }: ClientRowProps) {
  const { setSelectedClient } = useClients();
  const { setEditing } = useEditing() as {
    setEditing: Dispatch<SetStateAction<Edit>>;
  };

  const handleClick = () => {
    setEditing('client');
    if (selected) {
      setSelectedClient(null);
      setOpenPanel(null);
    } else {
      setSelectedClient(person);
      setOpenPanel('profile');
    }
  };

  return (
    <tr
      className={`w-full cursor-pointer transition-colors duration-300 ${
        selected ? getBGColor(person.clientStatus.toLowerCase()) : ''
      }`}
      onClick={handleClick}
    >
      <td>
        <div className="sticky top-80 z-20 flex items-center gap-3">
          <AvatarCircle
            firstName={person.first_name}
            lastName={person.last_name}
          />
          <ClientNameBlock
            firstName={person.first_name}
            lastName={person.last_name}
            latestInteraction={person.latestInteraction}
          />
        </div>
      </td>
      <td>
        <StatusBadge status={person.clientStatus} isSelected={selected} />
      </td>
      <td>{person.county}</td>
      <th>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent row click
            setEditing('client');
            setSelectedClient(person);
            setOpenPanel('profile');
          }}
          className="btn btn-ghost btn-xs"
        >
          details
        </button>
      </th>
    </tr>
  );
}
