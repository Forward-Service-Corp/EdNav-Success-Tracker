import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type FEP = {
  searchTerm: "";
  age: "All";
  status: "All";
  menuOpen: boolean | null;
};

type FepsLeftContextType = {
  selectedFepLeft: {
    searchTerm: string;
    age: string;
    status: string;
    menuOpen: boolean | null;
  };
  setSelectedFepLeft: Dispatch<SetStateAction<FEP>>;
};

const FepsLeftContext = createContext<FepsLeftContextType | null>(
  null as FepsLeftContextType | null,
);

export const FepsLeftProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFepLeft, setSelectedFepLeft] = useState<FEP>({
    searchTerm: "",
    age: "All",
    status: "All",
    menuOpen: null,
  });

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
    throw new Error("useClients must be used within a FepsLeftProvider");
  }
  return context;
};
