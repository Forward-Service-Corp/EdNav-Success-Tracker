'use client';
import React, { useState } from 'react';
import { useEditing } from '/contexts/EditingContext';
import LeftNavEntire from '/components/LeftNavEntire';
import ClientTable from '/components/ClientTable';
import AddClientForm from './AddClientForm';
import ClientProfile from './ClientProfile';

export default function PerfectLayout() {
  const [menuClosed, setMenuClosed] = useState(false);
  const { editing } = useEditing();

  return (
    <div className={`flex h-screen w-screen no-scrollbar transition-all duration-700`}>
      {/*NAV AND CLIENT TABLE*/}
      <div className={`flex w-5/12 `}>
        <div className={`h-screen w-3/7 overflow-x-hidden overflow-y-scroll no-scrollbar transition-all duration-700 `}>
          <LeftNavEntire />
        </div>
        <div className={`h-screen w-4/7 overflow-x-hidden overflow-y-scroll no-scrollbar transition-all duration-700 `}>
          <ClientTable setMenuClosed={setMenuClosed} menuClosed={menuClosed} />
        </div>
      </div>

      <div className={`flex w-7/12`}>
        <div
          className={`h-screen overflow-x-hidden overflow-y-scroll no-scrollbar transition-all duration-600 ${editing === 'client' ? 'translate-x-[0px] w-full' : '-translate-x-[4000px] w-0'}`}>
          <ClientProfile />
        </div>
        <div
          className={`h-screen overflow-x-clip overflow-y-scroll no-scrollbar transition-all duration-600 ${editing === 'add-client' ? 'translate-x-[0px] w-full' : '-translate-x-[4000px] w-0'}`}>
          <AddClientForm />
        </div>

      </div>
      {/*CLIENT PROFILE AND ADD NEW CLIENT FORM*/}

    </div>

    // <div className={`w-full flex flex-row h-screen`}>
    //   {/*NAV AND CLIENT TABLE*/}
    //   <div
    //     className={`flex h-screen transition-all duration-600 ${menuClosed ? '-translate-x-[230px]' : 'translate-x-0'}`}>
    //     <div className={`w-[230px] h-full box-border transition-all duration-700 ${!menuClosed ? ' ' : ''}`}>
    //       <LeftNavEntire />
    //     </div>
    //     <div
    //       className={`w-[350px] transition-all duration-800 box-border ${menuClosed ? 'w-[700px]' : ''} overflow-y-scroll overflow-x-visible bg-base-300/40 drop-shadow-2xl  no-scrollbar flex-col h-screen z-40 relative`}>
    //       <ClientTable setMenuClosed={setMenuClosed} menuClosed={menuClosed} />
    //     </div>
    //   </div>
    //
    //   {/*CLIENT PROFILE AND ADD NEW CLIENT FORM*/}
    //   <div className={`flex h-screen flex-1 bg-base-100 overflow-hidden ${menuClosed ? '' : 'translate-x-0'}`}>
    //     <div
    //       className={`transition-all duration-700 relative ${editing === 'client' ? '' : '-translate-x-[4000px]  w-0'}`}>
    //       <ClientProfile />
    //     </div>
    //     <div
    //       className={`overflow-y-scroll transition-all duration-700 relative ${editing === 'add-client' ? 'flex-1 ' : 'translate-x-[4000px]  w-0'}`}>
    //       <AddClientForm />
    //     </div>
    //   </div>
    // </div>
  );
}
