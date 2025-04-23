import { useFepsLeft } from "../contexts/FepsLeftContext";

function FilterSelectRadios() {
  const { setSelectedFepLeft } = useFepsLeft();

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
          htmlFor={`filter-radio-1 `}
          className={`flex flex-col items-center justify-around`}
        >
          All
          <input
            value="All"
            onClick={handleFilterChange}
            id={`filter-radio-1`}
            type="radio"
            name="filter-radio-status"
            className="radio radio-base-content mt-3"
            defaultChecked
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
            className="radio radio-success mt-3"
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
            className="radio radio-info mt-3"
          />
        </label>

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
            className="radio radio-warning mt-3"
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
            className="radio radio-error mt-3"
          />
        </label>
      </div>
    </div>
  );
}

export default FilterSelectRadios;
