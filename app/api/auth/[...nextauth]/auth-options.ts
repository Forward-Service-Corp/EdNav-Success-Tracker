import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { User as DbUser } from "@/models/User";
import { compare } from "bcrypt";

declare module "next-auth" {
  interface User {
    level?: string;
    username?: string;
  }

  interface Session {
    user: {
      id: string;
      level: string;
      username?: string;
    } & User;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();

          // Find the user by email OR username
          const user = await DbUser.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          });

          if (!user) {
            return null;
          }

          // Check if password is plaintext number or hashed
          let isPasswordValid = false;

          if (/^\d+$/.test(user.password)) {
            // Simple numeric password comparison
            isPasswordValid = credentials.password === user.password;
          } else {
            // Hashed password comparison
            isPasswordValid = await compare(
              credentials.password,
              user.password,
            );
          }

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            level: user.level,
            username: user.username,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.level = user.level;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.level = token.level as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
