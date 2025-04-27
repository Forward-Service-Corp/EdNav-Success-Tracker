// /components/blocks/molecules/ClientTableBody.tsx

import ClientRow from '@/stories/blocks/molecules/ClientRow';

type ClientTableBodyProps = {
  clients: any[]; // Replace it with your proper client type
  selectedClientId: string | null;
  setOpenPanel: (panel: string | null) => void;
};

export default function ClientTableBody({
                                          clients,
                                          selectedClientId,
                                          setOpenPanel
                                        }: ClientTableBodyProps) {
  return (
    <tbody className="block h-full min-h-[600px] w-full ">
    {clients && clients?.map((person, i) => (
      <ClientRow
        key={i}
        person={person}
        selected={selectedClientId === person._id}
        setOpenPanel={setOpenPanel}
      />
    ))}
    </tbody>
  );
}
