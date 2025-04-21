// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient';

export default async function DashboardLayout({
                                                children
                                              }: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If not logged in, redirect to log in
  if (!session) {
    return redirect('/login');
  }

  return (
    <DashboardLayoutClient session={session}>
      {children}
    </DashboardLayoutClient>
  );
}