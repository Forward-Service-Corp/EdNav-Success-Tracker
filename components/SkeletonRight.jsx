import { useLoading } from "../contexts/LoadingContext";
import { useNotification } from "../contexts/NotificationContext";

function SkeletonRight() {
  const { loading } = useLoading();
  const { setNotify } = useNotification(false);

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
      className={`no-scrollbar col-span-14 mr-3 ml-2 h-full space-y-6 overflow-y-scroll ${loading ? "visible" : "hidden"}`}
    >
      <div
        className={`bg-base-200 flex w-full items-center justify-between rounded p-6 ${loading ? "visible" : "hidden"}`}
      >
        <div className="skeleton h-10 w-70 rounded"></div>
        <div className="skeleton h-7 w-32 rounded"></div>
      </div>
      <div className="bg-base-200 flex min-h-75 w-full flex-col justify-between rounded p-6">
        <div className="flex items-start justify-between">
          <div className={`mb-6`}>
            <div className="skeleton mb-4 h-10 w-70 rounded"></div>
            <div className="skeleton h-5 w-160 rounded"></div>
          </div>
          <div className="skeleton h-8 w-32 rounded"></div>
        </div>

        <div
          className={`border-info/15 relative my-5 min-h-7 w-full overflow-clip rounded-full border-1`}
        >
          <div
            className={`bg-info/14 absolute top-0 bottom-0 left-0 w-[61%]`}
          />
        </div>
        <div className={`mt-6`}>
          {[...Array(14)].map((_, i) => (
            <span
              key={i}
              className={`skeleton ${widths[i]} border-info/15 m-2 inline-block rounded-full border-1 p-0.5`}
              onClick={() => setNotify(true)}
            >
              <div
                className={`flex h-full w-full items-center justify-start rounded-full`}
              >
                <span
                  className={`bg-info/10 border-info/20 my-0.5 mr-0 ml-1 block h-6 w-6 rounded-full border-1 shadow`}
                />
                <span className={`text-info w-full text-center text-xs`}>
                  Label
                </span>
              </div>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkeletonRight;
