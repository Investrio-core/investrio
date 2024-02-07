"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/utils/httpClient";
import { Loading } from "../loading/Loading";
import { useSession } from "next-auth/react";
import { DebtSummary } from "@/app/components/steps/results";
import useAxiosAuth from "@/app/lib/hooks/useAxiosAuth";

// TODO: refactor this components and its children
export const Steps = ({data}: any) => {

  return <DebtSummary data={data}/>;
};
