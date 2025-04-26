import { useFepsLeft } from '../contexts/FepsLeftContext';
import React, { useEffect } from 'react';

function FilterSelectRadios() {
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();

  // Force "All" status on an initial load
  useEffect(() => {
    setSelectedFepLeft((prevState) => {
      if (prevState.status !== 'All') {
        // console.log('Setting status to All');
        return { ...prevState, status: 'All' };
      }
      return prevState;
    });
  }, [setSelectedFepLeft]);

  const handleFilterChange = (e) => {
    setSelectedFepLeft((prevState) => {
      return { ...prevState, status: e.target.value };
    });
  };

  return (
    <div className="flex items-end gap-2 space-y-6">
      <div
        className={`text-base-content grid w-full grid-cols-3 gap-8 text-xs font-light tracking-widest`}
      >
        <label
          htmlFor={`filter-radio-1`}
          className={`flex flex-col items-center justify-around`}
        >
          All
          <input
            value="All"
            onClick={handleFilterChange}
            id={`filter-radio-1`}
            type="radio"
            name="filter-radio-status"
            className="radio radio-sm radio-base-content mt-3"
            checked={selectedFepLeft.status === 'All'}
            onChange={() => {
            }} // React requires onChange with checked prop
          />
        </label>

        <label
          htmlFor={`filter-radio-2`}
          className={`flex flex-col items-center justify-between whitespace-nowrap`}
        >
          In Progress
          <input
            value="In Progress"
            onClick={handleFilterChange}
            id={`filter-radio-2`}
            type="radio"
            name="filter-radio-status"
            className="radio radio-sm radio-success mt-3"
            checked={selectedFepLeft.status === 'In Progress'}
            onChange={() => {
            }}
          />
        </label>

        <label
          htmlFor={`filter-radio-3`}
          className={`flex flex-col items-center justify-between`}
        >
          Active
          <input
            value="Active"
            onClick={handleFilterChange}
            id={`filter-radio-3`}
            type="radio"
            name="filter-radio-status"
            className="radio radio-sm radio-info mt-3"
            checked={selectedFepLeft.status === 'Active'}
            onChange={() => {
            }}
          />
        </label>
        <div className={`w-[180px] flex items-center justify-around`}>
          <label
            htmlFor={`filter-radio-4`}
            className={`flex flex-col items-center justify-between`}
          >
            Graduated
            <input
              value="Graduated"
              onClick={handleFilterChange}
              id={`filter-radio-4`}
              type="radio"
              name="filter-radio-status"
              className="radio radio-sm radio-warning mt-3"
              checked={selectedFepLeft.status === 'Graduated'}
              onChange={() => {
              }}
            />
          </label>

          <label
            htmlFor={`filter-radio-5`}
            className={`flex flex-col items-center justify-between`}
          >
            Inactive
            <input
              value="Inactive"
              onClick={handleFilterChange}
              id={`filter-radio-5`}
              type="radio"
              name="filter-radio-status"
              className="radio radio-sm radio-error mt-3"
              checked={selectedFepLeft.status === 'Inactive'}
              onChange={() => {
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default FilterSelectRadios;