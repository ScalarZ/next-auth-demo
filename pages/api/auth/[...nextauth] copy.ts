import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import AppleProvider from "next-auth/providers/apple";
import { google } from "googleapis";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { sendVerification } from "../../../lib/sendVerification";
import clientPromise from "../../../lib/mongodb";
import { Provider } from "next-auth/providers";

const CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_AUTH_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

let provider: Provider;
let strategy: SessionStrategy = "jwt";

export const authOptions: NextAuthOptions = {
  secret: process.env.MY_SECRET_KEY,
  session: {
    strategy,
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_PROVIDER_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_PROVIDER_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_PROVIDER_CLIENT_ID!,
      clientSecret: process.env.GITHUB_PROVIDER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
        const index = user.image?.indexOf("=s96-c")!;
        user.image = user.image?.slice(0, index);
      }
      return true;
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  if (req.body.strategy === "database") {
    console.log(authOptions.providers[2], authOptions.adapter, strategy);
    strategy = req.body.strategy;
  } else if (req.body.strategy === "jwt") {
    console.log(authOptions.providers[2], authOptions.adapter, strategy);
    strategy = "jwt";
  }
  if (
    authOptions.providers[2] === undefined &&
    authOptions.adapter === undefined &&
    strategy == "database"
  ) {
    const accessToken = (await oAuth2Client.getAccessToken()) as string;
    authOptions.providers.push(
      EmailProvider({
        server: {
          host: "smtp.gmail.com",
          port: 587,
          auth: {
            type: "OAuth2",
            user: "faresrahali44@gmail.com",
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken as string,
          },
        },
        from: "faresrahali44@gmail.com",
        sendVerificationRequest(params) {
          sendVerification(params);
        },
      })
    );
    authOptions.adapter = MongoDBAdapter(clientPromise);
  } else if (
    authOptions.providers[2] !== undefined &&
    authOptions.adapter !== undefined &&
    strategy === "jwt"
  ) {
    authOptions.providers.pop();
    delete authOptions.adapter;
  }
  return await NextAuth(req, res, authOptions);
}
