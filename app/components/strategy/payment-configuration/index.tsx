"use client";
import { useMemo, useState } from "react";
import { Button } from "../../ui/buttons";
import { TbAlertHexagon } from "react-icons/tb";
import Card from "../../Card";
import CustomLineChart from "@/app/components/ui/charts/CustomLineChart";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/app/utils/formatters";
import { Area } from "recharts";
import { Loading } from "../../ui/Loading";
import Image from "next/image";
import {  IPaymentScheduleGraphType } from "@/types/financial";
import { convertGraphDataToDisplayData, generateGraphData } from "@/app/components/Strategy/payment-configuration/utils";
import Link from "next/link";
import MoneyIcon from '@/public/icons/money.svg'
import useAxiosAuth from "@/app/hooks/useAxiosAuth";

type Props = {
  userId?: string;
};

export const PaymentConfiguration = ({ userId }: Props) => {
  const [selected, setSelected] = useState("with-investrio");
  const axiosAuth = useAxiosAuth()

  const { data: withInvestrio, isLoading: isWithInvestrioLoading} =
    useQuery<IPaymentScheduleGraphType>({
      queryKey: ["extra-payments"],
      queryFn: async () => await axiosAuth.get(`/dashboard/extra-pay-graph/${userId}`),
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: !!userId
    });

  const { data: withoutPlanning, isLoading: isWithoutPlanningLoading} =
    useQuery<IPaymentScheduleGraphType>({
      queryKey: ["no-extra-payments"],
      queryFn: async () => await axiosAuth.get(`/dashboard/no-extra-pay-graph/${userId}`),
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: !!userId
    });

  const { data: paymentConfigurationSummary, isLoading: isLoadingPaymentConfiguration, isRefetching } = useQuery({
    queryKey: ["paymentConfigurationSummary"],
    queryFn: async () => await axiosAuth.get(`/dashboard/step-three/${userId}`),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!userId
  });

  const { withInvestrioData, withoutPlanningData } = useMemo(() => {
    return {
      withInvestrioData: convertGraphDataToDisplayData({
        graphData: withInvestrio?.data,
        summary: paymentConfigurationSummary?.data
      }),
      withoutPlanningData: convertGraphDataToDisplayData({
        graphData: withoutPlanning?.data,
        summary: paymentConfigurationSummary?.data,
        withPlanning: false,
      })
    }
  }, [withInvestrio, withoutPlanning, paymentConfigurationSummary]);

  
  const withInvestrioGraph = useMemo(() => generateGraphData(withInvestrio?.data), [withInvestrio])
  const withoutInvestrioGraph = useMemo(() => generateGraphData(withoutPlanning?.data), [withoutPlanning])
  
  if (!userId || !withInvestrioGraph || !withoutInvestrioGraph || isRefetching) return <Loading/>

  return (
    <>
      <div className="my-12 w-full gap-9">
        <div className="w-full rounded-lg">
          <label
            className={`flex h-full flex-col gap-5
            rounded-2xl border-[#9248F8] bg-white p-4 transition-all hover:border-2
            ${selected === "with-investrio" ? "border-2" : ""}`}
          >
            <div className="flex items-center justify-between text-left">
              <div>
                <h2
                  className={"text-2xl font-semibold text-[#9248F8]"}
                >
                  With Investrio
                </h2>
              </div>
            </div>
            <div className="border-b-2 border-gray-100"/>

            <div className="grid grid-cols-4 lg:grid-cols-12 gap-4">
              <div className="col-span-4 shadow-sm lg:col-span-6">
                <Card fullWidth title="Balance over time">
                  {isWithInvestrioLoading && (
                    <div className="flex justify-center items-center">
                      <Loading isHeightScreen={false} size="m"/>
                    </div>
                  )}
                  <CustomLineChart
                    data={withInvestrioGraph}
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
              </div>

              <div className="col-span-4 lg:col-span-6">
                <div className="flex flex-col gap-3 gap-y-6">
                  <div
                    className="flex flex-col md:flex-row gap-y-5 items-center justify-evenly text-purple font-semibold">
                    <div className="text-2xl w-[200px]">
                      Total Interest: <br/> {formatCurrency(withInvestrioData.totalInterest)}
                    </div>
                    <hr className="w-full md:h-16 md:w-auto border border-gray-100"/>

                    <div className="text-2xl w-[200px]">
                      Debt Free By: <br/> {withInvestrioData.debtFreeDate}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="flex gap-4 rounded-xl border-b-2 border-[#330F6626] bg-[#FBF7FF] p-5 w-[100%]">
                      <MoneyIcon width='30' height="30" viewBox="0 0 64 64" />
                      <div>
                        <span>Save money! </span>
                        <h1 className="text-2xl font-black">{formatCurrency(withInvestrioData.saved) || '$0'}</h1>
                      </div>
                    </div>
                    <div className="flex gap-4 rounded-xl border-b-2 border-[#330F6626] bg-[#FBF7FF] p-5 w-[100%]">
                      <div className="text-left">
                        <span>Save time, pay</span>
                        <br/>
                        <span className="text-sm">
                          <span className="text-2xl font-extrabold">{withInvestrioData.monthsFaster}</span> months faster!
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-base font-light text-[#5D6B82]">
                    Investrio can help you get there with accountability.
                  </span>
                </div>
              </div>
            </div>
          </label>
        </div>
        <div className="mt-5 w-full rounded-lg">
          <label
            onClick={() => setSelected("with-without-planning")}
            className="flex h-full flex-col gap-5 rounded-2xl border-[#9248F8] bg-white p-4 transition-all"
          >
            <div className="flex items-center justify-between text-left">
              <div>
                <h2
                  className={"text-2xl font-semibold with-without-planning"}
                >
                  Without Planning
                </h2>
              </div>
            </div>
            <div className="border-b-2 border-gray-100"/>

            <div className="grid grid-cols-4 lg:grid-cols-12 gap-4">
              <div className="col-span-4 shadow-sm lg:col-span-6">
                <Card title="Balance over time" fullWidth>
                  {isWithoutPlanningLoading && (
                    <div className="flex justify-center items-center">
                      <Loading isHeightScreen={false} size="m"/>
                    </div>
                  )}

                  <CustomLineChart
                    data={withoutInvestrioGraph}
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
              </div>

              <div className="col-span-4 lg:col-span-6">
                <div className="flex flex-col gap-3 gap-y-6">
                  <div
                    className="flex flex-col md:flex-row gap-y-5 items-center justify-evenly text-purple font-semibold">
                    <div className="text-2xl w-[200px]">
                      Total Interest: <br/> {formatCurrency(
                      withoutPlanningData?.totalInterest
                    )}
                    </div>
                    <hr className="w-full md:h-16 md:w-auto border border-gray-100"/>

                    <div className="text-2xl w-[200px]">
                      Debt Free Date: <br/> {withoutPlanningData?.debtFreeDate}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-center items-center gap-3">
                    <div className="flex items-center gap-4 rounded-xl bg-[#F6F6F6] p-5 text-[#747682]">
                      <TbAlertHexagon className="text-5xl"/>
                      <span className="text-left text-sm">
                        In this plan, we <br/> assuming you are <br/> paying
                        the minimum.{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
      <div className="mb-5 border-b-2 border-gray-100 p-3"/>

      <div className="flex justify-center gap-7">
        <Link href={'/dashboard/debts'}>
          <Button
            disabled={!selected.length}
            text="Proceed"
          />
        </Link>
      </div>
    </>
  );
};
