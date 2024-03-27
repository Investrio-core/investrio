import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { parse } from "cookie";
import { cookies } from "next/headers";
import { AuthOptions } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL

const MAX_AGE = 60 * 60 * 24 * 2

const setRefreshCookie = (cookiesToSet: string[]) => {
  const cookie = cookiesToSet.find((cookie: string) =>
    cookie.includes("refreshToken")
  );
  if (cookie) {
    const [cookieName, cookieValue]: any = Object.entries(parse(cookie))[0];

    cookies().set({
      name: cookieName,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: MAX_AGE * 1000, 
      path: cookieValue.path,
      sameSite: 'lax',
      expires: new Date(cookieValue.expires),
    });
  }
};

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "E-mail" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          try {
            const pass = credentials.password;

            const res = await fetch(`${API_URL}/user/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: pass,
                type: "credentials",
              }),
            });

            const cookiesToSet = res.headers.getSetCookie();

            setRefreshCookie(cookiesToSet);

            if (!res.ok) {
              throw new Error("Failed to login");
            }
            const user = await res.json();

            return user || null;
          } catch (error: any) {
            console.error("Authorization error:", error.message);
            return null;
          }
        }
      },
    }),
  ],
  secret: process.env.SECRET_KEY,
  // debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      
      if (trigger === 'update') {
        token.accessToken = session.accessToken
      }

      return { ...token, ...user };
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = token;

      const user = await prisma.user.findFirst({
        where: {
          id: token.id
        },
      });

      session.user.isActive = user?.isActive
      session.user.isTrial = user?.isTrial
      session.user.subscriptionCancelAt = user?.subscriptionCancelAt
      session.user.subscriptionStartedOn = user?.subscriptionStartedOn
      session.user.stripeCustomerId = user?.stripeCustomerId
      session.user.subscriptionStatus = user?.subscriptionStatus
      session.user.trialEndsAt = user?.trialEndsAt

      return session;
    },

    async signIn({ account, user, profile, credentials }) {
      if (user && account?.type === "credentials") {
        return true;
      }

      const emailToSignInWith = profile
        ? profile.email
        : (credentials?.email as string);

      const userExist = await prisma.user.findUnique({
        where: {
          email: emailToSignInWith,
        },
      });

      //Login
      if (userExist && account && account.type !== "credentials") {
        let body: any = {
          email: user.email,
          name: user.name,
          type: account.provider,
          googleAccessToken: account.access_token
        };

        try {
          const response = await fetch(`${API_URL}/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const cookiesToSet = response.headers.getSetCookie();

          setRefreshCookie(cookiesToSet);

          const authUser = await response.json();



          user.id = authUser.id;
          // @ts-ignore
          user.accessToken = authUser.accessToken;
          user.isActive = authUser.isActive
          user.isTrial = authUser.isTrial
          user.stripeCustomerId = authUser.stripeCustomerId
          user.subscriptionCancelAt = authUser.subscriptionCancelAt
          user.subscriptionStartedOn = authUser.subscriptionStartedOn
          user.subscriptionStatus = authUser.subscriptionStatus
          user.trialEndsAt = authUser.trialEndsAt

          return true;
        } catch (err) {
          // throw new Error("Error")
          return false;
        }
      }

      //SignUp
      if (!userExist && profile && account) {
        let body: any = {
          email: user.email,
          name: user.name,
          type: account.provider,
        };

        try {
          const response = await fetch(`${API_URL}/user/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const cookiesToSet = response.headers.getSetCookie();

          setRefreshCookie(cookiesToSet);

          const createdUser = await response.json();


          user.id = createdUser.id 
          // @ts-ignore
          user.accessToken = createdUser.accessToken
          return true;
        } catch (err) {
          console.log(err);
          return false;
        }
      }

      return false;
    },
  },
  session: {
    maxAge: MAX_AGE
  },
  events: {
    signOut() {
      cookies().delete("refreshToken");
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
