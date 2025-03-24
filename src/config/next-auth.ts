import { NextAuthConfig, Session as NextAuthSession, User as NextAuthUser } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials";

import { loginUser } from "@/actions/auth";
import { prisma } from "./prisma";
import Nodemailer from "next-auth/providers/nodemailer";
import { JWT } from "next-auth/jwt";

interface Session extends NextAuthSession {
  rememberMe?: boolean;
}

interface User extends NextAuthUser {
  rememberMe?: boolean;
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.rememberMe = (user as User).rememberMe || false;
      }
      token.exp = token.rememberMe
        ? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days
        : Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 day

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (session.user) {
        session.user.id = token.id as string;
        session.rememberMe = token.rememberMe as boolean;
        session.expires = new Date((token.exp as number) * 1000).toISOString();
      }

      return session;
    }
  },
  jwt: {
    maxAge: 24 * 60 * 60
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true
    }),
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password', placeholder: 'password' },
        rememberMe: { label: "Remember Me", type: "checkbox" }
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error('INVALID_CREDENTIALS')
          }
          if (!credentials.email || !credentials.password) {
            throw new Error('INVALID_CREDENTIALS')
          }
          
          const user = { email: credentials.email as string, password: credentials.password as string };
          const existingUser = await loginUser(user);
          
          if (!existingUser) {
            throw new Error('INVALID_CREDENTIALS')
          }

          return {...existingUser, rememberMe: credentials.rememberMe === "true"}
        } catch (error) {
          if (error instanceof Error) {
            // Propagar errores específicos
            if (error.message === 'EMAIL_NOT_VERIFIED' || 
                error.message === 'INVALID_CREDENTIALS') {
              throw error
            }
          }
          // Para cualquier otro error, usar un mensaje genérico
          throw new Error('UNKNOWN_ERROR')
        }
      }
    })
  ],
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/verify-request",
    error: "/auth/error",
  }
};
