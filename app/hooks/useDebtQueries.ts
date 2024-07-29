import { useSession } from "next-auth/react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { formatDebtsForApi } from "@/lib/formatDebtsForApi";
import Mixpanel from "@/services/mixpanel";
import { DebtFormType, FinancialRecord } from "@/types/debtFormType";
import { FinancialRecord as FinRec } from "@/types/financial";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const DEBTS_QUERY_KEY = "extra-payments";

// expected format for frontend rendering
const formatDebtsForFrontEnd = (debts: FinRec[]) =>
  debts.map((r: FinRec) => {
    return {
      id: r.id,
      debtName: r.title,
      balance: String(r.initialBalance),
      periodicity: r.periodicity,
      debtType: r.type,
      dueDate: r.payDueDate,
      rate: String(r.interestRate) + "%",
      minPayment: String(r.minPayAmount),
      extraPayAmount: r.extraPayAmount,
    };
  });

// const formatDebtsForQueryCache = (debts: FinancialRecord[]) => {

// }

// API Response Format:
// {
//   "id": "clz07q95m0000b8fp1s3xccnz",
//   "title": "Visa",
//   "type": "CreditCard",
//   "periodicity": "MONTH",
//   "initialBalance": 9400,
//   "interestRate": 0.25,
//   "minPayAmount": 300,
//   "payDueDate": "2024-07-24T19:03:30.004Z",
//   "extraPayAmount": 0,
//   "createdAt": "2024-07-24T19:03:30.009Z",
//   "updatedAt": "2024-07-24T19:03:30.009Z",
//   "userId": "clyz41gf00000342wav7f86n9"
// }

// API Expected Format:
// {
//   "userId": "clyz41gf00000342wav7f86n9",
//   "debtTitle": "1",
//   "minPayAmount": 11,
//   "interestRate": 0.01,
//   "debtType": "CreditCard",
//   "initialBalance": 100,
//   "extraPayAmount": 0,
//   "periodicity": "MONTH"
// }

export default function useDebtQueries(setDebts?: Function) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const { data: sessionData } = useSession();

  const { mutate: updateExtraPayment, isPending: updateExtraPaymentIsPending } =
    useMutation({
      mutationKey: ["extra"],
      mutationFn: async (extraPayAmount: number) => {
        if (
          sessionData === undefined ||
          sessionData === null ||
          !sessionData.user ||
          !sessionData.user.id
        )
          return;

        return await axiosAuth.post(
          `/dashboard/strategy/update-extra/${sessionData.user.id}`,
          { extraPayAmount: extraPayAmount }
        );
      },
      onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ["dashboard", sessionData?.user?.id] });
        // queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        queryClient.invalidateQueries({ queryKey: ["extra-payments"] });
      },
    });

  const {
    mutate: createDebt,
    isSuccess: isSuccess,
    isPending: isPending,
  } = useMutation({
    mutationKey: ["financials"],
    mutationFn: async ({
      debts,
      newDebt,
      extraPayAmount,
    }: {
      debts: DebtFormType[];
      newDebt: DebtFormType;
      extraPayAmount: number;
    }) => {
      if (
        sessionData === undefined ||
        sessionData === null ||
        !sessionData.user ||
        !sessionData.user.id
      )
        return;

      const newDebtFormatted = formatDebtsForApi(
        sessionData.user.id,
        [newDebt],
        String(extraPayAmount ?? 0)
      );

      return await axiosAuth.post(
        `/dashboard/strategy/create/${sessionData.user.id}`,
        newDebtFormatted[0]
      );
    },
    onSuccess(data) {
      // if (data?.data?.track?.isFirstPaywall) {
      //   Mixpanel.getInstance().track("trial_paywall");
      // }
      queryClient.invalidateQueries({ queryKey: ["extra-payments"] });
    },
  });

  const {
    mutate: updateDebt,
    isSuccess: updateIsSuccess,
    isPending: updateIsPending,
  } = useMutation({
    mutationKey: ["financials"],
    mutationFn: async ({
      debts,
      updatedDebt,
      extraPayAmount,
    }: {
      debts: DebtFormType[];
      updatedDebt: DebtFormType;
      extraPayAmount: number;
    }) => {
      if (
        sessionData === undefined ||
        sessionData === null ||
        !sessionData.user ||
        !sessionData.user.id
      )
        return;

      const updatedDebtFormatted = formatDebtsForApi(
        sessionData.user.id,
        [updatedDebt],
        String(extraPayAmount ?? 0)
      );

      return await axiosAuth.post(
        `/dashboard/strategy/update/${sessionData.user.id}`,
        updatedDebtFormatted[0]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extra-payments"] });
      // queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
      // queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const { mutate: deleteRecords, isSuccess: deleteIsSuccess } = useMutation({
    mutationKey: ["financials"],
    mutationFn: async (deletedIds: string[]) => {
      queryClient.setQueryData(
        ["extra-payments"],
        (prevState: { data: DebtFormType[] }) => {
          if (!prevState?.data?.filter) {
            return prevState;
          }

          const stateAfterDelete = prevState.data.filter(
            (debt: DebtFormType) =>
              !debt.id || (debt.id && !deletedIds.includes(debt.id))
          ) as DebtFormType[];

          return { ...prevState, data: stateAfterDelete };
        }
      );

      return await axiosAuth.post(`/dashboard/strategy/delete`, deletedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extra-payments"] });
      // queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
      // queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    createDebt,
    isSuccess,
    isPending,
    updateDebt,
    updateIsSuccess,
    updateIsPending,
    deleteRecords,
    deleteIsSuccess,
    updateExtraPayment,
    updateExtraPaymentIsPending,
  };
}
