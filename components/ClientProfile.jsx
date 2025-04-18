'use client';
import React, { useEffect, useState } from 'react';
import ClientProfileDetails from './ClientProfileDetails';
import CombinedFeed from '@/components/CombinedFeed';

export default function ClientProfile() {
    const [isMounted, setIsMounted] = useState(false);
    const [, setSelectedNavigator] = useState("");

    useEffect(() => {
        setIsMounted(true); // ✅ Mark component as mounted before interacting with localStorage
        if (typeof window !== "undefined") {
            const storedNavigator = localStorage.getItem("navigatorName") || "";
            setSelectedNavigator(storedNavigator);
        }
    }, []);


    const [tabState] = useState("Profile");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // ✅ Prevent hydration mismatch by rendering only after mount
    if (!isMounted) return null;

    return (
      <div className="h-screen overflow-y-scroll no-scrollbar relative w-full">
          <div className={`flex gap-10 pt-16 pr-6`}>
              <div className={`w-full mr-6 ${tabState === 'Profile' ? '' : 'hidden'}`}>
                  <CombinedFeed />
                  <ClientProfileDetails />
                </div>
            </div>
        </div>
    )
}

