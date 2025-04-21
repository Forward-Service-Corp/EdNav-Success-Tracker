import React, { useEffect, useState } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import { useActivities } from '@/contexts/ActivityContext';
import { generateSentence } from '@/utils/generateSentence';

const ActivityDynamicSelect = ({ setOpen, questions, onSuccess }) => {
  const { selectedActivity, setSelectedActivity } = useActivities();
  const { selectedClient } = useClients();
  const [selectedPath, setSelectedPath] = useState([]);
  const [currentOptions, setCurrentOptions] = useState(Object.keys(questions));
  const [, setCurrentObject] = useState(questions);
  const [finalSelection, setFinalSelection] = useState(null);
  const [multiSelectOptions, setMultiSelectOptions] = useState(null);
  const [multiSelectValues, setMultiSelectValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trackable, setTrackable] = useState(null);
  const [textInput, setTextInput] = useState('');

  const saveSelectionToMongoDB = async (newPath, multi) => {
    setOpen(false);
    const data = {
      clientEmail: selectedClient.email,
      clientId: selectedClient._id,
      fep: selectedClient.fep,
      navigator: selectedClient['navigator'],
      selectedDate: selectedDate,
      selection: selectedValue,
      timestamp: new Date(),
      trackable: trackable,
      selections: multi ? multiSelectValues : null
    };

    if (multi) {
      data.path = selectedPath;
      data.statement = generateSentence(selectedClient['navigator'], selectedClient['first_name'] + ' ' + selectedClient['last_name'], multiSelectValues, selectedPath);
    } else {
      data.path = newPath;
      data.statement = generateSentence(selectedClient['navigator'], selectedClient['first_name'] + ' ' + selectedClient['last_name'], null, newPath);
    }

    try {
      // Use relative URL instead of hardcoded localhost
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      // Notify parent of success
      if (onSuccess) onSuccess(result);

      // If we have a wholeUser property in the result, update the client
      if (result.wholeUser) {
        // setSelectedClient(result.wholeUser); // Uncomment if you need to update the client
      }

      // Update the activity list if actionRes exists
      if (result.userActions) {
        setSelectedActivity(prev => ({
          ...prev,
          activities: result.userActions
        }));
      }

      return result;
    } catch (error) {
      console.error('Error saving activity:', error);
      return null;
    }
  };

  useEffect(() => {
    if (selectedClient?.group) {
      const autoSelection = selectedClient.group.toLowerCase();
      if (questions[autoSelection]) {
        setSelectedPath([autoSelection]);
        setCurrentObject(questions[autoSelection]);
        let options = Object.keys(questions[autoSelection]);
        if (selectedClient?.trackable?.program === 'GED' || selectedClient?.trackable?.program === 'HSED') {
          options = options.filter(opt => opt !== 'GED' && opt !== 'HSED');
        }
        setCurrentOptions(options);
      }
    }
  }, [selectedClient]);

  const handleSelectChange = (value) => {
    setSelectedValue(value);
  };

  const handleAdvance = async () => {
    if (!selectedValue) return;
    let newArray = [...selectedPath];

    const newPath = [...newArray, selectedValue];
    setSelectedPath(newPath);
    setSelectedValue('');
    const newObject = newPath.reduce((acc, key) => (acc && acc[key] ? acc[key] : null), questions);
    setCurrentObject(newObject);

    if (selectedValue === 'GED' || selectedValue === 'HSED') {
      const nextLevel = Object.values(newObject); // go one level deeper
      let items = [];
      if (Array.isArray(nextLevel) && nextLevel.length > 0) {
        items = nextLevel.map(item => ({
          name: item,
          completed: false
        }));
      }
      setTrackable({ type: selectedValue, length: items.length, items: items });
    }

    if (newObject && typeof newObject === 'object') {
      if (Object.keys(newObject).length > 0 && Object.hasOwn(newObject, 'textInput')) {
        setCurrentOptions(prevState => {
          return [...prevState, 'hasTextInput'];
        });
        setTextInput('hasTextInput');
      }
    }

    if (newObject && Object.keys(newObject).length === 0) {
      setCurrentOptions([]);
      setFinalSelection(selectedValue);
      await saveSelectionToMongoDB(newPath, false);
      return;
    }

    if (newObject && typeof newObject === 'object') {
      setFinalSelection(null);
      if (selectedPath.includes(('other'))) {
        setMultiSelectOptions(null);
        setCurrentOptions([]);
        setFinalSelection(selectedValue);
        await saveSelectionToMongoDB(newPath, false);
        return;
      }
      if (Array.isArray(newObject)) {
        setMultiSelectOptions(newObject);
        setCurrentOptions([]);
      } else {
        setMultiSelectOptions(null);
        let options = Object.keys(newObject);
        if (selectedClient?.trackable?.program === 'GED' || selectedClient?.trackable?.program === 'HSED') {
          options = options.filter(opt => opt !== 'GED' && opt !== 'HSED');
        }
        setCurrentOptions(options);
      }
    } else if (Array.isArray(newObject)) {
      setMultiSelectOptions(newObject.completed);
      setCurrentOptions([]);
    } else {
      setCurrentOptions([]);
      setFinalSelection(selectedValue);

      try {
        const result = await saveSelectionToMongoDB(newPath, false);
        if (result && selectedActivity && selectedActivity.activities) {
          setSelectedActivity({
            ...selectedActivity,
            activities: [...selectedActivity.activities, result]
          });
        }
      } catch (error) {
        console.error('Error saving activity:', error);
      }
    }
  };

  const handleMultiSelectChange = (option, index) => {
    console.log(option, index);
    setMultiSelectValues((prev) => {
      if (prev.includes(option)) {
        if (trackable && trackable.items.length > 0) {
          trackable.items[index].completed = !trackable.items[index].completed;
        }
        return prev.filter(item => item !== option);
      } else {
        if (!trackable || !trackable?.items) {
          if (trackable && trackable.items) {
            trackable.items[index].completed = false;
          }
        }
        return [...prev, option];
      }
    });
    if (trackable && trackable?.items.length > 0 && trackable?.program !== 'GED' || trackable?.program !== 'HSED') {
      setTrackable(prev => {
        if (!prev?.items) return prev;

        const updatedItems = [...prev.items];
        updatedItems[index] = { ...updatedItems[index], completed: !updatedItems[index].completed };

        return {
          ...prev,
          items: updatedItems
        };
      });
    }
  };

  const handleMultiSelectAdvance = async () => {
    await saveSelectionToMongoDB(null, true);
    setMultiSelectOptions(null);
    setCurrentOptions([]);
    setFinalSelection('Completed Multi-Select');
  };

  const showDatePicker = selectedPath.length === 1; // Show DatePicker only at the beginning

  return (
    <div className="px-0 py-4 max-w-60 mx-auto">
      {showDatePicker && (
        <label className="flex flex-col space-y-2 text-sm font-light">Date of activity:
          <input
            type="date"
            name="date"
            className="w-full mt-2 border border-base-content text-base-content placeholder:text-base-content rounded py-1 px-3"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))} />
        </label>
      )}
      {selectedPath ?? (
        <div> selectedPath.toString() </div>
      )
      }
      {
        selectedPath && selectedPath.includes('other') && (
          <label className="flex flex-col space-y-2 text-sm font-light">
            <input
              type="text"
              name={selectedPath[selectedPath.length - 1 || 'firstOption']}
              className="w-full mt-2 border border-base-content text-base-content placeholder:text-base-content rounded py-1 px-3"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)} />
            <button
              className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
              onClick={handleAdvance}
            >
              Continue
            </button>
          </label>
        )
      }

      {currentOptions.length > 0 && !selectedPath.includes('other') && (
        <label className="flex flex-col space-y-2 text-sm font-light mt-6 capitalize">
          <select
            name={selectedPath[selectedPath.length - 1] || 'firstOption'}
            className={`w-full mt-2 border border-base-content text-base-content placeholder:text-base-content rounded py-1 px-3`}
            value={selectedValue}
            onChange={(e) => handleSelectChange(e.target.value)}>
            <option value="">Select an activity</option>
            {
              currentOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))
            }
          </select>
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
            onClick={handleAdvance}
            disabled={!selectedValue}
          >
            Continue
          </button>
        </label>
      )}

      {multiSelectOptions && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Select Multiple Options</h3>
          <div className="grid grid-cols-1 gap-2">
            {multiSelectOptions.map((option, index) => (
              <label key={`${option}-${index}`} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  name={selectedPath[selectedPath.length - 1] || 'firstOption'}
                  checked={multiSelectValues.includes(option)}
                  onChange={() => handleMultiSelectChange(option, index)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
            onClick={handleMultiSelectAdvance}
            disabled={multiSelectValues.length === 0}
          >
            Next
          </button>
        </div>
      )}

      {finalSelection && (
        <div className="mt-4 text-green-700">
          Your activity was saved successfully.
        </div>
      )}</div>
  );
};

export default ActivityDynamicSelect;
