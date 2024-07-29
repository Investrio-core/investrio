"use client";

import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import LinkOutline from "@/app/components/ui/LinkOutline";
import { Button } from "@/app/components/ui/buttons";
import { DashboardInfo } from "@/app/components/dashboard/DashboardInfo";
import { Loading } from "@/app/components/ui/Loading";

import PlusOutlineIcon from "@/public/icons/plus-outline.svg";
import mock from "./mock";
import { useEffect } from "react";
import DebtTool from "./components/DebtTool";

const CALENDLY_URL = "https://calendly.com/investrio-joyce";

export default function Dashboard() {
  const { data: session } = useSession();

  const router = useRouter();

  const axiosAuth = useAxiosAuth();

  // userDebtsPayments = await prisma.snowballPaymentSchedule

  // if (isLoading || !session?.user?.id || !data || isRefetching)

  const onEditClick = () => {
    router.push("/dashboard/debts/add?step=2");
  };

  return (
    <>
      <DebtTool />
    </>
  );
}
