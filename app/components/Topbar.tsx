"use client";
import { cookies } from "next/headers";
import SignOutButton from "@/app/components/SignOutButton";
import Image from "next/image";
import { DeleteButton } from "./ui/DeleteAllButton";
import { useSession } from "next-auth/react";

interface TopbarProps {
  user: {
    image?: string;
    email: string;
    name: string;
    id: string;
  };
}

export default function Topbar({ user }: TopbarProps) {
  const { image, name, email, id } = user;

  return (
    <div className="flex flex-row justify-between items-center px-5 py-2 lg:border-b lg:shadow-sm bg-white">
      <div className="hidden lg:block font-semibold">
        <h1 className="text-md">Welcome back {name?.split(" ")[0]}!</h1>
        <h3 className="text-sm text-[#747682] font-normal">
          Your debt-free future is just a few clicks away ✨
        </h3>
      </div>
      <div className="flex flex-row gap-2 items-center">
        {process.env.NEXT_PUBLIC_ENV !== "production" ? <DeleteButton userId={id} /> : null}
        <div className="flex flex-row gap-2 bg-white lg:mr-4 items-center">
          <Image
            className="rounded-[50%]"
            src={image || "/logo.svg"}
            alt={name || "You"}
            width={30}
            height={30}
          />
          <div className="block mr-10 lg:flex lg:flex-col lg:mr-auto">
            <span className="text-sm text-[#03091D]">
              {name?.split(" ")[0] || "username"}
            </span>
            {
              <span className="hidden sm:block text-[12px] text-[#747682]">
                {email}
              </span>
            }
          </div>
        </div>
        <div>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
