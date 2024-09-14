import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { DebtFormType, FinancialRecordSchema } from "@/types/debtFormType";

const categories = ["wants", "needs", "savings", "debts"];

export default function useDebtData() {
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();

  const {
    data: debtsData,
    isLoading: debtsLoading,
    refetch: refetchDebts,
    isRefetching: isRefetchingDebts,
  } = useQuery({
    queryKey: ["extra-payments"],
    queryFn: async () => {
      const debtsData = await axiosAuth.get(
        `/dashboard/records/${session?.user?.id}`
      );

      // queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
      // queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      // console.log("-- FETCHED DEBTS --");
      // console.log(debtsData);

      // normalize debt data as the old interest rate was saved as zero leading decimals, e.g. 0.25...
      const debts = debtsData?.data.map((debt: FinancialRecordSchema) => {
        if (String(debt.interestRate)?.[0] === "0") {
          return { ...debt, interestRate: debt.interestRate * 100 };
        }
        return debt;
      });

      return { ...debtsData, data: debts };
    },
    staleTime: 148000,
    // refetchOnMount: status !== "payment-config",
    // refetchOnWindowFocus: status !== "payment-config",
    // enabled: !!session?.user.id || status !== "payment-config",
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
    // },
  });

  const hasDebtData = useMemo(() => {
    const debts = debtsData?.data;
    if (
      debts === undefined ||
      debts?.length === undefined ||
      debts.length === 0
    ) {
      return false;
    }
    return true;
  }, [debtsData?.data]);

  return { data: debtsData, hasDebtData, debtsLoading };
}
