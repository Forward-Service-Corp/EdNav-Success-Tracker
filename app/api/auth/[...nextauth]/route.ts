import NextAuth from 'next-auth';
import { authOptions } from './auth-options';

/**
 * NextAuth.js API route handler for App Router
 * This pattern ensures proper handling of requests in Next.js
 */
const handler = NextAuth(authOptions);

// Export the handler directly (not its properties)
export const GET = handler;
export const POST = handler;
