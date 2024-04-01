import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      accessToken: string;
      image?: string;
      isActive?: boolean;
      isTrial?: boolean;
      stripeCustomerId?: string;
      trialEndsAt?: string;
      subscriptionStatus?: "active" | "cancelled" | "failed";
      isShowPaywall: boolean;
      isAddedFreeStrategy: boolean;
    };
  }
}
