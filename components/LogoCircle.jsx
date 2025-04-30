import React from 'react';

function LogoCircle() {
  return (
    <div className="text-center relative  w-[164px] h-[164px]">
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-center w-[164px] h-[164px] bg-base-300 rounded-full`}>
        <div className={`text-[150px] antialiased -tracking-[4px] font-bold italic relative flex`}><span
          className={`text-primary z-20 inline-block`}>E</span><span
          className={`text-secondary -ml-8 z-0 inline-block`}>N</span></div>
      </div>
    </div>
  );
}

export default LogoCircle;