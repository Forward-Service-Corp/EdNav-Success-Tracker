'use client';
import React from 'react';
import { useNotification } from '../../../contexts/NotificationContext';
import ThemeSwitcher from '../../../components/ThemeSwitcher';

function ClientsPage() {
  const getRandomWidthClass = () => {
    const min = 33;
    const max = 49;
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return `w-${value}`;
  };
  const { notify, setNotify } = useNotification(false);

  const widths = [
    'w-35', 'w-41', 'w-33', 'w-40', 'w-39', 'w-36', 'w-43', 'w-41', 'w-35', 'w-39',
    'w-33', 'w-50', 'w-36', 'w-43', 'w-50', 'w-35', 'w-41', 'w-36', 'w-33', 'w-39',
    'w-43', 'w-35', 'w-50', 'w-41', 'w-36', 'w-39', 'w-33', 'w-43', 'w-41', 'w-35',
    'w-39', 'w-50', 'w-36', 'w-33', 'w-43', 'w-41', 'w-35', 'w-50', 'w-39', 'w-36',
    'w-33', 'w-43'
  ];
  const otherWidths = [
    'w-18', 'w-21', 'w-15', 'w-22', 'w-20', 'w-17', 'w-24', 'w-22', 'w-16', 'w-21',
    'w-14', 'w-21', 'w-21', 'w-25', 'w-20', 'w-26', 'w-31', 'w-17', 'w-25', 'w-20',
    'w-24', 'w-17', 'w-29', 'w-23', 'w-19', 'w-21', 'w-24', 'w-25', 'w-22', 'w-26',
    'w-20', 'w-31', 'w-18', 'w-15', 'w-24', 'w-23', 'w-16', 'w-30', 'w-21', 'w-18',
    'w-24', 'w-25'
  ];

  const badgeWidths = ['w-61', 'w-68', 'w-59', 'w-64', 'w-60', 'w-50', 'w-66', 'w-61', 'w-58', 'w-63',
    'w-56', 'w-74', 'w-50', 'w-58', 'w-72', 'w-53', 'w-67', 'w-62', 'w-48', 'w-64'];

  return (
    <>
      <div className={`grid grid-cols-24 gap-1 my-2`}>
        <div className={`col-span-4`}>
          <div className={`top-bars`}>
            <div className="bg-base-300 rounded h-20 w-full"></div>
          </div>
        </div>
        <div className={`col-span-6`}>
          <div className={`top-bars`}>
            <div className="bg-base-300 rounded h-20 w-full"></div>
          </div>
        </div>
        <div className={`col-span-14`}>
          <div className={`top-bars`}>
            <div className="bg-base-300 rounded h-20 w-full"></div>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-24 h-full gap-5 pb-4`}>
        <div className={`col-span-4 h-full bg-base-200 ml-3 p-4`}>
          <div className={`bg-base-100 p-3 space-y-3 rounded mb-6`}>
            <div className="w-full skeleton h-12 opacity-85 hover:opacity-100 cursor-pointer rounded"></div>
            <div className="w-full skeleton h-12 opacity-85 hover:opacity-100 cursor-pointer rounded"></div>
            <div className="w-full skeleton h-12 opacity-85 hover:opacity-100 cursor-pointer rounded"></div>
            <div className="w-full skeleton h-12 opacity-85 hover:opacity-100 cursor-pointer rounded"></div>
            <div className="w-full skeleton h-12 opacity-85 hover:opacity-100 cursor-pointer rounded"></div>
          </div>

          <div className={`bg-base-100 mb-6 p-3 space-y-3 rounded`}>
            <div className="w-full skeleton h-12 opacity-85 hover:opacity-100 cursor-pointer rounded"></div>
            <div className="w-full skeleton h-12 opacity-85 hover:opacity-100 cursor-pointer rounded"></div>
            <div className="w-full skeleton h-12 opacity-85 hover:opacity-100 cursor-pointer rounded"></div>
          </div>
          <ThemeSwitcher />
        </div>
        <div className={`col-span-6 h-full ml-3 overflow-y-scroll no-scrollbar`}>
          {[...Array(42)].map((_, i) => (
            <div key={i}
                 className="p-4 bg-base-200 rounded mb-4 flex items-center justify-between hover:opacity-100 cursor-pointer">
              <div className={`skeleton h-8 ${widths[i]} rounded`}></div>
              <div className={`flex items-center gap-4`}>
                <div className={`skeleton h-8 w-8 rounded`}></div>
                <div className={`skeleton h-8 ${otherWidths[i]} rounded`}></div>
              </div>
            </div>
          ))}
        </div>


        <div className={`col-span-14 h-full mr-3 ml-2 space-y-6 overflow-y-scroll no-scrollbar`}>
          <div className="bg-base-200 rounded p-6 w-full flex justify-between items-center">
            <div className="w-70 skeleton h-10  rounded"></div>
            <div className="w-32 skeleton h-7  rounded"></div>
          </div>
          <div className="bg-base-200 rounded p-6 min-h-75 w-full flex flex-col justify-between ">
            <div className="flex justify-between items-start">
              <div className={`mb-6`}>
                <div className="w-70 skeleton h-10  mb-4 rounded"></div>
                <div className="w-160 skeleton h-5  rounded"></div>
              </div>
              <div className="w-32 skeleton h-8  rounded"></div>
            </div>

            <div className={`w-full min-h-7 relative rounded-full my-5 border-1 border-info/15 overflow-clip`}>
              <div className={`absolute top-0 left-0 w-[61%] bottom-0 bg-info/14`} />
            </div>
            <div className={`mt-6`}>
              {[...Array(14)].map((_, i) => (
                <span key={i}
                      className={`skeleton ${widths[i]} inline-block p-0.5 rounded-full m-2 border-1 border-info/15`}
                      onClick={() => setNotify(true)}>
                <div className={`flex items-center justify-start w-full h-full rounded-full `}>
                  <span
                    className={`rounded-full w-6 h-6 bg-info/10 my-0.5 ml-1 mr-0 block shadow border-1 border-info/20`} />
                <span className={`w-full text-center text-info text-xs`}>Label</span>
                </div>
              </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientsPage;
