import { useLoading } from "../contexts/LoadingContext";

function SkeletonMiddle() {
  const { loading } = useLoading();

  const otherWidths = [
    "w-18",
    "w-21",
    "w-15",
    "w-22",
    "w-20",
    "w-17",
    "w-24",
    "w-22",
    "w-16",
    "w-21",
    "w-14",
    "w-21",
    "w-21",
    "w-25",
    "w-20",
    "w-26",
    "w-31",
    "w-17",
    "w-25",
    "w-20",
    "w-24",
    "w-17",
    "w-29",
    "w-23",
    "w-19",
    "w-21",
    "w-24",
    "w-25",
    "w-22",
    "w-26",
    "w-20",
    "w-31",
    "w-18",
    "w-15",
    "w-24",
    "w-23",
    "w-16",
    "w-30",
    "w-21",
    "w-18",
    "w-24",
    "w-25",
  ];

  const widths = [
    "w-35",
    "w-41",
    "w-33",
    "w-40",
    "w-39",
    "w-36",
    "w-43",
    "w-41",
    "w-35",
    "w-39",
    "w-33",
    "w-50",
    "w-36",
    "w-43",
    "w-50",
    "w-35",
    "w-41",
    "w-36",
    "w-33",
    "w-39",
    "w-43",
    "w-35",
    "w-50",
    "w-41",
    "w-36",
    "w-39",
    "w-33",
    "w-43",
    "w-41",
    "w-35",
    "w-39",
    "w-50",
    "w-36",
    "w-33",
    "w-43",
    "w-41",
    "w-35",
    "w-50",
    "w-39",
    "w-36",
    "w-33",
    "w-43",
  ];

  return (
    <div
      className={`no-scrollbar col-span-6 ml-3 h-full overflow-y-scroll ${loading ? "visible" : "hidden"}`}
    >
      {[...Array(42)].map((_, i) => (
        <div
          key={i}
          className={`bg-base-200 mb-4 flex cursor-pointer items-center justify-between rounded p-4 hover:opacity-100`}
        >
          <div className={`skeleton h-8 ${widths[i]} rounded`}></div>
          <div className={`flex items-center gap-4`}>
            <div className={`skeleton h-8 w-8 rounded`}></div>
            <div className={`skeleton h-8 ${otherWidths[i]} rounded`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonMiddle;
