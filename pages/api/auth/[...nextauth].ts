import type { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import GithubProvider from "next-auth/providers/github";
import InstagramProvider from "next-auth/providers/instagram";
import NextAuth, { Session, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt, { Jwt } from "jsonwebtoken";
import { supabase, supabaseAnonKey, supabaseUrl } from "../../../lib/supabase";

let supabaseUser: (User | null) & { app_metadata: { provider: string } };

export const authOptions: NextAuthOptions = {
  secret: process.env.MY_SECRET_KEY,
  session: {
    strategy: "jwt",
  },
  providers: [
    InstagramProvider({
      clientId: "236324692079009",
      clientSecret: "65a7396a6500bc8a0d32174ece2b2ffd",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_PROVIDER_CLIENT_ID!,
      clientSecret: process.env.GITHUB_PROVIDER_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const {
          data: { user },
          error,
        } = (await supabase.auth.signInWithPassword({
          email: credentials?.email!,
          password: credentials?.password!,
        })) as unknown as {
          data: {
            user: (User | null) & { app_metadata: { provider: string } };
          };
          error: any;
        };
        if (error) throw new Error(error.message);
        supabaseUser = user;
        return user;
      },
    }),
  ],
  callbacks: {
    session: async function ({
      session,
      user,
    }: {
      session: Session;
      user: any;
    }) {
      if (!session.user.name) session.user.name = null;
      if (!session.user.image) session.user.image = null;
      return session;
    },
  },
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseAnonKey,
  }),
};

export default NextAuth(authOptions);
