import React from 'react';
import { ClientListProvider } from '../contexts/ClientListContext';
import { ClientProvider } from '../contexts/ClientContext';
import { EditingProvider } from '../contexts/EditingContext';
import { FepsLeftProvider } from '../contexts/FepsLeftContext';
import { NavigatorProvider } from '../contexts/NavigatorsContext';

export const withProviders = (Story: React.ComponentType) => {
  return (
    <ClientProvider>
      <ClientListProvider>
        <EditingProvider>
          <NavigatorProvider>
            <FepsLeftProvider>
              <Story />
            </FepsLeftProvider>
          </NavigatorProvider>
        </EditingProvider>
      </ClientListProvider>
    </ClientProvider>
  );
};
