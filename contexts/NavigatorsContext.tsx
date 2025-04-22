import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Navigator = {
  _id: String;
  name: String;
  pinned: Array<string>;
  preferences: {
    theme: String;
    lastAgeFilter: String;
    lastStatusFilter: String;
  };
  notifications: {
    unread: Array<string>;
    read: Array<string>;
  };
  streak: {
    active: Boolean;
    streak: Number;
    lastDate: String;
    longestStreak: Number;
    longestStreakDate: Number;
  };
};

type NavigatorsContextType = {
  selectedNavigator: {
    _id: String;
    name: String;
    pinned: Array<string>;
    preferences: {
      theme: String;
      lastAgeFilter: String;
      lastStatusFilter: String;
    };
    notifications: {
      unread: Array<string>;
      read: Array<string>;
    };
    streak: {
      active: Boolean;
      streak: Number;
      lastDate: String;
      longestStreak: Number;
      longestStreakDate: Number;
    };
  };
  setSelectedNavigator: Dispatch<SetStateAction<Navigator | null>>;
};

export const NavigatorContext = createContext<
  NavigatorsContextType | undefined
>(undefined);

export const NavigatorProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNavigator, setSelectedNavigator] = useState<{} | null>(null);

  return (
    // @ts-ignore
    <NavigatorContext.Provider
      value={{ selectedNavigator, setSelectedNavigator }}
    >
      {children}
    </NavigatorContext.Provider>
  );
};

// Custom hook for consuming context
export const useNavigators = () => {
  const context = useContext(NavigatorContext);
  if (!context) {
    throw new Error("useNavigators must be used within a NavigatorContext");
  }
  return context;
};
