"use client";
import { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/buttons";
import { TbAlertHexagon } from "react-icons/tb";
import Card from "@/app/components/Card";
import CustomLineChart from "@/app/components/ui/charts/CustomLineChart";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/app/utils/formatters";
import { Area } from "recharts";
import { Loading } from "@/app/components/ui/Loading";
import Image from "next/image";
import { ComparisonData } from "@/types/financial";
import Link from "next/link";
import MoneyIcon from "@/public/icons/money.svg";
import PiggyIcon from "@/public/icons/piggybank.svg";
import TimeIcon from "@/public/icons/time.svg";

import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import Mixpanel from "@/services/mixpanel";
import dayjs from "dayjs";
import { useComparisonData } from "@/app/hooks/useData/useComparisonData";
import { ResultsProps, Data } from "@/app/components/dashboard/results.types";
import useCalculators from "@/app/hooks/useCalculators";
import { Results } from "@/app/hooks/calculatorsSnowball";

type Props = {
  userId?: string;
  // data: Data[];
  debts: Data[];
  snowballResultsWithExtra: Results | undefined;
  snowballResultsWithoutExtra: Results | undefined;
};

export const DebtsComparison = ({
  userId,
  // data: debtData,
  debts: debtData,
  snowballResultsWithExtra,
  snowballResultsWithoutExtra,
}: Props) => {
  const [selected, setSelected] = useState("with-investrio");
  //   const axiosAuth = useAxiosAuth();

  // const { data, isLoading } = useComparisonData(
  //   debtData !== undefined && debtData?.length > 0
  // );

  if (!userId || !debtData) return <Loading />;

  const withoutGraph = snowballResultsWithoutExtra?.payments?.map(
    (data, idx) => ({
      name: dayjs(data["accounts"][0].paymentDate).format("MMM"),
      balance: data.balance,
    })
  );

  const withGraph = snowballResultsWithExtra?.payments?.map((data, idx) => ({
    name: dayjs(data["accounts"][0].paymentDate).format("MMM"),
    balance: data.balance,
  }));

  const monthsFaster =
    (snowballResultsWithoutExtra?.totalPayments ?? 0) -
    (snowballResultsWithExtra?.totalPayments ?? 0);

  const savedInterest =
    (snowballResultsWithoutExtra?.totalInterestPaid ?? 0) -
    (snowballResultsWithExtra?.totalInterestPaid ?? 0);

  const withoutEndDate = snowballResultsWithoutExtra?.payments?.[0]?.[
    "accounts"
  ]?.[0] ? (
    <span className="text-nowrap">
      Debt Free By&nbsp;
      {dayjs(
        snowballResultsWithoutExtra.payments[
          snowballResultsWithoutExtra.payments.length - 1
        ]["accounts"][0].paymentDate
      ).format("MMMM YYYY")}
    </span>
  ) : (
    "Add Debts to calculate debt free date"
  );
  const withEndDate = snowballResultsWithExtra?.payments?.[0]?.[
    "accounts"
  ]?.[0] ? (
    <span className="text-nowrap">
      Debt Free by{" "}
      {dayjs(
        snowballResultsWithExtra.payments[
          snowballResultsWithExtra.payments.length - 1
        ]["accounts"][0].paymentDate
      ).format("MMMM YYYY")}
    </span>
  ) : (
    "Add Debts to calculate debt free date"
  );

  // const withoutGraph = withoutStrategy.map((data) => ({
  //   name: dayjs(data.paymentDate).format("MMM"),
  //   balance: data.remainingBalance,
  // }));

  // const withGraph = withStrategy.map((data) => ({
  //   name: dayjs(data.paymentDate).format("MMM"),
  //   balance: data.remainingBalance,
  // }));

  // console.log("-- withGraph from backend --");
  // console.log(withGraph);

  // const withoutEndDate =
  //   withoutStrategy[withoutStrategy.length - 1].paymentDate;
  // const withEndDate = withStrategy[withStrategy.length - 1].paymentDate;

  const fallback = (
    <div className="text-center mx-auto px-4 py-6 text-violet-500 font-bold">
      <h2>No debt information has been registered yet.</h2>
    </div>
  );
  const showFallBack = !debtData?.length && !(debtData?.length > 0);

  return showFallBack ? (
    fallback
  ) : (
    <>
      <div className="my-2 w-full gap-9 md:px-[24px] md:mx-[24px] md:my-[24px]">
        <div className="w-full rounded-lg">
          {snowballResultsWithExtra ? (
            <label
              className={`flex h-full flex-col gap-5
            rounded-2xl border-[#9248F8] bg-white p-4 transition-all hover:border-2
            ${selected === "with-investrio" ? "border-2" : ""}`}
            >
              <div className="flex items-center justify-between text-left">
                <div>
                  <h2 className={"text-2xl font-semibold text-[#9248F8]"}>
                    With Investrio
                  </h2>
                  <div className="text-2xl w-[200px]">
                    {withEndDate}
                    {/* Debt Free By: <br />{" "}
                  {dayjs(withEndDate).format("MMMM - YYYY")} */}
                  </div>
                </div>
              </div>
              <div className="border-b-2 border-gray-100" />
              {/* lg:grid-cols-12 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 shadow-sm lg:col-span-6">
                  {withGraph !== undefined ? (
                    <Card fullWidth title="Balance over time">
                      <CustomLineChart
                        data={withGraph}
                        area={
                          <Area
                            dataKey="balance"
                            strokeWidth={3}
                            stroke="#8884d8"
                            fill="url(#primary)"
                          />
                        }
                      />
                    </Card>
                  ) : null}
                </div>

                <div className="col-span-4 lg:col-span-6">
                  <div className="flex flex-col gap-3 gap-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-b-2 border-[#330F6626] bg-[#FBF7FF] p-5 w-[100%]">
                        <MoneyIcon width="30" height="30" viewBox="0 0 64 64" />
                        <div className="px-[8px]">
                          <span className="text-base text-center text-indigo-900 font-medium">
                            You can get out of debt faster and also save{" "}
                            <strong>
                              {formatCurrency(savedInterest) || "$0"}
                            </strong>{" "}
                            in interest!{" "}
                          </span>
                          {/* <h1 className="text-2xl font-black">
                          {formatCurrency(savedInterest) || "$0"}
                        </h1> */}
                        </div>
                      </div>
                      <div className="flex gap-4 rounded-xl border-b-2 border-[#330F6626] bg-[#FBF7FF] p-5 w-[100%]">
                        <div className="text-left px-[8px]">
                          <span>Save time, pay</span>
                          <br />
                          <span className="text-sm">
                            <span className="text-2xl font-extrabold">
                              {monthsFaster}{" "}
                            </span>
                            month{monthsFaster > 1 && "s"} faster!
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-col justify-start items-center gap-0.5 inline-flex">
                      <TimeIcon width="36" height="36" />
                      <div className="text-center text-indigo-900 text-base font-medium pt-[2px] px-[8px]">
                        Investrio can help you get there with accountability and
                        automation
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-y-5 items-center justify-evenly text-purple font-semibold">
                      {/* <div className="text-2xl w-[200px]">
                      Total Interest: <br />{" "}
                      {formatCurrency(withStrategyTotalInterestPaid)}
                    </div>
                    <hr className="w-full md:h-16 md:w-auto border border-gray-100" />

                    <div className="text-2xl w-[200px]">
                      Debt Free By: <br />{" "}
                      {dayjs(withEndDate).format("MMMM - YYYY")}
                    </div> */}
                    </div>

                    {/* <span className="text-base font-light text-[#5D6B82]">
                    Investrio can help you get there with accountability.
                  </span> */}
                  </div>
                </div>
              </div>
            </label>
          ) : (
            <div className="px-[6px] py-[4px] ">
              Add Extra Monthly Payment to see how it impacts your debt free
              date and interest savings
            </div>
          )}
        </div>
        <div className="mt-5 w-full rounded-lg">
          <label
            onClick={() => setSelected("with-without-planning")}
            className="flex h-full flex-col gap-5 rounded-2xl border-[#9248F8] bg-white p-4 transition-all"
          >
            <div className="flex items-center justify-between text-left">
              <div>
                <h2 className={"text-2xl font-semibold with-without-planning"}>
                  Without Planning
                </h2>
                <div className="text-2xl w-[200px]">
                  {withoutEndDate}
                  {/* Debt Free Date: <br />{" "}
                  {dayjs(withoutEndDate).format("MMMM - YYYY")} */}
                </div>
              </div>
            </div>
            <div className="border-b-2 border-gray-100" />

            {/* lg:grid-cols-12 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 shadow-sm lg:col-span-6">
                {withoutGraph !== undefined ? (
                  <Card title="Balance over time" fullWidth>
                    <CustomLineChart
                      data={withoutGraph}
                      area={
                        <Area
                          dataKey="balance"
                          strokeWidth={3}
                          stroke="#8884d8"
                          fill="url(#primary)"
                        />
                      }
                    />
                  </Card>
                ) : null}
              </div>

              <div className="col-span-4 lg:col-span-6">
                <div className="flex flex-col gap-3 gap-y-6 pb-[32px] pt-[12px]">
                  <div className="flex-col justify-start items-center gap-[5px] inline-flex">
                    <PiggyIcon width="36" height="36" />
                    <div className="text-center text-indigo-900 text-base font-medium pt-[5px] px-[8px]">
                      In this plan, we assume you are paying the minimum.
                    </div>
                  </div>

                  <div className="flex-col justify-start items-center gap-[5px] inline-flex">
                    <div className="flex-col justify-start items-center gap-[5px] inline-flex">
                      <TimeIcon width="36" height="36" />
                      <div className="text-center text-indigo-900 text-base font-medium pt-[5px] px-[8px]">
                        The debt will take longer to pay off and it is more
                        expensive.
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex flex-col md:flex-row gap-y-5 items-center justify-evenly text-purple font-semibold">
                    <div className="text-2xl w-[200px]">
                      Total Interest: <br /> {formatCurrency(totalInterestPaid)}
                    </div>
                    <hr className="w-full md:h-16 md:w-auto border border-gray-100" />

                    <div className="text-2xl w-[200px]">
                      Debt Free Date: <br />{" "}
                      {dayjs(withoutEndDate).format("MMMM - YYYY")}
                    </div>
                  </div> */}

                  {/* <div className="flex flex-col md:flex-row justify-center items-center gap-3">
                    <div className="flex items-center gap-4 rounded-xl bg-[#F6F6F6] p-5 text-[#747682]">
                      <TbAlertHexagon className="text-5xl" />
                      <span className="text-left text-sm">
                        In this plan, we <br /> assume you are <br /> paying the
                        minimum.{" "}
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
      {/* <div className="mb-5 border-b-2 border-gray-100 p-3" /> */}

      {/* <div className="flex justify-center gap-7">
        <Link
          href={"/dashboard/debts"}
          onClick={() => {
            Mixpanel.getInstance().track("setup_strategy_calculated");
          }}
        >
          <Button disabled={!selected.length} text="Proceed" />
        </Link>
      </div> */}
    </>
  );
};

export default DebtsComparison;

// Add book on setting / delete new +
// Font size on settings +
// Icon change on settings +
// trial status
// Redirect to dashboard