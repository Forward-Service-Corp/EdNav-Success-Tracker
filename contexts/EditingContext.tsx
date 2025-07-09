import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type Edit = {
  editing: string | null;
};

type EditContextType = {
  editing: string | null;
  setEditing: Dispatch<SetStateAction<Edit | null>>;
};

export const EditingContext = createContext<EditContextType | undefined>(
  undefined,
);

export const EditingProvider = ({ children }: { children: ReactNode }) => {
  const [editing, setEditing] = useState<"" | null>(null);

  return (
    // @ts-ignore
    <EditingContext.Provider value={{ editing, setEditing }}>
      {children}
    </EditingContext.Provider>
  );
};

// Custom hook for consuming context
export const useEditing = () => {
  const context = useContext(EditingContext);
  if (!context) {
    throw new Error("useEditing must be used within a useEditing");
  }
  return context;
};
