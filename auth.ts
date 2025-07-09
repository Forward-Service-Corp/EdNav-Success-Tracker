import Email from 'next-auth/providers/email';
import NextAuth, { AuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import type { Adapter } from 'next-auth/adapters';
import { connectToDatabase } from '@/lib/mongodb';

async function clientPromise() {
  const { client } = await connectToDatabase();
  return client;
}

async function fetchAdditionalData(email: string) {
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email });
  return {
    email,
    name: user?.name,
    level: user?.level,
  };
}

const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise()) as Adapter,
  providers: [
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: 'database' as const,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    // async signIn({ user, account, profile }: { user: User | AdapterUser; account: Account | null; profile?: Profile | undefined }) {
    //   return true;
    // },
    async session({ session, user }: { session: any; user: any }) {
      const additionalData = await fetchAdditionalData(user.email);
      session.user = { ...session.user, ...additionalData };
      return session;
    }
  }
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };