'use client';
import React, { useEffect, useState } from 'react';
import ClientProfileDetails from './ClientProfileDetails';
import CombinedFeed from '@/components/CombinedFeed';
import ClientProfileHeader from '@/components/ClientProfileHeader';
import { useEditing } from '@/contexts/EditingContext';


export default function ClientProfile() {
    const [isMounted, setIsMounted] = useState(false);
    const [, setSelectedNavigator] = useState("");
    const { setEditing } = useEditing();

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
      <div className="">
          <ClientProfileHeader setEditing={setEditing} />
          <CombinedFeed />
          <ClientProfileDetails />
      </div>
    )
}

