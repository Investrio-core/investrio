"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/utils/httpClient";
import { Loading } from "../loading/Loading";
import { useSession } from "next-auth/react";
import { DebtSummary } from "@/app/components/steps/results";
import useAxiosAuth from "@/app/lib/hooks/useAxiosAuth";

// TODO: refactor this components and its children
export const Steps = () => {
  const { data: session } = useSession();

  const axiosAuth = useAxiosAuth()

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: async () => await axiosAuth.get(`/user/dashboard/${session?.user?.id}`, {withCredentials: true}),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    enabled: !!session?.user?.id
  });

  if (isLoading || !session?.user?.id || !data) return <Loading/>;


  return <DebtSummary data={data.data}/>;
};
