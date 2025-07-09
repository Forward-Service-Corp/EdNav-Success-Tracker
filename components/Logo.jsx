import React from 'react';
import Link from 'next/link';

function Logo() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="">
        <Link href="/" className="block p-0 m-0">
          <div className="text-[24px] font-black -tracking-[2px] antialiased sm:text-[38px] md:text-[58px]">
            <span className="text-primary relative italic shadow-black drop-shadow p-0 -mt-3">
              ED
            </span>
            <span className="text-secondary/70 -ml-[9px] sm:-ml-[5px] md:-ml-[10px]">
              NAV
            </span>
          </div>
          <div
            className="text-base-content -ml-3 text-[14px] font-extralight tracking-[1px] uppercase sm:text-[15px] md:-mt-2 md:text-[17px]">
            <p className="leading-1 text-center">SUCCESS TRACKER</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Logo;