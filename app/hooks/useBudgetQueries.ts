import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";

export default function useBudgetQueries(
  year?: number,
  month?: number,
  setIsLoading?: Function,
  budgetID?: string
) {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();

  const { mutateAsync: create } = useMutation({
    mutationKey: ["category"],
    mutationFn: async (updateData: any) => {
      if (setIsLoading && typeof setIsLoading === "function")
        setIsLoading(true);
      if (year === undefined || month === undefined) return {};

      const data = await axiosAuth.post(`/budget/create`, {
        ...updateData,
        year,
        month,
      });
      if (setIsLoading && typeof setIsLoading === "function")
        setIsLoading(false);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool", year, month] });
    },
  });

  const { mutateAsync: update } = useMutation({
    mutationKey: ["category"],
    mutationFn: async (category: any) => {
      if (setIsLoading && typeof setIsLoading === "function")
        setIsLoading(true);
      if (year === undefined || month === undefined || budgetID === undefined) {
        return {};
      }

      queryClient.setQueryData(["budget-tool", year, month], (oldData: any) => {
        if (oldData?.data === undefined) return oldData;

        const categoryKey = Object.keys(category)?.[0];
        if (categoryKey) {
          const newData = {
            ...oldData,
            data: { ...oldData.data, [categoryKey]: category[categoryKey] },
          };
          return newData;
        }
        return oldData;
      });

      const data = await axiosAuth.put(`/budget/update-category/${budgetID}`, {
        ...category,
      });
      if (setIsLoading && typeof setIsLoading === "function")
        setIsLoading(false);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool", year, month] });
    },
  });

  return { create, update };
}
