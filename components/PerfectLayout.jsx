'use client';
import React, { useState } from 'react';
import { useEditing } from '/contexts/EditingContext';
import LeftNavEntire from '/components/LeftNavEntire';
import ClientTable from '/components/ClientTable';
import AddClientForm from './AddClientForm';
import ClientProfile from './ClientProfile';

export default function PerfectLayout() {
  const [menuOpen, setMenuOpen] = useState(true);
  const { editing } = useEditing();

  return (
    <div className={`flex h-screen w-screen no-scrollbar`}>
      <div
        className={`transition-dashboard-panel no-scrollbar bg-base-300 relative z-30 shadow-2xl ${menuOpen ? 'w-[320px]' : 'w-0'}`}>
        <LeftNavEntire />
      </div>
      <div
        className={`transition-dashboard-panel no-scrollbar bg-base-200 relative z-20 shadow-xl ${menuOpen ? 'w-[550px]' : 'w-[100%]'}`}>
        <ClientTable setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      </div>
      <div
        className={`transition-dashboard-panel no-scrollbar relative z-10 ${editing === 'client' ? 'w-full' : 'w-0 '}`}>
        <ClientProfile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
      <div
        className={`transition-dashboard-panel no-scrollbar relative z-10 ${editing === 'add-client' ? 'w-full' : 'w-0'}`}>
        <AddClientForm />
      </div>
    </div>
  );
}