import type { Preview } from '@storybook/react';
import { ClientProvider } from '../contexts/ClientContext';
import React, { useEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemesProvider, useThemes } from '../contexts/ThemesContext';
import { LoadingProvider } from '../contexts/LoadingContext';
import { EditingProvider } from '../contexts/EditingContext';
import { FepsLeftProvider } from '../contexts/FepsLeftContext';
import { ActivityProvider } from '../contexts/ActivityContext';
import { ClientListProvider } from '../contexts/ClientListContext';
import { NavigatorProvider } from '../contexts/NavigatorsContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import '../public/styles/globals.css';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { selectedTheme } = useThemes();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html
      suppressContentEditableWarning
      lang="en"
      data-theme={selectedTheme}
      suppressHydrationWarning
      className={`font-family-sans no-scrollbar text-base-content text-xs`}
    >
    <head>
      <title></title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>{isMounted && children}</body>
    </html>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story) => (
      <SessionProvider>
        <ThemesProvider>
          <ThemeWrapper>
            <ClientProvider>
              <LoadingProvider>
                <EditingProvider>
                  <FepsLeftProvider>
                    <ActivityProvider>
                      <ClientListProvider>
                        <NavigatorProvider>
                          <NotificationProvider>
                            <div className={`h-screen w-screen flex items-center justify-center`}>
                              <Story />
                            </div>
                          </NotificationProvider>
                        </NavigatorProvider>
                      </ClientListProvider>
                    </ActivityProvider>
                  </FepsLeftProvider>
                </EditingProvider>
              </LoadingProvider>
            </ClientProvider>
          </ThemeWrapper>
        </ThemesProvider>
      </SessionProvider>
    )
  ]
};

export default preview;