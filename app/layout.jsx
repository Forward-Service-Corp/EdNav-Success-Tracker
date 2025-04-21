'use client';
import React, { useEffect, useState } from 'react';
import '../public/styles/globals.css';
import { ThemesProvider, useThemes } from '../contexts/ThemesContext';
import { ClientsProvider } from '../contexts/ClientsContext';
import { EditingProvider } from '../contexts/EditingContext';
import { FepsLeftProvider } from '../contexts/FepsLeftContext';
import { ActivityProvider } from '../contexts/ActivityContext';
import { NavigatorProvider } from '../contexts/NavigatorsContext';
import { SessionProvider } from 'next-auth/react';
import { ClientListProvider } from '../contexts/ClientListContext';

export default function RootLayout({ children }) {

  return (
    <SessionProvider>
      <ThemesProvider>
        <ThemeWrapper>
          <ClientsProvider>
            <EditingProvider>
              <FepsLeftProvider>
                <ActivityProvider>
                  <ClientListProvider>
                    <NavigatorProvider>
                      {children}
                    </NavigatorProvider>
                  </ClientListProvider>
                </ActivityProvider>
              </FepsLeftProvider>
            </EditingProvider>
          </ClientsProvider>
        </ThemeWrapper>
      </ThemesProvider>
    </SessionProvider>
  );
};

// ✅ Separate wrapper component to safely use `useThemes()`
function ThemeWrapper({ children }) {
  const { selectedTheme } = useThemes();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html suppressContentEditableWarning lang="en" data-theme={selectedTheme} suppressHydrationWarning
          className={`font-family-sans tracking-wider bg-base-100 text-base-content antialiased`}>
    <head>
      <title></title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body className={`font-serif`}>{isMounted && children}</body>
    </html>
  );
}

