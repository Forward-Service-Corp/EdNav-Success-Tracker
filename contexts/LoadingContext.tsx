import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Load = {
  loading: false | null;
};

type LoadContextType = {
  loading: boolean | null;
  setLoading: Dispatch<SetStateAction<Load | null>>;
};

const LoadingContext = createContext<LoadContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<"" | null>(null);

  return (
    // @ts-ignore
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for consuming context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a useLoading");
  }
  return context;
};
