// components/dashboard/DashboardLayoutClient.tsx
'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, LogOut, Settings } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Logo from '@/components/Logo';

export default function DashboardLayoutClient({
                                                children,
                                                session
                                              }: {
  children: ReactNode;
  session: Session;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mouseLeaveTimerId, setMouseLeaveTimerId] = useState<NodeJS.Timeout | null>(null);

  // Handle sidebar visibility based on mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // If mouse hits the left edge of the screen, open the sidebar
      if (e.clientX <= 10) {
        setSidebarOpen(true);
        // Clear any existing timers
        if (mouseLeaveTimerId) {
          clearTimeout(mouseLeaveTimerId);
          setMouseLeaveTimerId(null);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseLeaveTimerId]);

  // Handle sidebar mouse enter/leave
  const handleSidebarMouseEnter = () => {
    // Keep sidebar open when mouse is over it
    if (mouseLeaveTimerId) {
      clearTimeout(mouseLeaveTimerId);
      setMouseLeaveTimerId(null);
    }
  };

  const handleSidebarMouseLeave = () => {
    // Closethe sidebar after a delay when mouse leaves
    const timerId = setTimeout(() => {
      setSidebarOpen(false);
    }, 500); // 500ms delay before closing

    setMouseLeaveTimerId(timerId);
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    signOut({ callbackUrl: '/' }).then();
  };

  return (
    <div className="min-h-screen bg-background bg-base-100 flex">
      <div
        className={`fixed bg-base-200 inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <div className="p-4 flex items-center justify-center">
          <Logo />
        </div>
        <div className="p-4">
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-foreground rounded-md hover:bg-info hover:text-accent-foreground"
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            {/* Only show admin tools for IT and admin users */}
            {(session.user.level === 'admin' || session.user.level === 'IT') && (
              <a
                href="/dashboard/admin-tools"
                className="flex items-center px-4 py-2 text-foreground rounded-md hover:bg-info hover:text-accent-foreground"
              >
                <Settings className="mr-3 h-5 w-5" />
                Admin Tools
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* Thin hover area to trigger the sidebar when closed */}
      {!sidebarOpen && (
        <div
          className="fixed inset-y-0 left-0 w-2 bg-base-200 border-0"
          onMouseEnter={() => setSidebarOpen(true)}
        />
      )}

      {/* Main content - now with full width */}
      <div className="flex-1">
        {/* Top navigation */}
        <div className="p-4 bg-base-300 flex items-center justify-between px-4 md:px-6">
          <div className={`flex items-center`}>
            <Logo />
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <span className="hidden md:inline-block  font-medium text-muted-foreground">
                  {session.user.name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center  font-medium text-foreground hover:text-primary"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline-block">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}