'use client'
import { Card } from "./Card";
import { CheckboxTable } from "./CheckboxTable";
import { BalanceOverTime } from "./BalanceOverTime";
import { Balance } from "./Balance";
import { formatMonthName } from "@/app/utils/formatters";
import { ResultsProps } from "./results.types";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/buttons";
import Link from "next/link";
import dayjs from "dayjs";

import { useState } from "react";
import AdditionalPaymentModal from "../AdditionalPaymentModal";
import { Loading } from "../ui/Loading";
import Mixpanel from "@/services/mixpanel";

export const DashboardInfo = ({ data }: ResultsProps) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient()
  const { data: sessionData } = useSession();
  const [isAdditionalPaymentModalOpen, setIsAdditionalPaymentModalOpen] =
    useState(false);

  if (!sessionData?.user) {
    return <Loading />;
  }

  const handleChangeAdditionalPaymentModalOpen = () => {
    setIsAdditionalPaymentModalOpen(!isAdditionalPaymentModalOpen);
  };

  const {
    mutate: update,
    isPending
  } = useMutation({
    mutationKey: ["extra"],
    mutationFn: async (extraPayAmount: number) => {
      return await axiosAuth.post(
        `/dashboard/strategy/update-extra/${sessionData.user.id}`,
        {extraPayAmount: extraPayAmount}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['dashboard']})
    }
  });

  const handleSubmitAdditionalPaymentModal = (extraPayAmount: number) => {
    update(extraPayAmount)
    setIsAdditionalPaymentModalOpen(false)
    Mixpanel.getInstance().track('edit_extra_payment')
  };

  const debts = data[0]?.data?.map((info, index) => ({
    id: index,
    label: info.title,
    subLabel: "Credit Card",
    value1: info.monthlyPayment,
    value2: info.remainingBalance,
    paid: false,
  }));

  const snowball = data[0];

  const debtFreeBy = dayjs(
    new Date(data[data.length - 1]?.paymentDate).getTime()
  );
  const month = debtFreeBy.format("MMMM");
  const year = debtFreeBy.format("YYYY");

  // if (!data?.length) {
  //   return (
  //     <div className="text-center mx-auto">
  //       <h2>No Information has been registered yet.</h2>
  //       <Link href={"/dashboard/debts/add"} onClick={() => Mixpanel.getInstance().track('setup_strategy_start')}>
  //         <Button text="Set up Strategy" classProp="mx-auto" />
  //       </Link>
  //     </div>
  //   );
  // }

  const minPayment = snowball?.data?.reduce(
    (prev, curr) => prev + curr.minPayAmount,
    0
  );

  if (isPending) {
    return <Loading />
  }

  return (
    <div>   
      <div className="my-12 w-full gap-9">
        <div className="flex gap-9 overflow-x-auto min-w-full">
          <Card icon="calendar" label="Min. Payment" value={minPayment || 0} />
          <Card
            icon="extra-payment"
            label="Extra payment"
            value={snowball?.extraPayAmount}
            onEditClick={handleChangeAdditionalPaymentModalOpen}
            withEdit
          />
          <Card icon="debt-free" label="Debt Free By:" date={{ month, year }} />
          <Card
            icon="total-saved"
            label="Total Interest Saved"
            value={snowball?.totalInterestPaid}
            sublabel="While in Repayment Plan"
          />
        </div>
        <div className="flex mt-9 gap-9">
          <div className="w-full">
            <div className="grid grid-cols-5 gap-9 w-full">
              <div className="col-span-5 md:col-span-2">
                <CheckboxTable infos={debts} />
              </div>
              <div className="col-span-5 md:col-span-3">
                <Balance data={data} />
              </div>
            </div>
            <div className="mt-9">
              <BalanceOverTime data={data} />
            </div>
          </div>
        </div>
      </div>
      <AdditionalPaymentModal
        onSubmit={handleSubmitAdditionalPaymentModal}
        value={data[0]?.extraPayAmount}
        open={isAdditionalPaymentModalOpen}
        onClose={handleChangeAdditionalPaymentModalOpen}
      />
    </div>
  );
};
