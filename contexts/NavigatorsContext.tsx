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
  selectedNavigator: Navigator | null;
  setSelectedNavigator: Dispatch<SetStateAction<Navigator | null>>;
};

export const NavigatorsContext = createContext<NavigatorsContextType>({
  selectedNavigator: null,
  setSelectedNavigator: () => {},
});

export const NavigatorsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNavigator, setSelectedNavigator] = useState<Navigator | null>(
    null,
  );

  return (
    <NavigatorsContext.Provider
      value={{ selectedNavigator, setSelectedNavigator }}
    >
      {children}
    </NavigatorsContext.Provider>
  );
};

// Custom hook for consuming context
export const useNavigators = () => {
  const context = useContext(NavigatorsContext);
  if (!context) {
    throw new Error("useNavigators must be used within a NavigatorContext");
  }
  return context;
};
