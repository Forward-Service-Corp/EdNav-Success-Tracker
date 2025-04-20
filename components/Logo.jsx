import React from 'react';
import Link from 'next/link';

function Logo() {
  return (
    <div className="mb-2 p-1 md:mb-4">
      <div className="flex items-center justify-center md:justify-start">
        <Link href="/" className="inline-block">
          <div className="text-[36px] sm:text-[45px] md:text-[57px] font-black italic antialiased -tracking-[5px]">
            <span className="text-secondary z-10 relative drop-shadow-lg shadow-black">ED</span>
            <span className="text-accent -ml-[8px] sm:-ml-[10px] md:-ml-[12px] z-0 relative">NAV</span>
          </div>
          <div
            className="uppercase text-base-content font-light -mt-1 md:-mt-3 text-[12px] sm:text-[15px] md:text-[16px]">
            <p className="leading-1 sm:tracking-[1.5px] md:tracking-[1px]">SUCCESS TRACKER</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Logo;