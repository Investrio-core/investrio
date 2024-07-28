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

const CALENDLY_URL = "https://calendly.com/investrio-joyce";

export default function Dashboard() {
  const { data: session } = useSession();

  const router = useRouter();

  const axiosAuth = useAxiosAuth();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: async () => {
      // if (session?.user.isShowPaywall) {
      //   return mock
      // }
      return await axiosAuth.get(`/dashboard`);
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    refetch();
  }, [session?.user.isShowPaywall]);

  if (isLoading || !session?.user?.id || !data || isRefetching)
    return <Loading />;

  const onEditClick = () => {
    router.push("/dashboard/debts/add?step=2");
  };

  return (
    <div className="m-2 mx-3 rounded-lg p-3 bg-white text-center">
      <div className="border-b-2 justify-between flex border-gray-100 p-3">
        <div>
          <h1 className="title text-left text-[#03091D]">Repayment Strategy</h1>
          <h2 className="text-left text-[#747682]">
            We do the hard work, so you can focus on what matters most.
          </h2>
        </div>
        <div className="flex gap-5 items-center">
          <LinkOutline
            text="Book Your Consultation"
            Icon={PlusOutlineIcon}
            url={CALENDLY_URL}
          />
          {data?.data?.length ? (
            <Button
              onClick={onEditClick}
              classProp={"!w-32 !h-[38px]"}
              text="Edit"
            />
          ) : null}
        </div>
      </div>
      <DashboardInfo data={data.data} />
    </div>
  );
}
