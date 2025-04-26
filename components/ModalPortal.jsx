'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ActivityDynamicSelect from './ActivityDynamicSelect';

// This is a standalone portal-based modal that doesn't depend on other components
export default function ModalPortal() {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState({});

  useEffect(() => {
    // Add a global function to open this modal directly
    if (typeof window !== 'undefined') {
      window.directOpenModal = () => {
        // console.log('Opening modal via direct portal');
        setIsOpen(true);
      };

      // Listen for the custom event
      const handleOpenModal = () => {
        // console.log('Modal portal received event:', event.detail);
        setIsOpen(true);
      };

      window.addEventListener('openActivityModal', handleOpenModal);

      // Load questions
      const loadQuestions = async () => {
        try {
          const response = await fetch('/api/questions');
          const data = await response.json();
          setQuestions(data);
          // console.log('Modal portal loaded questions:', data);
        } catch (error) {
          console.error('Error loading questions:', error);
          setQuestions({ adult: {}, youth: {} });
        }
      };

      loadQuestions().then();

      return () => {
        delete window.directOpenModal;
        window.removeEventListener('openActivityModal', handleOpenModal);
      };
    }
  }, []);

  // Handle successful activity
  const handleSuccess = (result) => {
    // console.log('Activity added via portal:', result);
    setIsOpen(false);

    // Dispatch success event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('activityAdded', {
        detail: result,
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(event);
    }
  };

  if (!isOpen) return null;

  // If we're in a browser, create a portal to ensure the modal renders at the root
  if (typeof document !== 'undefined') {
    return createPortal(
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        {/* Backdrop/overlay */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        {/* Modal container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div
            className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add an activity
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ActivityDynamicSelect
              setOpen={() => setIsOpen(false)}
              questions={questions}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
}