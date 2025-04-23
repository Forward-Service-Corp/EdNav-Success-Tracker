"use client";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { ActivityProvider } from "../contexts/ActivityContext";
import { ClientListProvider } from "../contexts/ClientListContext";
import { ClientsProvider } from "../contexts/ClientsContext";
import { EditingProvider } from "../contexts/EditingContext";
import { FepsLeftProvider } from "../contexts/FepsLeftContext";
import { LoadingProvider } from "../contexts/LoadingContext";
import { NavigatorsProvider } from "../contexts/NavigatorsContext";
import { NotificationProvider } from "../contexts/NotificationContext";
import { ThemesProvider, useThemes } from "../contexts/ThemesContext";
import "../public/styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <ThemesProvider>
        <ThemeWrapper>
          <ClientsProvider>
            <LoadingProvider>
              <EditingProvider>
                <FepsLeftProvider>
                  <ActivityProvider>
                    <ClientListProvider>
                      <NavigatorsProvider>
                        <NotificationProvider>{children}</NotificationProvider>
                      </NavigatorsProvider>
                    </ClientListProvider>
                  </ActivityProvider>
                </FepsLeftProvider>
              </EditingProvider>
            </LoadingProvider>
          </ClientsProvider>
        </ThemeWrapper>
      </ThemesProvider>
    </SessionProvider>
  );
}

// ✅ Separate wrapper component to safely use `useThemes()`
function ThemeWrapper({ children }) {
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
