"use client";
import { useNavigator } from '/contexts/NavigatorsContext';
import { useEffect } from 'react';

function NavigatorSelector() {
  const { selectedNavigator, setSelectedNavigator, navigatorList } = useNavigator();

  useEffect(() => {

  }, [selectedNavigator])

  return (
    <div className="w-[180px]" style={{ zIndex: 10 }}>
      <label htmlFor="theme-select" className="text-sm">Navigator:
      <select
        id="navigator-select"
        value={selectedNavigator || ''}
        onChange={(e) => {
          setSelectedNavigator(e.target.value);
        }}
        className="select capitalize mt-1">
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
      </label>
    </div>
  );
}

export default NavigatorSelector;