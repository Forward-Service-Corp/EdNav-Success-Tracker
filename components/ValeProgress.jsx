import { useEffect, useState } from 'react';

export default function ProgressTracker({ clientId, initialProgress, clientType, updateProfileStatus }) {
  const [localProgress, setLocalProgress] = useState({});
  const [savedProgress, setSavedProgress] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize progress state from database
    const progressMap = {};
    initialProgress?.forEach(item => {
      progressMap[item.name] = item.completed; // Assume each item has { name, completed }
    });
    setLocalProgress(progressMap);
    setSavedProgress(progressMap);
  }, [initialProgress]);

  const toggleProgressItem = (itemName) => {
    if (savedProgress[itemName]) return; // Can't uncheck saved items
    setLocalProgress(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const calculateProgressPercent = () => {
    const total = Object.keys(localProgress).length;
    const completed = Object.values(localProgress).filter(Boolean).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    const completedItems = Object.keys(localProgress).filter(item => localProgress[item]);

    try {
      await fetch(`/api/clients/${clientId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedItems })
      });

      // Lock saved progress locally
      const locked = {};
      completedItems.forEach(item => locked[item] = true);
      setSavedProgress(locked);

      // Check if full completion happened
      if (calculateProgressPercent() === 100) {
        // Youth graduate, adults become inactive
        const newStatus = clientType === 'youth' ? 'Graduated' : 'Inactive';
        await updateProfileStatus(clientId, newStatus);
      }

    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-base-100 p-4 rounded shadow flex flex-col gap-4">
      <div className="text-lg font-semibold">
        GED Progress – {calculateProgressPercent()}%
      </div>

      <div className="w-full bg-base-300 rounded-full h-3">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-500"
          style={{ width: `${calculateProgressPercent()}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {Object.keys(localProgress).map((itemName, idx) => (
          <button
            key={idx}
            onClick={() => toggleProgressItem(itemName)}
            disabled={savedProgress[itemName]}
            className={`px-3 py-1 rounded-full border text-xs transition-all duration-300
              ${localProgress[itemName] ? 'bg-primary text-white' : 'bg-base-200 hover:bg-base-300'}
              ${savedProgress[itemName] ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {itemName}
          </button>
        ))}
      </div>

      <button
        onClick={handleSaveProgress}
        disabled={saving}
        className="btn btn-primary w-full mt-4"
      >
        {saving ? 'Saving...' : 'Save Progress'}
      </button>

      <p className="text-xs text-base-content/50 mt-2">
        <em>Note: Items saved to the database cannot be unchecked.</em>
      </p>
    </div>
  );
}