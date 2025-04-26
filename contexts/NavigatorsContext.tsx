import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

// Properly typed model with required/optional fields
interface Navigator {
  _id: string;
  name: string;
  pinned: string[];
  preferences: {
    theme: string;
    lastAgeFilter: string;
    lastStatusFilter: string;
  };
  notifications: {
    unread: string[];
    read: string[];
  };
  streak: {
    active: boolean;
    streak: number;
    lastDate: string;
    longestStreak: number;
    longestStreakDate: number;
  };
}

// Type safety with no nulls in the interface
interface NavigatorContextType {
  selectedNavigator: Navigator | null;
  setSelectedNavigator: Dispatch<SetStateAction<Navigator | null>>;
  navigatorList: Navigator[];
  loading: boolean;
  error: string | null;
}

// Context with default values
export const NavigatorContext = createContext<NavigatorContextType>({
  selectedNavigator: null,
  setSelectedNavigator: () => {},
  navigatorList: [],
  loading: false,
  error: null
});

export let NavigatorProvider: ({ children }: { children: React.ReactNode }) => JSX.Element = ({ children }) => {
  const [selectedNavigator, setSelectedNavigator] = useState<Navigator | null>(null);
  const [navigatorList, setNavigatorList] = useState<Navigator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function to avoid recreating on every render
  const fetchNavigatorList = useCallback(async () => {
    setLoading(true);
    setError(null);

    const navigatorsRes = await fetch('/api/navigators');
    // if (!navigatorsRes.ok) {
    //   throw new Error ('Failed to fetch navigators: ${navigatorsRes.status}');
    // }
    const res = await navigatorsRes.json();
    setNavigatorList(res);
    setSelectedNavigator(res[0]);
    setLoading(false);
  }, []);

  // Effect runs only once on a component mount
  useEffect(() => {
    fetchNavigatorList().then();
  }, [fetchNavigatorList]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    selectedNavigator,
    setSelectedNavigator,
    navigatorList,
    loading,
    error
  }), [selectedNavigator, navigatorList, loading, error]);

  return (
    <NavigatorContext.Provider value={contextValue}>
      {children}
    </NavigatorContext.Provider>
  );
};

// Custom hook for consuming context
export const useNavigator = () => {
  const context = useContext(NavigatorContext);
  if (!context) {
    throw new Error('useNavigator must be used within a NavigatorProvider');
  }
  return context;
};