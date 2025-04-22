import { useLoading } from "../contexts/LoadingContext";
import ThemeSwitcher from "./ThemeSwitcher";

function SkeletonLeft() {
  const { loading } = useLoading();

  if (loading) {
    return (
      <div className={`bg-base-200 col-span-3 ml-3 h-full p-4`}>
        <div className={`bg-base-100 mb-6 space-y-3 rounded p-3`}>
          <div className="skeleton h-12 w-full cursor-pointer rounded opacity-85 hover:opacity-100" />
          <div className="skeleton h-12 w-full cursor-pointer rounded opacity-85 hover:opacity-100" />
          <div className="skeleton h-12 w-full cursor-pointer rounded opacity-85 hover:opacity-100" />
          <div className="skeleton h-12 w-full cursor-pointer rounded opacity-85 hover:opacity-100" />
          <div className="skeleton h-12 w-full cursor-pointer rounded opacity-85 hover:opacity-100" />
        </div>

        <div className={`bg-base-100 mb-6 space-y-3 rounded p-3`}>
          <div className="skeleton h-12 w-full cursor-pointer rounded opacity-85 hover:opacity-100"></div>
          <div className="skeleton h-12 w-full cursor-pointer rounded opacity-85 hover:opacity-100"></div>
          <div className="skeleton h-12 w-full cursor-pointer rounded opacity-85 hover:opacity-100"></div>
        </div>
        <ThemeSwitcher />
      </div>
    );
  }

  return (
    <div className={`col-span-5 h-full`}>
      {/*<Sidebar/>*/}
      {/*<LeftNavEntire/>*/}
    </div>
  );
}

export default SkeletonLeft;
