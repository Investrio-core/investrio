"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/utils/httpClient";
import { Loading } from "../loading/Loading";
import { useSession } from "next-auth/react";
import { DebtSummary } from "@/app/components/steps/results";

// TODO: refactor this components and its children
export const Steps = () => {
  const { data: session } = useSession();

  const {
    data: dashboard,
    isLoading,
  } = useQuery({
    queryKey: ["dashboard", session?.user?.id],
    queryFn: async () => await get(`/api/user/${session?.user?.id}?graph=dashboard`),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: false,
    // staleTime: Infinity,
    enabled: !!session?.user?.id
  });

  if (isLoading || !session?.user?.id || !dashboard) return <Loading/>;

  return <DebtSummary data={dashboard}/>;
};
