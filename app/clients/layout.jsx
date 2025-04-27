"use client";
import React from 'react';
import Notification from '../../components/Notification';
import { useNotification } from '../../contexts/NotificationContext';
import BreakpointIndicator from '../../components/helpers/breakpoint';

function Layout({ children }) {
  const { notify, setNotify } = useNotification(false);
  return (
    <div className={`no-scrollbar bg-base-100 h-screen w-screen`}>
      {children}
      <Notification show={notify} setShow={setNotify} />
      <BreakpointIndicator />
    </div>
  );
}

export default Layout;