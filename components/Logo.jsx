import React from "react";
import Link from "next/link";

function Logo() {
  return (
    <div className="mb-5 pl-1 text-center">
      <div className="flex items-center justify-center md:justify-start">
        <Link href="/" className="inline-block">
          <div className="text-center text-[28px] font-black -tracking-[2px] antialiased sm:text-[40px] md:text-[49px]">
            <span className="text-error relative shadow-black drop-shadow">
              ED
            </span>
            <span className="text-info -ml-[4px] sm:-ml-[5px] md:-ml-[6px]">
              NAV
            </span>
          </div>
          <div className="text-base-content text-[12px] uppercase sm:text-[15px] md:-mt-2 md:text-[15px]">
            <p className="leading-1">SUCCESS TRACKER</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Logo;