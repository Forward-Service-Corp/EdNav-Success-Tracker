import React from 'react';
import Link from 'next/link';

function Logo() {
  return (
    <div className="mb-5 pl-1 text-center">
      <div className="flex items-center justify-center md:justify-start">
        <Link href="/" className="inline-block">
          <div
            className="text-[28px] sm:text-[40px] md:text-[49px] font-black  antialiased -tracking-[2px] text-center">
            <span className="text-error relative drop-shadow shadow-black">ED</span>
            <span className="text-info -ml-[4px] sm:-ml-[5px] md:-ml-[6px]">NAV</span>
          </div>
          <div
            className="uppercase text-base-content  -mt-1 md:-mt-3 text-[12px] sm:text-[15px] md:text-[14px]">
            <p className="leading-1">SUCCESS TRACKER</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Logo;