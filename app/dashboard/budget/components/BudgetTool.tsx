import { memo, useEffect, useMemo, useRef, useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import useBudgetQueries from "@/app/hooks/useBudgetQueries";
import MonthPicker from "@/app/components/budget/MonthPicker";
import IncomeBlock from "@/app/components/budget/IncomeBlock";
import Income from "@/app/components/budget/IncomeBlock/Income";

import CategoryBlock from "@/app/components/budget/CategoryBlock";
import CopyButton from "@/app/components/budget/CopyButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loading } from "@/app/components/ui/Loading";
import mixpanel from "mixpanel-browser";
import Mixpanel from "@/services/mixpanel";
import CustomPieChart, {
  ScaledPieChart,
} from "@/app/components/ui/charts/CustomPieChart";
import PieBreakdownBlock from "./PieBreakdownBlock";
import PageHeader from "@/app/components/Layout/PageHeader";
import StepsController from "@/app/components/OnboardingIntro/StepsController";

const categories = ["wants", "needs", "savings", "debts"];

let loaded = false;

type BudgetMobileSteps = "income" | "suggestedBreakdown" | "budget";
const INCOME_STEP = "income";
const BREAKDOWN_STEP = "suggestedBreakdown";
const BUDGET_STEP = "budget";
const BUDGET_MOBILE_STEPS: BudgetMobileSteps[] = [
  INCOME_STEP,
  BREAKDOWN_STEP,
  BUDGET_STEP,
];

export interface BudgetItem {
  name: string;
  value: number;
  recurringExpense?: string;
}

export default function BudgetTool() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [step, setStep] = useState<BudgetMobileSteps>(INCOME_STEP);
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoadCompleted, setFirstLoadCompleted] = useState(false);
  const axiosAuth = useAxiosAuth();
  const mixpanelCalled = useRef<boolean>(false);

  const year = date?.getFullYear();
  const month = date?.getMonth();

  const {
    data: budgetInfo,
    isLoading: budgetInfoLoading,
    refetch,
  } = useQuery({
    queryKey: ["budget-tool", year, month],
    queryFn: async () => {
      return await axiosAuth.get(`/budget/${year}/${month}`);
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!date,
  });

  const { create } = useBudgetQueries(
    year,
    month,
    setIsLoading,
    budgetInfo?.data?.id
  );

  // const {
  //   data: latestBudgetInfo,
  //   isLoading: latestBudgetInfoLoading,
  //   refetch: refetchLatest,
  // } = useQuery({
  //   queryKey: ["budget-tool-latest"], // , year, month
  //   queryFn: async () => {
  //     const allData = await axiosAuth.get(`/budget/get-latest`);
  //     return allData;
  //   },
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: true,
  //   enabled: !!date,
  // });

  useEffect(() => {
    refetch();
  }, [date]);

  useEffect(() => {
    if (
      year === undefined ||
      month === undefined ||
      budgetInfo?.data === undefined
    ) {
      return;
    }

    if (
      budgetInfo?.data !== undefined &&
      Object.keys(budgetInfo?.data)?.length > 0
    ) {
      return;
    }

    axiosAuth.get(`/budget/get-latest`).then((latestBudgetInfo) => {
      if (
        latestBudgetInfo?.data === undefined ||
        Object.keys(latestBudgetInfo?.data)?.length === 0 ||
        (year === latestBudgetInfo?.data?.year &&
          month === latestBudgetInfo?.data?.month)
      ) {
        return;
      }

      const { data } = latestBudgetInfo;
      const wants = data?.["wants"].filter(
        (item: BudgetItem) => item?.recurringExpense === "true"
      );
      const needs = data?.["needs"].filter(
        (item: BudgetItem) => item?.recurringExpense === "true"
      );
      const savings = data?.["savings"].filter(
        (item: BudgetItem) => item?.recurringExpense === "true"
      );
      const debts = data?.["debts"].filter(
        (item: BudgetItem) => item?.recurringExpense === "true"
      );
      const newBudget = { ...data, wants, needs, savings, debts };
      create(newBudget);
    });
  }, [budgetInfo?.data, year, month]);

  useEffect(() => {
    if (
      !firstLoadCompleted &&
      budgetInfo?.data !== undefined &&
      Object.keys(budgetInfo?.data)?.length > 0
    ) {
      setStep(BUDGET_STEP);
      setFirstLoadCompleted(true);
    }
  }, [budgetInfo?.data]);

  useEffect(() => {
    if (mixpanelCalled.current) return;
    Mixpanel.getInstance().track("view_budget");

    mixpanelCalled.current = true;
  }, []);

  const calculateSumCategories = () => {
    return categories.map((category) => {
      if (budgetInfo?.data[category]) {
        return budgetInfo?.data[category].reduce(
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
      budgetInfo?.data["wants"],
      budgetInfo?.data["needs"],
      budgetInfo?.data["savings"],
      budgetInfo?.data["debts"],
    ]
  );

  // if (budgetInfoLoading || isLoading) {
  if (budgetInfo === undefined) {
    return <Loading />;
  }

  return (
    <div className="lg:px-[28px] lg:py-[26px] bg-violet-50 pb-[12px] min-h-content min-h-[min(100vh, min-h-content)] max-w-[97vw] md:max-w-[100vw]">
      {/* <div className="flex flex-col lg:flex-row justify-between items-center mb-[24px]">
        <h2 className="text-[32px] font-bold">Budget overview</h2>
        <div className="w-128 flex gap-2">
          <CopyButton year={year} month={month} setLoading={setIsLoading} />vw
          <div className="w-[200px] flex justify-end items-center">
            <MonthPicker date={date} setDate={setDate} />
          </div>
        </div>
      </div> */}
      <div className="lg:hidden md:hidden">
        <PageHeader
          sectionHeader={"Lifestyle Planner"}
          sectionSubheader={"Budget"}
          date={date}
          setDate={setDate}
        />
        {step === INCOME_STEP ? (
          <Income
            sumCategories={sumCategories}
            setLoading={setIsLoading}
            isLoading={isLoading}
            budgetInfo={budgetInfo?.data}
            date={{ year, month }}
          />
        ) : null}

        {step === BREAKDOWN_STEP ? (
          <PieBreakdownBlock income={budgetInfo?.data?.income} />
        ) : null}

        {step === BUDGET_STEP ? (
          <CategoryBlock
            setLoading={setIsLoading}
            budgetInfo={budgetInfo?.data}
            date={{ year, month }}
          />
        ) : null}

        <div className="ml-[10px] relative top-[0px] w-[100%] flex items-center justify-center">
          <StepsController
            useButton={true}
            setNext={() =>
              setStep((prevState) => {
                const currentIndex = BUDGET_MOBILE_STEPS.findIndex(
                  (el) => el === prevState
                );
                if (currentIndex >= BUDGET_MOBILE_STEPS.length - 1)
                  return prevState;
                return BUDGET_MOBILE_STEPS[
                  currentIndex + 1
                ] as BudgetMobileSteps;
              })
            }
            setPrev={() =>
              setStep((prevState) => {
                const currentIndex = BUDGET_MOBILE_STEPS.findIndex(
                  (el) => el === prevState
                );
                if (currentIndex === 0) return prevState;
                return BUDGET_MOBILE_STEPS[
                  currentIndex - 1
                ] as BudgetMobileSteps;
              })
            }
            // setSkip={() => setShowSteps(false)}
            currentStep={BUDGET_MOBILE_STEPS.findIndex((el) => el === step)}
            numSteps={BUDGET_MOBILE_STEPS.length}
          />
        </div>
      </div>

      <div className="hidden md:block lg:block">
        <PageHeader
          sectionHeader={"Lifestyle Planner"}
          sectionSubheader={"Budget"}
          date={date}
          setDate={setDate}
        />

        <div className="flex">
          <Income
            sumCategories={sumCategories}
            setLoading={setIsLoading}
            isLoading={isLoading}
            budgetInfo={budgetInfo?.data}
            date={{ year, month }}
          />

          <PieBreakdownBlock income={budgetInfo?.data?.income} />
        </div>

        <CategoryBlock
          setLoading={setIsLoading}
          budgetInfo={budgetInfo?.data}
          date={{ year, month }}
        />
      </div>

      <div className="mt-[28px] text-[#6C7278] text-center text-base">
        © 2024 Investrio. All rights reserved
      </div>
    </div>
  );
}
