import { useFepsLeft } from '../contexts/FepsLeftContext';

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
        htmlFor={`filter-radio-6`}
      >
        <p>All</p>
        <input
          value="All"
          onClick={handleFilterChange}
          id={`filter-radio-6`}
          type="radio"
          name="filter-radio-age"
          className="radio radio-sm radio-base-content mt-3"
          defaultChecked
        />
      </label>

      <label
        className={`flex flex-col items-center justify-center`}
        htmlFor={`filter-radio-7`}
      >
        <p>Adult</p>
        <input
          value="Adult"
          onClick={handleFilterChange}
          id={`filter-radio-7`}
          type="radio"
          name="filter-radio-age"
          className="radio radio-sm radio-success mt-3"
        />
      </label>

      <label
        className={`flex flex-col items-center justify-center`}
        htmlFor={`filter-radio-8`}
      >
        <p>Youth</p>
        <input
          value="Youth"
          onClick={handleFilterChange}
          id={`filter-radio-8`}
          type="radio"
          name="filter-radio-age"
          className="radio radio-sm radio-info mt-3"
        />
      </label>
    </div>
  );
}

export default FilterSelectRadiosAge;
