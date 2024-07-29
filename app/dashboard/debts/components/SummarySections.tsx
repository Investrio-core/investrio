"use client";
import { Card } from "@/app/components/dashboard/Card";
import { CheckboxTable } from "@/app/components/dashboard/CheckboxTable";
import { BalanceOverTime } from "@/app/components/dashboard/BalanceOverTime";
import { Balance } from "@/app/components/dashboard/Balance";
import { formatMonthName } from "@/app/utils/formatters";
import { ResultsProps } from "@/app/components/dashboard/results.types";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/buttons";
import Link from "next/link";
import dayjs from "dayjs";

import { useState } from "react";
import AdditionalPaymentModal from "@/app/components/AdditionalPaymentModal";
import { Loading } from "@/app/components/ui/Loading";
import Mixpanel from "@/services/mixpanel";
import { useComparisonData } from "@/app/hooks/useData/useComparisonData";

interface SummaryData {
  betterMethod: string;
  endDate?: Date | string;
  totalInterestPaid?: number;
  minPayment: number;
  totalInterestSaved: number;
  extraPayAmount?: number;
  endBalance?: number;
}

export const SummarySection = ({
  extraPayAmount,
  betterMethod,
  endDate,
  totalInterestPaid,
  minPayment,
  totalInterestSaved,
  endBalance,
}: SummaryData) => {
  // const axiosAuth = useAxiosAuth();
  // const queryClient = useQueryClient();
  // const { data: sessionData } = useSession();
  // const [isAdditionalPaymentModalOpen, setIsAdditionalPaymentModalOpen] =
  //   useState(false);

  // const { data: comparisonData, isLoading } = useComparisonData(
  //   data !== undefined && data?.length > 0
  // );
  // const {
  //   withStrategy,
  //   withoutStrategy,
  //   totalInterestPaid,
  //   withStrategyTotalInterestPaid,
  //   savedInterest,
  //   monthsFaster,
  // } = comparisonData?.data || {};

  //   const totalInterestWithStrategy =
  //     withStrategy?.reduce((acc, next) => {
  //       return acc + (next?.totalInterestPaid ?? 0);
  //     }, 0) ?? 0;

  //   const totalInterestWithoutStrategy =
  //     withoutStrategy?.reduce((acc, next) => {
  //       return acc + (next?.monthlyInterestPaid ?? 0);
  //     }, 0) ?? 0;

  //   const totalSavings = totalInterestWithoutStrategy - totalInterestWithStrategy;

  // const { mutate: update, isPending } = useMutation({
  //   mutationKey: ["extra"],
  //   mutationFn: async (extraPayAmount: number) => {
  //     if (!sessionData?.user.id) return {};

  //     return await axiosAuth.post(
  //       `/dashboard/strategy/update-extra/${sessionData.user.id}`,
  //       { extraPayAmount: extraPayAmount }
  //     );
  //   },
  //   onSuccess: () => {
  //     console.log("-- successfully updated extra payment amount --");
  //     queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  //     queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
  //   },
  // });

  // if (!sessionData?.user) {
  //   return <Loading />;
  // }

  // const handleChangeAdditionalPaymentModalOpen = () => {
  //   setIsAdditionalPaymentModalOpen(!isAdditionalPaymentModalOpen);
  // };

  // const handleSubmitAdditionalPaymentModal = (extraPayAmount: number) => {
  //   update(extraPayAmount);
  //   setIsAdditionalPaymentModalOpen(false);
  //   Mixpanel.getInstance().track("edit_extra_payment");
  // };

  // const debts = data?.[0]?.data?.map((info, index) => ({
  //   id: index,
  //   label: info.title,
  //   subLabel: "Credit Card",
  //   value1: info.monthlyPayment,
  //   value2: info.remainingBalance,
  //   paid: false,
  // }));

  // const snowball = data?.[0];

  // const debtFreeBy = dayjs(
  //   new Date(data?.[data.length - 1]?.paymentDate).getTime()
  // );

  const debtFreeBy = dayjs(endDate);
  const neverBecomesDebtFree = endBalance === undefined || endBalance > 0;
  const month = neverBecomesDebtFree ? "Never" : debtFreeBy.format("MMMM");
  const year = neverBecomesDebtFree ? "" : debtFreeBy.format("YYYY");

  return (
    <div>
      <div className="w-full">
        {/* flex-wrap lg:flex-nowrap */}
        <div className="flex gap-2 lg:gap-9 overflow-x-auto min-w-full">
          <Card icon="debt-free" label="Debt Free" date={{ month, year }} />
          {totalInterestSaved > 0 ? (
            <Card
              icon="total-saved"
              label="Total Saved"
              // value={snowball?.totalInterestPaid}
              value={totalInterestSaved}
              sublabel="While in Repayment Plan"
            />
          ) : null}
          <Card
            icon="extra-payment"
            label={`Interest Paid ${
              neverBecomesDebtFree
                ? `until ${debtFreeBy.format("MMM")} ${debtFreeBy.format("YY")}`
                : ""
            }`}
            // value={snowball?.totalInterestPaid}
            value={totalInterestPaid}
            sublabel="While in Repayment Plan"
          />
          {betterMethod ? (
            <Card
              icon="extra-payment"
              label="Method"
              // value={snowball?.totalInterestPaid}
              value={betterMethod}
              sublabel="While in Repayment Plan"
            />
          ) : null}
          {/* <Card
            icon="total-debt"
            label="Total Balance"
            value={totalInitialBalance || 0}
          /> */}
          <Card icon="calendar" label="Min. Payment" value={minPayment || 0} />
          <Card
            icon="extra-payment"
            label="Extra payment"
            value={extraPayAmount}
            // onEditClick={handleChangeAdditionalPaymentModalOpen}
            // withEdit
          />
        </div>
      </div>
      {/* <AdditionalPaymentModal
        onSubmit={handleSubmitAdditionalPaymentModal}
        value={data?.[0]?.extraPayAmount ?? 0}
        open={isAdditionalPaymentModalOpen}
        onClose={handleChangeAdditionalPaymentModalOpen}
      /> */}
    </div>
  );
};
