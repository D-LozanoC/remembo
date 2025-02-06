import { NextAuthConfig } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "./prisma";
import bcrypt from 'bcrypt'
import { loginUser } from "@/actions/auth";

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email' },
        password: { label: 'Password', type: 'password', placeholder: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        if (!credentials.email || !credentials.password) return null;

        const user = { email: credentials.email as string, password: credentials.password as string };

        return loginUser(user)
      }

    })
    // NodeMailer({
    //     server: {
    //         host: process.env.EMAIL_SERVER_HOST!,
    //         port: Number(process.env.EMAIL_SERVER_PORT),
    //         auth: {
    //             user: process.env.EMAIL_SERVER_USER!,
    //             pass: process.env.EMAIL_SERVER_PASSWORD!,
    //         },
    //     },
    //     from: process.env.EMAIL_FROM!,
    // }),
  ],
  // secret: process.env.NEXTAUTH_SECRET!,
  pages: {
    signIn: "/auth/login",
    // signOut: "/auth/logout",
    // error: "/auth/error",
    // verifyRequest: "/auth/verify-request",
    // newUser: "/auth/new-user",
  }
};
