// /components/blocks/molecules/ClientRow.tsx
import { useClient } from '@/contexts/ClientContext';
import { useEditing } from '@/contexts/EditingContext';
import { Dispatch, SetStateAction } from 'react';
import ClientNameBlock from '../atoms/ClientNameBlock';
import Badge from '../../../components/Badge';
import { useNavigator } from '@/contexts/NavigatorsContext';
import { useLayout } from '@/contexts/LayoutContext';

type Edit = 'client' | null;
type ClientRowProps = {
  person: {
    fep: string;
    contactNumber: string;
    email: string;
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
  const { selectedNavigator } = useNavigator();
  const { currentLayout } = useLayout();
  const { setEditing } = useEditing() as {
    setEditing: Dispatch<SetStateAction<Edit>>;
  };

  const setVisibility = (val: number) => {
    if (currentLayout.table <= val) {
      return 'hidden';
    }
    return 'visible';
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
        <ClientNameBlock
          firstName={person?.first_name || 'John'}
          lastName={person?.last_name || 'Doe'}
          latestInteraction={person?.latestInteraction || '2021-01-01'}
        />
      </td>
      <td className={`${setVisibility(0)}`}><span className={`truncate w-1/2`}>{person?.email}</span></td>
      <td className={`${setVisibility(50)} whitespace-nowrap`}>{person?.contactNumber}</td>
      <td className={`${setVisibility(50)} whitespace-nowrap`}>{person?.county || ''}</td>
      <td>
        <Badge use={person?.clientStatus?.toLowerCase() as 'active' | 'in progress' | 'graduated' | 'inactive'} />
      </td>
      <td className={`${setVisibility(50)} whitespace-nowrap`}>{person?.fep || ''}</td>
      <td>{selectedNavigator ? (selectedNavigator['pinned']?.includes(person._id) ? 'Pinned' : person?.navigator) : person?.navigator || ''}</td>
    </tr>
  );
}
