import React from "react";
import SideMenu from "@/app/components/SideMenu";
import Topbar from "@/app/components/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:flex">
      <div className="flex flex-row justify-between">
        <div className="lg:w-[170px]">
          <SideMenu/>
        </div>
        <div className="float-right lg:hidden">
          <Topbar/>
        </div>
      </div>

      <div className="bg-[#f7f8fa] max-md:col-span-7">
        <section className="hidden lg:block">
          <Topbar/>
        </section>
        <section className="lg:w-[calc(100vw-190px)]">
          {children}
        </section>
      </div>
    </div>
  )
}