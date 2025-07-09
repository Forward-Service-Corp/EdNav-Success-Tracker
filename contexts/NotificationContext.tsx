import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

type Notification = {
  type: string;
  message: string;
  active: boolean;
};

type NotificationContextType = {
  notify: Notification | null;
  setNotification: Dispatch<SetStateAction<Notification | null>>;
  clearNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notify: null,
  setNotification: () => {},
  clearNotification: () => {
  }
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notify, setNotification] = useState<Notification | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear notification without affecting other state
  const clearNotification = useCallback(() => {
    if (notify) {
      setNotification(prev => {
        if (!prev) return null;
        return { ...prev, active: false };
      });
    }
  }, [notify]);

  // Set up auto-dismiss timer whenever notification state changes
  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Set up a new timer if there's an active notification
    if (notify && notify.active) {
      timerRef.current = setTimeout(() => {
        clearNotification();
      }, 3000);
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [notify, clearNotification]);

  return (
    <NotificationContext.Provider value={{ notify, setNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for consuming context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
