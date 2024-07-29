"use client";
import React from "react";
import SideMenu from "@/app/components/SideMenu";
import Topbar from "@/app/components/Topbar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Loading } from "../ui/Loading";
import Paywall from "../Paywall";
import MobileNavigator from "./MobileNavigator";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const path = usePathname();

  // take out layout for onboarding flow: || path.startsWith("/onboarding")
  if (path.startsWith("/auth")) {
    return <>{children}</>;
  }

  if (!data) {
    return <Loading />;
  }

  const { user } = data!;

  return (
    <>
      {/* {user.isShowPaywall && <Paywall />} */}
      <div className="grid grid-cols-1 lg:flex max-w-[100vw] min-h-fit">
        <div className="flex flex-row justify-between hidden lg:block">
          <div className="lg:w-[190px]">
            <SideMenu />
          </div>
          <div className="float-right lg:hidden">
            <Topbar user={user} />
          </div>
        </div>

        <div className="bg-[#f7f8fa] max-md:col-span-7">
          <section className="hidden lg:block">
            <Topbar user={user} />
          </section>
          <section className="lg:w-[calc(100vw-190px)]">{children}</section>
        </div>
        <div className="block lg:hidden mt-[42px] md:mt-[0px] bg-violet-50">
          <MobileNavigator />
        </div>
      </div>
    </>
  );
}
