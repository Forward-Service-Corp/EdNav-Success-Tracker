import React from "react";
import { ClientListProvider } from "../contexts/ClientListContext";
import { ClientsProvider } from "../contexts/ClientsContext";
import { EditingProvider } from "../contexts/EditingContext";
import { FepsLeftProvider } from "../contexts/FepsLeftContext";
import { NavigatorsProvider } from "../contexts/NavigatorsContext";

export const withProviders = (Story: React.ComponentType) => {
  return (
    <ClientsProvider>
      <ClientListProvider>
        <EditingProvider>
          <NavigatorsProvider>
            <FepsLeftProvider>
              <Story />
            </FepsLeftProvider>
          </NavigatorsProvider>
        </EditingProvider>
      </ClientListProvider>
    </ClientsProvider>
  );
};
