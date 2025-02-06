import NextAuth from "next-auth";
import { authConfig } from "./config/next-auth";

export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth(authConfig)