"use client";
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useNotification } from '../contexts/NotificationContext';
import { useEffect, useRef } from 'react';

export default function Notification() {
  const { notify, setNotification } = useNotification();
  const timerRef = useRef(null);

  // Clean up the previous timer when the component unmounts or notification changes
  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Set a new timer if there's an active notification
    if (notify && notify.active) {
      timerRef.current = setTimeout(() => {
        // Clear the notification without affecting other state
        setNotification(prev => {
          if (!prev) return null;
          return { ...prev, active: false };
        });
      }, 3000);
    }

    // Clean up the timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [notify, setNotification]);

  // No notification to show
  if (!notify || !notify.active) {
    return null;
  }

  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (notify.type) {
      case 'success':
        return <CheckCircleIcon aria-hidden="true" className="size-6 text-green-400" />;
      case 'error':
        return <ExclamationCircleIcon aria-hidden="true" className="size-6 text-red-400" />;
      case 'info':
        return <InformationCircleIcon aria-hidden="true" className="size-6 text-blue-400" />;
      default:
        return <CheckCircleIcon aria-hidden="true" className="size-6 text-green-400" />;
    }
  };

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition show={notify.active}>
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-[closed]:opacity-0 data-[enter]:transform data-[enter]:duration-300 data-[enter]:ease-out data-[closed]:data-[enter]:translate-y-2 data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    {getIcon()}
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-base-content text-sm font-medium">
                      {notify.message || 'Notification'}
                    </p>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        // Just set active to false, don't null the entire notification
                        setNotification(prev => ({ ...prev, active: false }));
                      }}
                      className="inline-flex cursor-pointer rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}