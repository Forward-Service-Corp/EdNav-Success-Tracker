import { useFepsLeft } from "@/contexts/FepsLeftContext";

function FilterSelectRadiosAge() {
  const { setSelectedFepLeft } = useFepsLeft();

  const handleFilterChange = (e) => {
    setSelectedFepLeft((prevState) => {
      return { ...prevState, age: e.target.value };
    });
  };

  return (
    <div className="text-base-content flex items-center justify-around gap-2 text-xs font-light tracking-widest">
      <label
        className={`flex flex-col items-center justify-center`}
        htmlFor={`filter-radio-1`}
      >
        <p>All</p>
        <input
          value="All"
          onClick={handleFilterChange}
          id={`filter-radio-1`}
          type="radio"
          name="filter-radio-age"
          className="radio radio-base-content mt-3"
          defaultChecked
        />
      </label>

      <label
        className={`flex flex-col items-center justify-center`}
        htmlFor={`filter-radio-2`}
      >
        <p>Adult</p>
        <input
          value="Adults"
          onClick={handleFilterChange}
          id={`filter-radio-2`}
          type="radio"
          name="filter-radio-age"
          className="radio radio-success mt-3"
        />
      </label>

      <label
        className={`flex flex-col items-center justify-center`}
        htmlFor={`filter-radio-3`}
      >
        <p>Youth</p>
        <input
          value="Youth"
          onClick={handleFilterChange}
          id={`filter-radio-3`}
          type="radio"
          name="filter-radio-age"
          className="radio radio-info mt-3"
        />
      </label>
    </div>
  );
}

export default FilterSelectRadiosAge;
