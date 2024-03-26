"use client";
import { useEffect, useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import MonthPicker from "../components/budget/MonthPicker";
import IncomeBlock from "../components/budget/IncomeBlock";

import CategoryBlock from "../components/budget/CategoryBlock";
import CopyButton from "../components/budget/CopyButton";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../components/ui/Loading";
import { redirect } from "next/navigation";

const categories = ['wants', 'needs', 'savings', 'debts']

export default function BudgetTool() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const axiosAuth = useAxiosAuth();

  const year = date?.getFullYear();
  const month = date?.getMonth();

  const {
    data: budgetInfo,
    isLoading: budgetInfoLoading,
    refetch,
  } = useQuery({
    queryKey: ["budget-tool"],
    queryFn: async () => await axiosAuth.get(`/budget/${year}/${month}`),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!date,
  });

  useEffect(() => {
    refetch();
  }, [date]);

  if (budgetInfoLoading || isLoading) {
    return <Loading />;
  }

  const calculateSumCategories = () => {
     return categories.map((category) => {
      if (budgetInfo?.data[category]) {
        return budgetInfo?.data[category].reduce(
          (p: number, c: { value: number }) => p + c.value, 0
        )
      }

      return 0
     })
  }
  const sumCategories = calculateSumCategories().reduce(
    (p: number, c: number) => p + c, 0
  );

  return (
    <div className="px-[28px] py-[32px]">
      <div className="flex justify-between items-center mb-[24px]">
        <h2 className="text-[32px] font-bold">Budget overview</h2>
        <div className="w-128 flex gap-2">
          <CopyButton year={year} month={month} setLoading={setIsLoading} />
          <div className="w-[200px] flex justify-end items-center">
            <MonthPicker date={date} setDate={setDate} />
          </div>
        </div>
      </div>
      <IncomeBlock
        sumCategories={sumCategories}
        setLoading={setIsLoading}
        budgetInfo={budgetInfo?.data}
        date={{ year, month }}
      />
      <CategoryBlock
        setLoading={setIsLoading}
        budgetInfo={budgetInfo?.data}
        date={{ year, month }}
      />
    </div>
  );
}
