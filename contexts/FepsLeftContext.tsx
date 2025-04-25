import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';

type FEP = {
  searchTerm: string;
  age: string;
  status: string;
  menuOpen: boolean | null;
};

type FepsLeftContextType = {
  selectedFepLeft: FEP;
  setSelectedFepLeft: Dispatch<SetStateAction<FEP>>;
};

export const FepsLeftContext = createContext<FepsLeftContextType | null>(
  null as FepsLeftContextType | null,
);

export const FepsLeftProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFepLeft, setSelectedFepLeft] = useState<FEP>({
    searchTerm: "",
    age: "All",
    status: "All",
    menuOpen: null,
  });

  // Ensure defaults are set correctly on mount
  useEffect(() => {
    setSelectedFepLeft({
      searchTerm: '',
      age: 'All',
      status: 'All',
      menuOpen: null
    });
  }, []);

  return (
    <FepsLeftContext.Provider value={{ selectedFepLeft, setSelectedFepLeft }}>
      {children}
    </FepsLeftContext.Provider>
  );
};

// Custom hook for consuming context
export const useFepsLeft = () => {
  const context = useContext(FepsLeftContext);
  if (!context) {
    throw new Error('useFepsLeft must be used within a FepsLeftProvider');
  }
  return context;
};