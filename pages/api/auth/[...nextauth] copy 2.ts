import type { NextApiRequest, NextApiResponse } from "next";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import NextAuth, { Session, NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt, { Jwt } from "jsonwebtoken";
import { supabase, supabaseAnonKey, supabaseUrl } from "../../../lib/supabase";

export const authOptions: NextAuthOptions = {
  secret: process.env.MY_SECRET_KEY,
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
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
        const { data: user, error } = (await supabase
          .from("users")
          .select("*")
          .eq("email", credentials?.email)
          .single()) as unknown as {
          data: { id: "string" };
          error: any;
        };
        if (error) throw new Error(error.message);
        return user;
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseAnonKey,
  }),
  callbacks: {
    async session({ session }: { session: Session }) {
      const signingSecret = "secret";
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          email: session.user.email,
          role: "authenticated",
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      return session;
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // console.log(session, "auth");
  return await NextAuth(req, res, authOptions);
}
