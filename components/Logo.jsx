import React from "react";
import Link from "next/link";

function Logo() {
  return (
    <div>
      <div className="flex items-center justify-center md:justify-start">
        <Link href="/" className="inline-block">
          <div className="text-[28px] font-black -tracking-[2px] antialiased sm:text-[40px] md:text-[62px]">
            <span className="text-info relative italic shadow-black drop-shadow">
              ED
            </span>
            <span className="text-base-content/70 -ml-[9px] sm:-ml-[5px] md:-ml-[10px]">
              NAV
            </span>
          </div>
          <div className="text-base-content -ml-1 text-[14px] font-extralight tracking-[1px] uppercase sm:text-[15px] md:-mt-2 md:text-[19px]">
            <p className="leading-1">SUCCESS TRACKER</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Logo;