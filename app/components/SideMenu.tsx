import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { FaHandHoldingDollar } from "react-icons/fa6";
import BudgetIcon from "@/public/icons/budget.svg";
import CogIcon from "@/public/icons/cog.svg";
import { SideMenuItem } from "./SideMenuItem";
import { useSession } from "next-auth/react";
import { BiMenu } from "react-icons/bi";
import BookConsultationBlock from "./BookConsultation";
import AnimatedMenuToggle from "./ui/AnimatedMenuToggle";

const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`;

export default function SideMenu() {
  const { data } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const isActiveLink = (link: string) => {
    // if (link === '/dashboard' && !data?.user.isAddedFreeStrategy) {
    //   return true
    // }

    // return (data?.user.isActive || data?.user.isTrial) ? true : false
    return true;
  };

  return (
    <div className="z-100">
      <button
        className="flex mt-[8px] flex-col h-12 w-12 rounded justify-center items-center group relative z-55 lg:hidden"
        onClick={() => setShowMenu((prevState) => !prevState)}
        style={{ zIndex: "150 !important" }}
      >
        <div
          className={`${genericHamburgerLine} ${
            showMenu
              ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        />
        <div
          className={`${genericHamburgerLine} ${
            showMenu ? "opacity-0" : "opacity-50 group-hover:opacity-100"
          }`}
        />
        <div
          className={`${genericHamburgerLine} ${
            showMenu
              ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
              : "opacity-50 group-hover:opacity-100"
          }`}
        />
      </button>

      <div className="flex flex-row justify-between drawer lg:drawer-open row-span-5 auto-cols-auto xl:col-span-2 z-50">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={showMenu}
          onChange={() => {}}
        />

        <div className="drawer-content flex flex-row lg:hidden relative top-15">
          <label htmlFor="my-drawer" className="">
            {/* <BiMenu
            size={30}
            className="mt-[18px]"
            onClick={() => setShowMenu(true)}
          /> */}
            {/* <button
            className="text-gray-500 w-10 h-10 relative focus:outline-none bg-white"
            onClick={() => setShowMenu((prevState) => !prevState)}
          ></button> */}

            {/* <button
            className="flex mt-[8px] flex-col h-12 w-12 rounded justify-center items-center group z-100"
            onClick={() => setShowMenu((prevState) => !prevState)}
            style={{ zIndex: "150 !important" }}
          >
            <div
              className={`${genericHamburgerLine} ${
                showMenu
                  ? "rotate-45 translate-y-3 opacity-50 group-hover:opacity-100"
                  : "opacity-50 group-hover:opacity-100"
              }`}
            />
            <div
              className={`${genericHamburgerLine} ${
                showMenu ? "opacity-0" : "opacity-50 group-hover:opacity-100"
              }`}
            />
            <div
              className={`${genericHamburgerLine} ${
                showMenu
                  ? "-rotate-45 -translate-y-3 opacity-50 group-hover:opacity-100"
                  : "opacity-50 group-hover:opacity-100"
              }`}
            />
          </button> */}
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={() => setShowMenu(false)}
          ></label>
          <ul className="min-h-full bg-white p-4 w-[80vw] sm:w-auto flex flex-col fixed z-10">
            <Link href={"/dashboard"}>
              <Image
                src="/logo_two.png"
                alt="Investrio"
                className="mb-2"
                width={140}
                height={50}
              />
            </Link>
            <SideMenuItem
              href="/dashboard/debts"
              isActive={isActiveLink("/dashboard")}
              closeMenu={() => setShowMenu(false)}
            >
              <MdOutlineDashboard />
              <span className="text-lg ml-2">Dashboard</span>
            </SideMenuItem>
            <SideMenuItem
              href={"/dashboard/debts/add"}
              isActive={isActiveLink("/dashboard")}
              closeMenu={() => setShowMenu(false)}
            >
              <FaHandHoldingDollar style={{ fontSize: "20px" }} />
              <span className="text-lg ml-2">Strategy</span>
            </SideMenuItem>
            <SideMenuItem
              href="/dashboard/budget"
              isActive={isActiveLink("/budget")}
              closeMenu={() => setShowMenu(false)}
            >
              <BudgetIcon width="20" height="20" viewBox="6 6 20 22" />
              <span className="text-lg ml-2">Budget</span>
            </SideMenuItem>
            {/* <SideMenuItem href="/settings" isActive={isActiveLink("/settings")}>
            <CogIcon width="20" height="20" viewBox="6 5 20 21" />{" "}
            <span className="text-lg ml-2">Settings</span>
          </SideMenuItem> */}

            <div className="mt-auto">{/* <BookConsultationBlock/> */}</div>
          </ul>
        </div>
      </div>
    </div>
  );
}
