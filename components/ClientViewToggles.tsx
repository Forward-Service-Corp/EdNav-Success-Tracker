import { useFepsLeft } from '@/contexts/FepsLeftContext';

export const ClientViewToggles = () => {
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();

  const toggle = (key: keyof typeof selectedFepLeft) => {
    setSelectedFepLeft(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2">
      <button onClick={() => toggle('grouped')} className="btn btn-sm">
        {selectedFepLeft.grouped ? 'Grouped ✅' : 'Grouped ❌'}
      </button>
      <button onClick={() => toggle('pinned')} className="btn btn-sm">
        {selectedFepLeft.pinned ? 'Pinned ✅' : 'Pinned ❌'}
      </button>
      <button onClick={() => toggle('sortAlpha')} className="btn btn-sm">
        {selectedFepLeft.sortAlpha ? 'Alpha ✅' : 'Alpha ❌'}
      </button>
      <button onClick={() => toggle('sortDate')} className="btn btn-sm">
        {selectedFepLeft.sortDate ? 'Date ✅' : 'Date ❌'}
      </button>
    </div>
  );
};