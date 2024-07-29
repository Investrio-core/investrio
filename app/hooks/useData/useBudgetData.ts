import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMemo } from "react";

const categories = ["wants", "needs", "savings", "debts"];

export default function useBudgetData(date?: Date | null) {
  const axiosAuth = useAxiosAuth();
  const year = date?.getFullYear() ?? new Date().getFullYear();
  const month = date?.getMonth() ?? new Date().getMonth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["budget-tool", year, month],
    queryFn: async () => {
      return await axiosAuth.get(`/budget/${year}/${month}`);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!(year && month), // !!date,
  });

  const calculateSumCategories = () => {
    return categories.map((category) => {
      if (data?.data?.[category]) {
        return data?.data[category].reduce(
          (p: number, c: { value: number }) => p + c.value,
          0
        );
      }

      return 0;
    });
  };

  const sumCategories = useMemo(
    () => calculateSumCategories().reduce((p: number, c: number) => p + c, 0),
    [
      data?.data["wants"],
      data?.data["needs"],
      data?.data["savings"],
      data?.data["debts"],
    ]
  );

  const incomeAfterExpenses = (data?.data?.income ?? 0) - sumCategories;

  const hasBudgetData = Object.keys(data?.data ?? {}).length > 0;

  return {
    data,
    isLoading,
    refetch,
    sumCategories,
    totalExpenses: sumCategories,
    incomeAfterExpenses,
    income: data?.data?.income,
    hasBudgetData,
  };
}
