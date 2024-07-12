"use client";
import { cookies } from "next/headers";
import SignOutButton from "@/app/components/SignOutButton";
import Image from "next/image";
import { DeleteButton } from "./ui/buttons/DeleteAllButton";
import { useSession } from "next-auth/react";
import TopbarDropdown from "./TopbarDropdown";

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
    <div className="flex flex-row justify-between items-center px-2 lg:px-6 py-2 lg:border-b lg:shadow-sm bg-white">
      <div className="hidden lg:block font-semibold">
        <h1 className="text-md">Welcome back {name?.split(" ")[0]}!</h1>
        <h3 className="text-sm text-[#747682] font-normal">
          Your debt-free future is just a few clicks away ✨
        </h3>
      </div>
      {/* {process.env.NEXT_PUBLIC_ENV !== "production" ? (
        <DeleteButton userId={id} />
      ) : null} */}

      <TopbarDropdown image={image} name={name?.split(" ")[0]} email={email} />
    </div>
  );
}
