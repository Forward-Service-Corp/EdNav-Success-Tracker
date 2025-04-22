'use client';
import React from 'react';
import Notification from '../../components/Notification';
import { useNotification } from '../../contexts/NotificationContext';

function Layout({ children }) {
  const { notify, setNotify } = useNotification(false);
  return (
    <div className={`h-screen w-screen overflow-clip box-border flex flex-col no-scrollbar p-3`}>
      {children}
      <Notification show={notify} setShow={setNotify} />
    </div>
  );
}

export default Layout;