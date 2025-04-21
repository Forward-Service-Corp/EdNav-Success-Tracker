// app/dashboard/admin-tools/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminToolsPage from '@/components/admin/AdminToolsPage';

export default async function AdminTools() {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and has the proper level
  if (!session?.user?.level || !session.user.level.includes('admin')) {
    return redirect('/dashboard');
  }

  return <AdminToolsPage />;
}