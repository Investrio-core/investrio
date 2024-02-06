"use client";

import DebtStatCard from "@/app/components/debts/DebtStatCard";
import { CiCalendar } from "react-icons/ci";
import { BiDollar, BiPlus } from "react-icons/bi";
import Link from "next/link";
import { DebtType } from "@/types/debtFormType";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/formatters";
import useAxiosAuth from "@/app/lib/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { Loading } from "@/app/components/loading/Loading";

async function getData(userId: string): Promise<DebtType[]> {
  const axiosAuth = useAxiosAuth();
  
  const res = await axiosAuth.get(`/user/dashboard/${userId}`, {
    withCredentials: true,
  });

  const json = await res.data;

  return json;
}

export default async function DebtsDashboardPage() {
  const { data } = useSession();

  if (!data?.user) {
    return <Loading />;
  }

  const debts = await getData(data.user.id);

  const debtFreeDate = debts
    .flatMap((debt) =>
      debt.data.map((debtItem) => {
        if (debtItem.remainingBalance === 0) {
          return debtItem.currentDate;
        }
      })
    )
    .filter((debt) => debt !== undefined)
    .map((debt) => debt!)
    .sort((a, b) => b - a)[0];

  const minPayAmount = debts.reduce((acc, debt) => {
    return acc + debt.minPayAmount;
  }, 0);

  if (!debts.length) {
    return <h1>No data found.</h1>;
  }

  return (
    <div className="grid gap-2 p-3 md:grid-cols-12">
      <div className="flex flex-col md:col-span-3">
        <DebtStatCard
          title="Monthly Minimum Payment"
          description={formatCurrency(minPayAmount)}
          icon={CiCalendar}
        />
      </div>
      <div className="flex  flex-col md:col-span-3">
        <DebtStatCard
          title="Extra Payment"
          description="$ 0.00"
          icon={BiDollar}
        />
      </div>
      <div className="flex flex-col md:col-span-3">
        <DebtStatCard
          title="Debt Free By*"
          description={dayjs(debtFreeDate).format("MMM D, YYYY")}
          icon={CiCalendar}
          extra="No new debts are accrued*"
        />
      </div>
      <div className="flex flex-col md:col-span-2">
        <DebtStatCard
          title="Total Interest Saved"
          description="$ 375.00"
          extra="Assuming following the plan*"
        />
      </div>
      <Link
        href={"/dashboard/debts/add"}
        className="items-cenmter flex flex-col justify-center text-center"
      >
        <div className="bg-primary mx-auto rounded-full p-1 text-white">
          <BiPlus />
        </div>
        <span className="text-[10px]">Add a Debt</span>
      </Link>

      {debts.map((debt) => (
        <div
          key={debt.title}
          className="card flex flex-col gap-y-3 bg-white p-5 md:col-span-4"
        >
          <div>
            <h1 className="font-bold">{debt.title}</h1>
            <h3 className="text-sm">
              Projected Payoff Date:{" "}
              {dayjs(debt?.data?.pop()?.currentDate).format("MMMM, YYYY")}
            </h3>
          </div>
          <div className="flex flex-col gap-5">
            {debt.data.slice(0, 3).map((upcomingDebt) => (
              <div className="flex items-center gap-5">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                    />
                  </label>
                </div>
                <div
                  key={upcomingDebt.currentDate}
                  className="flex w-full flex-col"
                >
                  <div className="flex justify-between">
                    <p className="font-semibold text-black">
                      {dayjs(upcomingDebt.currentDate).format("MMMM")} Payment:
                    </p>
                    <p className="font-semibold text-black">
                      {formatCurrency(upcomingDebt.monthlyPayment)}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p>Remaining balance:</p>
                    <p>{formatCurrency(upcomingDebt.remainingBalance)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
