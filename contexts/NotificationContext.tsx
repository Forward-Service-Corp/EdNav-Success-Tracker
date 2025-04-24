import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Notification = {
  type: string;
  message: string;
  active: boolean;
};

type NotificationContextType = {
  notify: Notification | null;
  setNotification: Dispatch<SetStateAction<Notification | null>>;
};

const NotificationContext = createContext<NotificationContextType>({
  notify: null,
  setNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notify, setNotification] = useState<Notification | null>(null);

  return (
    <NotificationContext.Provider value={{ notify, setNotification }}>
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
