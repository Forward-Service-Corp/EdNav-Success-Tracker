import React from 'react';
import Link from 'next/link';

function Logo() {
  return (
    <div className="mb-2 px-2 text-center md:mb-4">
      <div className="flex items-center justify-center md:justify-start">
        <Link href="/" className="inline-block">
          <div className="text-[30px] sm:text-[40px] md:text-[50px] font-black italic antialiased -tracking-[2px]">
            <span className="text-error z-10 relative drop-shadow-lg shadow-black">ED</span>
            <span className="text-accent -ml-[4px] sm:-ml-[5px] md:-ml-[6px] z-0 relative">NAV</span>
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