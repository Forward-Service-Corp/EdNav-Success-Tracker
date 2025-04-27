// /components/blocks/molecules/ClientRow.tsx
import { useClient } from '@/contexts/ClientContext';
import { useEditing } from '@/contexts/EditingContext';
import { Dispatch, SetStateAction } from 'react';
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
    <tr
      className={`cursor-pointer bg-base-200 hover:bg-base-200/20 transition-colors duration-300 min-w-full w-full ${
        selected ? 'bg-accent/20' : ''
      }`}
      onClick={handleClick}
    >
      <td>
        <div className="sticky top-80 z-20 flex items-center gap-3 min-w-full w-full">
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
    </tr>
  );
}
