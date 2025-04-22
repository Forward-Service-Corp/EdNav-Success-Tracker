import { useLoading } from "../contexts/LoadingContext";
import Logo from "./Logo";
import SearchField from "./SearchField";

function SkeletonTop() {
  const { loading, setLoading } = useLoading();

  return (
    <div className={`grid grid-cols-24 gap-1`}>
      <div className={`col-span-3`}>
        <div className={`top-bars`}>
          <div className="bg-base-300 flex h-20 w-full items-center justify-center rounded">
            <Logo />
          </div>
        </div>
      </div>
      <div className={`col-span-6`}>
        <div className={`top-bars`}>
          <div className="bg-base-300/50 h-20 w-full rounded">
            <SearchField />
          </div>
        </div>
      </div>
      <div className={`col-span-14`}>
        <div className={`top-bars`}>
          <div className="bg-base-200 h-20 w-full rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonTop;
