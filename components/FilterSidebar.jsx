"use client";

import { useFepsLeft } from "@/contexts/FepsLeftContext";
import { useNavigators } from "@/contexts/NavigatorsContext";

export default function FilterSidebar({
  menuOpen,
  setMenuOpen,
  toggleSidebar,
}) {
  const {
    navigators = [],
    selectedNavigator,
    setSelectedNavigator,
  } = useNavigators();
  const { selectedFepLeft, setSelectedFepLeft } = useFepsLeft();

  const handleStatusChange = (status) => {
    setSelectedFepLeft({
      ...selectedFepLeft,
      status: status,
    });
  };

  const handleAgeGroupChange = (age) => {
    setSelectedFepLeft({
      ...selectedFepLeft,
      age: age,
    });
  };

  return (
    <div className="bg-base-200 h-full overflow-y-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        <button onClick={toggleSidebar} className="btn btn-ghost btn-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Navigator Filter */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Navigator</h3>
        <select
          className="select select-bordered w-full"
          value={selectedNavigator?.name || "All"}
          onChange={(e) => {
            const selected = navigators.find(
              (nav) => nav.name === e.target.value,
            ) || { name: "All" };
            setSelectedNavigator(selected);
          }}
        >
          {navigators.map((navigator) => (
            <option key={navigator.name || "default"} value={navigator.name}>
              {navigator.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Status</h3>
        <div className="flex flex-col space-y-2">
          {["All", "active", "inactive", "graduated", "pending"].map(
            (status) => (
              <label key={status} className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="status"
                  className="radio radio-sm mr-2"
                  checked={selectedFepLeft.status === status}
                  onChange={() => handleStatusChange(status)}
                />
                <span className="capitalize">{status}</span>
              </label>
            ),
          )}
        </div>
      </div>

      {/* Age Group Filter */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Group</h3>
        <div className="flex flex-col space-y-2">
          {["All", "youth", "adult"].map((age) => (
            <label key={age} className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="ageGroup"
                className="radio radio-sm mr-2"
                checked={selectedFepLeft.age === age}
                onChange={() => handleAgeGroupChange(age)}
              />
              <span className="capitalize">{age}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Search Reset */}
      <button
        className="btn btn-outline btn-sm w-full"
        onClick={() =>
          setSelectedFepLeft({
            ...selectedFepLeft,
            searchTerm: "",
            status: "All",
            age: "All",
          })
        }
      >
        Reset Filters
      </button>
    </div>
  );
}
