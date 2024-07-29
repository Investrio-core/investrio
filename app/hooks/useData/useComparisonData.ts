import { ComparisonData } from "@/types/financial";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";

export const useComparisonData = (runQuery: boolean) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const { data: sessionData } = useSession();
  const userId = sessionData?.user?.id;

  const { data, isLoading } = useQuery<ComparisonData>({
    queryKey: ["no-extra-payments"],
    queryFn: async () => {
      // if (!userId) {
      //   const oldData = queryClient.getQueryData(["no-extra-payments"]);
      //   return oldData;
      // }
      const res = await axiosAuth.get(`/dashboard/comparison/${userId}`);
      if (res?.data?.savedInterest === -0.01) {
        res.data.savedInterest = 0;
      }
      return res;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: runQuery && !!userId,
  });

  return {
    data,
    isLoading,
  };
};
