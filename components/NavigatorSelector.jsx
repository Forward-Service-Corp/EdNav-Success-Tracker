"use client";
import { useNavigator } from "/contexts/NavigatorsContext";

function NavigatorSelector() {
  const { selectedNavigator, setSelectedNavigator, navigatorList } =
    useNavigator();

  return (
    <div className="w-[180px]" style={{ zIndex: 10 }}>
      <label htmlFor="theme-select" className="text-sm">
        Navigator:
        <select
          id="navigator-select"
          value={selectedNavigator?.name || "All"}
          onChange={(e) => {
            setSelectedNavigator(() => {
              return (
                navigatorList.find((nav) => nav?.name === e.target.value) ||
                "All"
              );
            });
          }}
          className="select mt-1 capitalize"
        >
          <option value="" disabled>
            Select a navigator
          </option>
          <option value="All">All</option>
          "All"vigatorList.map((nav, index) => (
          <option key={index} value={(nav && nav?.name) || "All"}>
            {nav?.name}
          </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default NavigatorSelector;