import React, { useEffect, useState } from 'react';


function calculateCompletionPercentage(items) {
  if (!Array.isArray(items) || items.length === 0) return 0;

  const completedCount = items.filter((item) => item && item.completed === true).length;
  const totalCount = items.length;

  return ((completedCount / totalCount) * 100).toFixed(1);
}

function ClientProfileProgress({ selectedClient, hasTrackable, isNarrow }) {
  const [displayItems, setDisplayItems] = useState(() =>
    Array.isArray(selectedClient?.trackable?.items) ? [...selectedClient.trackable.items] : []
  );
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const items = selectedClient?.trackable?.items;
    if (Array.isArray(items)) {
      setDisplayItems([...items]);
      const percentage = calculateCompletionPercentage(items);
      setCompletionPercentage(percentage);
    } else {
      setDisplayItems([]);
      setCompletionPercentage(0);
    }
  }, [hasTrackable]);

  const isProgressVisible = selectedClient?.trackable?.program === 'GED' ||
    selectedClient?.trackable?.program === 'HSED' ||
    (typeof window !== 'undefined' && selectedClient?._id && selectedClient?.trackable?.program === 'GED/HSED');

  // Render trackable items with guard for displayItems
  const renderTrackableItems = () => {
    if (!Array.isArray(displayItems)) {
      console.error('displayItems is not an array:', displayItems);
      return <div className="text-error">Trackable items failed to load.</div>;
    }
    if (displayItems.length === 0) {
      return <div className="text-warning">No trackable items available for this client.</div>;
    }

    return displayItems.map((item, index) => (
      <ProgressButton
        key={index}
        item={item}
        index={index}
        isDisabled={item?.completed}
        allItems={displayItems}
      />
    ));
  };

  return (
    <div>
    <div className={`relative`}>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${isProgressVisible ? 'invisible' : 'visible'}`}
      >
        <div
          className={`text-base-content bg-base-300 m-auto max-w-3/4 rounded p-6 text-center shadow`}
        >
          Add an activity regarding GED or HSED to activate this area.
        </div>
      </div>
      <div
        className={`bg-base-200 relative rounded shadow ${isProgressVisible ? '' : 'opacity-50 blur-[2px]'}`}
        data-testid="progress-area"
      >
        <div className="card-body">
          <div className={`mt-0 mb-4 flex items-center justify-between`}>
            <div>
              <div className={`${isNarrow ? 'text-lg' : 'text-2xl'} flex items-center gap-2`}>
                {selectedClient?.trackable?.program || 'Program'} Progress -{' '}
                {completionPercentage}%
              </div>
              <p className={`text-info text-sm`}>
                Click items to mark them as completed.
              </p>
              <p className={`text-xs opacity-70 mt-1`}>
                <span className="font-medium">Note:</span> Items saved to the database cannot be unchecked.
              </p>
            </div>

            {/*<div*/}
            {/*  onClick={handleTrackableUpdate}*/}
            {/*  className={`${updated || recentlySelectedProgram || newSelections.length > 0? 'btn btn-sm btn-secondary': 'hidden' }`}*/}
            {/*  data-testId="save-progress-button"*/}
            {/*>*/}
            {/*  {isUpdating ? 'Saving...' : 'Save Progress'}*/}
            {/*</div>*/}
          </div>
          <div className="card-actions justify-end">
            <progress
              className="progress progress-success w-full"
              value={completionPercentage}
              max="100"
            ></progress>
            <div className={`mt-4 flex flex-wrap gap-3`}>
              {renderTrackableItems()}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default ClientProfileProgress;