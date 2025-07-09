import React, { createContext, ReactNode, useContext, useState } from "react";

type Client = {
  _id: string;
  caseNumber: number;
  clientStatus: string;
  contactNumber: string;
  county: string;
  createdAt: string;
  dateReferred: string;
  dob: string;
  email: string;
  fep: string;
  first_name: string;
  graduationResults: string;
  group: string;
  items: [];
  isYouth: boolean;
  lastGrade: string;
  last_name: string;
  latestInteraction: string;
  name: string;
  navigator: string;
  officeCity: string;
  orientation: {
    completionDate: string;
    referralDate: string;
  };
  pin: string;
  region: string;
  referralResults: string;
  schoolIfEnrolled: string;
  tabe: {
    completionDate: string;
    referralDate: string;
  };
  trackable: {
    program: string;
    length: number;
    createdAt: string;
  };
  transcripts: {
    completionDate: string;
    referralDate: string;
  };
  ttsDream: string;
};

type ClientContextType = {
  selectedClient: Client | null;
  setSelectedClient: (client: any) => void;
};

export const ClientContext = createContext<ClientContextType | undefined>(
  undefined,
);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </ClientContext.Provider>
  );
};

// Custom hook for consuming context
export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientsProvider");
  }
  return context;
};
