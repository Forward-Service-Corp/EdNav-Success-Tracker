"use client";
import { useNavigator } from '/contexts/NavigatorsContext';
import { useEffect } from 'react';

function NavigatorSelector() {
  const { selectedNavigator, setSelectedNavigator, navigatorList } = useNavigator();

  useEffect(() => {

  }, [selectedNavigator])

  return (
    <div className="relative" style={{ zIndex: 10 }}>
      <select
        id="navigator-select"
        value={selectedNavigator || ''}
        onChange={(e) => {
          setSelectedNavigator(e.target.value);
        }}
        className="select select-info border-info/50 mt-2 capitalize">
        <option value="" disabled>
          Select a navigator
        </option>
        <option value="All">All</option>
        {navigatorList.map((nav, index) => (
          <option key={index} value={nav?.name || 'All'}>
            {nav?.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default NavigatorSelector;