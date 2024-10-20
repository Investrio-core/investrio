import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMemo } from "react";

const categories = ["needs", "wants", "savings", "debts"];

export enum AccountCategory {
  PERSONAL = 0,
  BUSINESS,
  MIXED,
}

export default function usePlaidLinks(date?: Date | null) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const year = date?.getFullYear() ?? new Date().getFullYear();
  const month = date?.getMonth() ?? new Date().getMonth();

  // Partial<PlaidAccount> & { id: string; itemId: string };
  const updateAccount = async (updatedAccount: {
    id: string;
    itemId: string;
    accountCategory: "PERSONAL" | "BUSINESS" | "MIXED";
  }) => {
    const updatedAccountResult = await axiosAuth.post("/plaid/updateAccount", {
      updatedAccount: { ...updatedAccount },
    });
    console.log("got account update result");
    console.log(updatedAccountResult);
    queryClient.invalidateQueries({ queryKey: ["plaidLinks"] });
    return updatedAccountResult;
  };

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ["plaidLinks"],
    queryFn: async () => {
      const plaidLinks = await axiosAuth.get(`/plaid/getPlaidLinks`);
      console.log("got plaid links");
      console.log(plaidLinks);
      return plaidLinks;
    },
    staleTime: 45 * (60 * 1000), // 45 mins
    refetchOnWindowFocus: false, // default: true
    refetchOnMount: false,

    // refetchOnWindowFocus: true,
    // enabled: !!(year && month), // !!date,
  });

  return {
    plaidLinks: data,
    refetch,
    updateAccount,
  };
}
