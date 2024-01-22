"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  href: string;
  children: ReactNode;
};

export const SideMenuItem = ({ href, children }: Props) => {
  const pathname = usePathname();

  const listItemClasses = clsx(
    "w-full h-[50px] rounded-lg font-normal flex items-center px-3 cursor-pointer",
    {
      "bg-purple-600 text-white hover:bg-purple-500": pathname === href,
      "text-[#737581] hover:bg-gray-100": pathname !== href,
    }
  );

  return (
    <Link
      className="flex items-center whitespace-nowrap leading-3 tracking-wide "
      href={href}
    >
      <li className={listItemClasses}>
        {children}
      </li>
    </Link>
  );
};
