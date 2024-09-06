"use client";
import { Card } from "@/app/components/dashboard/Card";
import { CheckboxTable } from "@/app/components/dashboard/CheckboxTable";
import { BalanceOverTime } from "@/app/components/dashboard/BalanceOverTime";
import { Balance } from "@/app/components/dashboard/Balance";
import { formatMonthName } from "@/app/utils/formatters";
import { Data, ResultsProps } from "@/app/components/dashboard/results.types";
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
import { useTabContext } from "@/app/context/TabContext/context";
import { Results } from "@/app/hooks/calculatorsSnowball";

export const DashboardInfo = ({
  // data,
  debtsData,
  snowballResultsWithExtra,
  snowballResultsWithoutExtra,
  _setPercentDown,
}: {
  // data: Data[];
  debtsData: Data[];
  snowballResultsWithExtra?: Results;
  snowballResultsWithoutExtra?: Results;
  _setPercentDown?: Function;
}) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const { data: sessionData } = useSession();
  const [isAdditionalPaymentModalOpen, setIsAdditionalPaymentModalOpen] =
    useState(false);
  const { setTabs } = useTabContext();

  const { mutate: update, isPending } = useMutation({
    mutationKey: ["extra"],
    mutationFn: async (extraPayAmount: number) => {
      const oldData = queryClient.getQueryData(["extra"]);
      if (!sessionData?.user?.id) return oldData;

      return await axiosAuth.post(
        `/dashboard/strategy/update-extra/${sessionData.user.id}`,
        { extraPayAmount: extraPayAmount }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  if (!sessionData?.user) {
    return <Loading />;
  }

  const handleChangeAdditionalPaymentModalOpen = () => {
    setIsAdditionalPaymentModalOpen(!isAdditionalPaymentModalOpen);
  };

  const handleSubmitAdditionalPaymentModal = (extraPayAmount: number) => {
    update(extraPayAmount);
    setIsAdditionalPaymentModalOpen(false);
    Mixpanel.getInstance().track("edit_extra_payment");
  };

  // const debts =
  //   data?.[0]?.data?.map((info, index) => ({
  //     id: index,
  //     label: info.title,
  //     subLabel: "Credit Card",
  //     value1: info.monthlyPayment,
  //     value2: info.remainingBalance,
  //     paid: false,
  //     extraPaymentThisMonth: false, //info.additionalPayment,
  //     accruedInterest: 0,
  //     balanceStart: 0,
  //     balanceEnd: 0,
  //   })) ?? [];

  if (isPending) {
    return <Loading />;
  }

  const fallback = (
    <div className="text-center mx-auto px-4 py-6 text-violet-500 font-bold">
      <h2>No debt information has been registered yet.</h2>
    </div>
  );
  const showFallBack =
    (!debtsData?.length && !(debtsData?.length > 0)) ||
    snowballResultsWithoutExtra === undefined;

  return showFallBack ? (
    fallback
  ) : (
    <div className="flex-grow mt-[12px] rounded-[18px] border border-[#d2daff] mx-[12px] mb-[8px]">
      <div className="my-1 w-full lg:w-[100%] lg:gap-9">
        <div className="flex mt-1 lg:mt-9 gap-[8px] lg:gap-9">
          <div className="w-full">
            <div className="grid grid-cols-5 gap-[8px] lg:gap-9 w-full">
              <div className="col-span-5 gap-[8px] md:col-span-2">
                <CheckboxTable
                  // infos={debts ?? []}
                  _setPercentDown={_setPercentDown}
                  snowballResultsCurrentMonth={
                    snowballResultsWithExtra?.payments?.[0]?.accounts ??
                    snowballResultsWithoutExtra?.payments?.[0]?.accounts
                  }
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <Balance
                  data={[]}
                  results={
                    snowballResultsWithExtra?.payments?.slice(0, 6) ??
                    snowballResultsWithoutExtra?.payments?.slice(0, 6)
                  }
                />
              </div>
            </div>
            {/* <div className="mt-[8px] lg:mt-9">
              <BalanceOverTime
                data={[]}
                results={
                  snowballResultsWithExtra?.payments ??
                  snowballResultsWithoutExtra?.payments
                }
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
