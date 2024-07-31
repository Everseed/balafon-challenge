import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth';
import EmailProvider, { SendVerificationRequestParams } from 'next-auth/providers/email';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Resend } from 'resend';
import { z } from 'zod';
import prisma from './prisma';
import type { UserRole } from '@prisma/client';


/* if (
  !process.env.GITHUB_CLIENT_ID ||
  !process.env.GITHUB_SECRET_ID ||
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_SECRET_ID
) {
  throw new Error("Auth required env variables are not set");
} */

export interface CustomUser extends DefaultUser {
  id: string;
  timezone: string;
  role: UserRole;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: CustomUser & DefaultSession['user'];
  }
}

async function getUser(email: string): Promise<CustomUser | undefined> {
  try {
    const user: CustomUser = { id: "1", email:email, timezone: "Africa/Douala", role: "USER" }
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_ID,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        console.log(parsedCredentials);

        if (parsedCredentials.success) {
        }
        const { email, password } = parsedCredentials.data;
        console.log(email)
        console.log(password)
        const user = await getUser(email);
        console.log(user)
        if (!user) return null;
        return user;
      },
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
    }),
    EmailProvider({
      server: '',
      from: 'noreply@rezahedi.dev',
      sendVerificationRequest: async (params: SendVerificationRequestParams) => {
        let { identifier, url, provider } = params;
        try {
          let resend = new Resend(process.env.RESEND_API_KEY!)
          await resend.emails.send({
            from: provider.from,
            to: identifier,
            subject: 'Your StreakUp Login Link',
            html: '<html><body>\
                <h2>Your Login Link</h2>\
                <p>Welcome to StreakUp!</p>\
                <p>Please click the magic link below to sign in to your account.</p>\
                <p><a href="' + url + '"><b>Sign in</b></a></p>\
                <p>or copy and paste this URL into your browser:</p>\
                <p><a href="' + url + '">' + url + '</a></p>\
                <br /><br /><hr />\
                <p><i>This email was intended for ' + identifier + '. If you were not expecting this email, you can ignore this email.</i></p>\
                </body></html>',
          });
        } catch (error) {
          console.log({ error });
        }
      },
    }),

  ],
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log(auth)
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  pages: {
    signIn: "/signin",
  },
  /* events: {
    createUser: async (message) => {
      // Record event log: new user signup
      await recordEvent('signup')
    }
  } */
};