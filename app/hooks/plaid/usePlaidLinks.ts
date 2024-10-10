import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMemo } from "react";

const categories = ["needs", "wants", "savings", "debts"];

export default function usePlaidLinks(date?: Date | null) {
  const axiosAuth = useAxiosAuth();
  const year = date?.getFullYear() ?? new Date().getFullYear();
  const month = date?.getMonth() ?? new Date().getMonth();

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
  };
}
