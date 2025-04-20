import React, { createContext, ReactNode, useContext, useState } from 'react';

type Client = {
  '_id': string,
  'caseNumber': number,
  'clientStatus': string,
  'contactNumber': string,
  'county': string,
  'createdAt': string,
  'dateReferred': string,
  'dob': string,
  'email': string,
  'fep': string,
  'first_name': string,
  'group': string,
  'isYouth': boolean,
  'lastGrade': string,
  'last_name': string,
  'latestInteraction': string,
  'name': string,
  'navigator': string,
  'officeCity': string,
  'orientation': {
    'completionDate': string,
    'referralDate': string,
  },
  'pin': string,
  'region': string,
  'schoolIfEnrolled': string,
  'tabe': {
    'completionDate': string,
    'referralDate': string,
  },
  trackable: {
    type: string,
    length: number,
    items: [
      {
        name: string,
        completed: boolean
      }
    ]
  },
  'transcripts': {
    'completionDate': string,
    'referralDate': string,
  },
  'ttsDream': string,
}

type ClientsContextType = {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
};

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export const ClientsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <ClientsContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </ClientsContext.Provider>
  );
};

// Custom hook for consuming context
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return context;
};
