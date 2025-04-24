import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';

type Navigator = {
  _id: string;
  name: string;
  pinned: Array<string>;
  preferences: {
    theme: string;
    lastAgeFilter: string;
    lastStatusFilter: string;
  };
  notifications: {
    unread: Array<string>;
    read: Array<string>;
  };
  streak: {
    active: boolean;
    streak: number;
    lastDate: string;
    longestStreak: number;
    longestStreakDate: number;
  };
};

type NavigatorsContextType = {
  selectedNavigator: Navigator | null;
  setSelectedNavigator: Dispatch<SetStateAction<Navigator | null>>;
  navigators: Navigator[];
  loading: boolean;
  error: string | null;
};

export const NavigatorsContext = createContext<NavigatorsContextType>({
  selectedNavigator: null,
  setSelectedNavigator: () => {},
  navigators: [],
  loading: false,
  error: null,
});

export const NavigatorsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNavigator, setSelectedNavigator] = useState<Navigator | null>(
    null,
  );
  const [navigators, setNavigators] = useState<Navigator[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch navigators on initial load
  useEffect(() => {
    const fetchNavigators = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get logged in user first to get their navigator role
        let loggedInUser;
        try {
          const userRes = await fetch("/api/auth/me");
          if (userRes.ok) {
            loggedInUser = await userRes.json();
          }
        } catch (e) {
          console.error("Error fetching logged in user:", e);
        }

        // Now fetch navigators
        const res = await fetch("/api/navigators");
        if (!res.ok) {
          throw new Error(`Failed to fetch navigators: ${res.status}`);
        }

        const data = await res.json();

        // Add the "All" option
        const allOption = {
          _id: "all",
          name: "All",
          pinned: [],
          preferences: {
            theme: "default",
            lastAgeFilter: "All",
            lastStatusFilter: "All",
          },
          notifications: {
            unread: [],
            read: [],
          },
          streak: {
            active: false,
            streak: 0,
            lastDate: "",
            longestStreak: 0,
            longestStreakDate: 0,
          },
        };

        const navigatorsData = [allOption, ...data];
        setNavigators(navigatorsData);

        // Set initial selected navigator
        if (loggedInUser?.navigator) {
          // If user is a navigator, find their entry
          const userNavigator = navigatorsData.find(
            (nav) =>
              nav.name === loggedInUser.navigator ||
              nav._id === loggedInUser.navigator,
          );

          if (userNavigator) {
            setSelectedNavigator(userNavigator);
          } else {
            // Default to "All" if user's navigator not found
            setSelectedNavigator(allOption);
          }
        } else {
          // Default to "All" for non-navigator users
          setSelectedNavigator(allOption);
        }
      } catch (err) {
        console.error("Failed to fetch navigators:", err);
        // Type guard to ensure we can access the message property
        const errorMessage = err instanceof Error ? err.message : 'Failed to load navigators';
        setError(errorMessage);
        // Set the "All" option as a fallback
        const fallbackOption = {
          _id: "all",
          name: "All",
          pinned: [],
          preferences: {
            theme: "default",
            lastAgeFilter: "All",
            lastStatusFilter: "All",
          },
          notifications: { unread: [], read: [] },
          streak: {
            active: false,
            streak: 0,
            lastDate: "",
            longestStreak: 0,
            longestStreakDate: 0,
          },
        };
        setNavigators([fallbackOption]);
        setSelectedNavigator(fallbackOption);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigators();
  }, []);

  return (
    <NavigatorsContext.Provider
      value={{
        selectedNavigator,
        setSelectedNavigator,
        navigators,
        loading,
        error,
      }}
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