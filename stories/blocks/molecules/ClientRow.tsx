// /components/blocks/molecules/ClientRow.tsx
import { useClient } from '@/contexts/ClientContext';
import { useEditing } from '@/contexts/EditingContext';
import { getBGColor } from '@/lib/ColorMap';
import { Dispatch, SetStateAction } from 'react';
import AvatarCircle from '../atoms/AvatarCircle';
import ClientNameBlock from '../atoms/ClientNameBlock';
import Badge from '../../../components/Badge';

type Edit = 'client' | null;
type ClientRowProps = {
  person: {
    _id: string;
    first_name: string;
    last_name: string;
    latestInteraction: string;
    clientStatus: 'active' | 'in progress' | 'graduated' | 'inactive';
    county: string;
    navigator: string;
    group: string;
  }
  selected: boolean;
  setOpenPanel: (panel: string | null) => void;
};

export default function ClientRow({
                                    person,
                                    selected,
                                    setOpenPanel
                                  }: ClientRowProps) {
  const { setSelectedClient } = useClient();
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
    <table className="table w-full min-w-[450px] max-w-[980px] ">
      <tbody>
    <tr
      className={`cursor-pointer bg-base-200 transition-colors duration-300 ${
        selected ? getBGColor(person?.clientStatus?.toLowerCase()) : ''
      }`}
      onClick={handleClick}
    >
      <td>
        <div className="sticky top-80 z-20 flex items-center gap-3">
          <AvatarCircle
            firstName={person?.first_name || 'John'}
            lastName={person?.last_name || 'Doe'}
          />
          <ClientNameBlock
            firstName={person?.first_name || 'John'}
            lastName={person?.last_name || 'Doe'}
            latestInteraction={person?.latestInteraction || '2021-01-01'}
          />
        </div>
      </td>
      <td>
        <Badge use={person?.clientStatus?.toLowerCase() as 'active' | 'in progress' | 'graduated' | 'inactive'} />
      </td>
      <td>{person?.county || 'Dane'}</td>
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
      </tbody>
    </table>
  );
}
