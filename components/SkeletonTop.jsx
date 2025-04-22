
function SkeletonTop() {

  return (
    <div className={`grid grid-cols-24 gap-1`}>
      <div className={`col-span-3`}>
        <div className={`top-bars`}>
          <div className="bg-base-300 flex h-20 w-full items-center justify-center rounded">
          </div>
        </div>
      </div>
      <div className={`col-span-6`}>
        <div className={`top-bars`}>
          <div className="bg-base-300/50 h-20 w-full rounded">
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
