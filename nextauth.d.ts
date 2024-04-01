import { DefaultSession, DefaultUser } from "next-auth";
interface IUser extends DefaultUser {
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
}

declare module "next-auth" {
  interface User extends IUser { }
}