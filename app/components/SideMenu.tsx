import { BiMenu } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { FaHandHoldingDollar } from "react-icons/fa6";
import BudgetIcon from '@/public/icons/budget.svg'
import CogIcon from '@/public/icons/cog.svg'
import { SideMenuItem } from "./SideMenuItem";
import { useSession } from "next-auth/react";
import BookConsultationBlock from "./BookConsultation";


export default function SideMenu() {
  const {data} = useSession()

  const isActiveLink = (link: string) => {

    if (link === '/dashboard' && !data?.user.isAddedFreeStrategy) {
      return true
    }

    return (data?.user.isActive || data?.user.isTrial) ? true : false
  }

  return (
    <div className="flex flex-row justify-between drawer lg:drawer-open z-50 row-span-5 auto-cols-auto xl:col-span-2">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-row lg:hidden">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
          <BiMenu size={30} />
        </label>
        <div className="hidden md:block">
          <Image
            src="/logo.svg"
            alt="Investrio"
            className="mb-2"
            width={50}
            height={50}
          />
        </div>
   
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="min-h-full bg-white p-4 w-[80vw] sm:w-auto flex flex-col fixed ">
          <Link href={"/dashboard"}>
            <Image
              src="/logo_two.png"
              alt="Investrio"
              className="mb-2"
              width={140}
              height={50}
            />
          </Link>
          <SideMenuItem href="/dashboard/debts" isActive={isActiveLink("/dashboard")} >
            <MdOutlineDashboard />
            <span className="text-lg ml-2">Dashboard</span>
          </SideMenuItem>
          <SideMenuItem href={"/dashboard/debts/add"} isActive={isActiveLink('/dashboard')}>
            <FaHandHoldingDollar style={{ fontSize: "20px" }} />
            <span className="text-lg ml-2">Strategy</span>
          </SideMenuItem>
          <SideMenuItem href="/budget" isActive={isActiveLink('/budget')}>
            <BudgetIcon width='20' height="20" viewBox="6 6 20 22" />
            <span className="text-lg ml-2">Budget</span>
          </SideMenuItem>
          <SideMenuItem href="/settings" isActive={isActiveLink('/settings')}>
            <CogIcon width='20' height="20" viewBox="6 5 20 21" /> <span className="text-lg ml-2">Settings</span>
          </SideMenuItem>

          <div className="mt-auto">
          {/* <BookConsultationBlock/> */}
        </div>
        </ul>
        
      </div>
    </div>
  );
}
