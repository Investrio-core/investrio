import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import * as bcrypt from "bcrypt";
import { signJwtAccessToken } from "@/lib/jwt";
//
const handler = NextAuth({
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
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to login");
          }

          const user = await res.json();
          cookies().set("next-auth.user", JSON.stringify(user));
          return user || null;
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          return null;
        }
      },
    }),
  ],
  secret: process.env.SECRET_KEY,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }: { session: any, token: any }) {
      const user = await prisma.user.findUnique({
        where: {
          email: token.email,
        },
      });

      // Generate accessToken
      const { password, ...userWithoutPass } = user!;
      const accessToken = signJwtAccessToken(userWithoutPass);

      session.user.accessToken = accessToken;
      session.user.id = user!.id;

      return session;
    },

    async signIn({ profile, credentials }) {
      try {
        const emailToSignInWith = profile ? profile.email : credentials?.email as string;
        const userExist = await prisma.user.findUnique({
          where: {
            email: emailToSignInWith,
          },
        });

        // If profile object is not null, it means that the user is trying to sign up with Google. In this case, create
        // a new  account if the user does not exist.
        if (!userExist && profile) {
          const user = await prisma.user
            .create({
              data: {
                name: profile?.name,
                email: profile?.email,
                password: await bcrypt.hash("google-login", 10),
              },
            })
            .then(async (response) => {
              const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: response?.email,
                  password: "google-login",
                }),
              });

              if (!res.ok) {
                throw new Error("Failed to login");
              }

              const user = await res.json();
              cookies().set("next-auth.user", JSON.stringify(user));
            });
        }

        // If the user does not exist, and there is no profile object, the user is trying to log in with email/pass
        // to an account that hasn't been created yet. In this case, throw an error.
        if (!userExist && !profile) {
          throw new Error("This account isn't registered. Please, sign up first.")
        }

        // If the user exists, just try to sign in with the email.
        if (userExist) {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userExist?.email,
              password: profile ? "google-login" : credentials?.password as string,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to login");
          }

          let userJson = await res.json();
          userJson = { ...userJson, image: (profile as { picture: string })?.picture };

          cookies().set("next-auth.user", JSON.stringify(userJson));
        }

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
