"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  closeMenu: Function;
};

export const SideMenuItem = ({
  href,
  children,
  isActive = true,
  closeMenu,
}: Props) => {
  const pathname = usePathname();

  const listItemClasses = clsx(
    "w-full h-[50px] rounded-lg font-normal flex items-center px-3 cursor-pointer",
    {
      "bg-purple-3 text-white hover:bg-purple-500": pathname === href,
      "text-[#737581] hover:bg-gray-100": pathname !== href,
    },
    {
      "text-gray-300": !isActive,
    }
  );

  return (
    <Link
      className={`flex items-center whitespace-nowrap leading-3 tracking-wide ${
        !isActive ? "pointer-events-none" : ""
      }`}
      href={isActive ? href : ""}
    >
      <li className={listItemClasses} onClick={() => closeMenu()}>
        {children}
      </li>
    </Link>
  );
};
