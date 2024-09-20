import { useEffect, useMemo, useRef, useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import useBudgetQueries from "@/app/hooks/useBudgetQueries";
import useBudgetData from "@/app/hooks/useData/useBudgetData";
import useDebtData from "@/app/hooks/useData/useDebtData";
import Income from "@/app/components/budget/IncomeBlock/Income";
import { backgroundColor } from "@/app/utils/constants";
import { StyledTab, StyledTabs } from "./StyledTabs";

import CategoryBlock from "@/app/components/budget/CategoryBlock";
import CopyButton from "@/app/components/budget/CopyButton";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/app/components/ui/Loading";
import mixpanel from "mixpanel-browser";
import Mixpanel from "@/services/mixpanel";
import PieBreakdownBlock from "./PieBreakdownBlock";
import PageHeader from "@/app/components/Layout/PageHeader";
import StepsController from "@/app/components/OnboardingIntro/StepsController";
import { useTabContext } from "@/app/context/TabContext/context";
import { FinancialRecordSchema } from "@/types/debtFormType";
// import {
//   BUDGET_STEPS,
//   BREAKDOWN_STEP,
//   INCOME_STEP,
//   BUDGET_STEP,
// } from "@/app/components/Layout/MobileNavigator";

const categories = ["wants", "needs", "savings", "debts"];

type BudgetMobileSteps =
  | "income"
  | "suggestedBreakdown"
  | "budget"
  | "PLANNER_STEP"
  | "EDIT_STEP";

export const INCOME_STEP = "income";
export const BREAKDOWN_STEP = "suggestedBreakdown";
export const BUDGET_STEP = "budget";
export const PLANNER_STEP = "PLANNER_STEP";
export const EDIT_STEP = "EDIT_STEP";

const BUDGET_MOBILE_STEPS: BudgetMobileSteps[] = [
  INCOME_STEP,
  BREAKDOWN_STEP,
  BUDGET_STEP,
];
const BUDGET_STEPS = BUDGET_MOBILE_STEPS;

export const DEBT_REPAYMENT_STRATEGY_NAME = "Debt Strategy";

export interface BudgetItem {
  id?: string;
  name: string;
  value: number;
  recurringExpense?: string;
  type?: string;
  debtType?: string;
  balance?: string;
  rate?: string;
}

const checkIfDebtExistsInBudget = (
  debt: FinancialRecordSchema,
  existingDebts: BudgetItem[]
) => {
  const foundDebt = existingDebts.find(
    (existingDebt) => existingDebt.name === debt.title
  );
  return foundDebt && foundDebt.value === debt.minPayAmount;
};

const addDebtsToBudget = async (
  debts: FinancialRecordSchema[],
  update: Function,
  existingDebts: BudgetItem[],
  invalidateQueryAfterUpdate: Function
) => {
  if (debts?.map === undefined || existingDebts?.map === undefined) return;

  // add Debt Strategy Repayments automatically to front of debts list...
  // add minimum repayment for each debt from debts...

  // existing budget debts format:
  // {
  //     "name": "Student Loans",
  //     "value": 25000,
  //     "recurringExpense": "false"
  // }

  // existing debt format:
  // {
  //   "id": "clz6ej2ip0001d7ccrfjk7x7o",
  //   "title": "Chase",
  //   "type": "CreditCard",
  //   "periodicity": "MONTH",
  //   "initialBalance": 10000,
  //   "interestRate": 10,
  //   "minPayAmount": 300,
  //   "payDueDate": "2024-07-29T14:23:35.462Z",
  //   "extraPayAmount": 0,
  //   "createdAt": "2024-07-29T03:00:29.183Z",
  //   "updatedAt": "2024-07-29T14:23:35.464Z",
  //   "userId": "clyz41gf00000342wav7f86n9"
  // }

  const allDebtsExistInBudget = debts
    .map((debt) => checkIfDebtExistsInBudget(debt, existingDebts))
    .every((bool) => bool);
  if (!allDebtsExistInBudget) {
    const reshapedDebts = debts.map((debt) => ({
      name: debt.title,
      value: debt.minPayAmount,
      recurringExpense: "true",
      type: debt.type,
      initialBalance: debt.initialBalance,
      interestRate: debt.interestRate,
    }));
    const debtNames = debts.map((debt) => debt.title);
    const oldDebts = existingDebts.filter(
      (debt) => !debtNames.includes(debt.name)
    );
    const updatedDebts = { debts: [...reshapedDebts, ...oldDebts] };
    // input to update:
    // const newCategory = [...items, data];
    // const dataToUpdate = { [name]: newCategory }
    // update(updatedDebts).then(() => invalidateQueryAfterUpdate());
    update(updatedDebts);
  }
};

const reshapeDebtsForBudget = (debts: FinancialRecordSchema[], budgetDebts) => {
  let reshapedDebts =
    debts?.map((debt) => ({
      name: debt.title,
      value: debt.minPayAmount,
      recurringExpense: "true",
      type: debt.type,
      initialBalance: debt.initialBalance,
      interestRate: debt.interestRate,
      id: debt.id,
    })) ?? [];

  const repaymentStep = budgetDebts?.find(
    (debt: { name: string }) => debt.name === DEBT_REPAYMENT_STRATEGY_NAME
  );
  if (repaymentStep) {
    reshapedDebts = [repaymentStep, ...reshapedDebts];
  } else {
    reshapedDebts = [
      {
        name: DEBT_REPAYMENT_STRATEGY_NAME,
        value: 0,
        recurringExpense: "true",
      },
      ...reshapedDebts,
    ];
  }
  // if (budgetDebts === undefined || budgetDebts?.length === 0) {
  // reshapedDebts = [{ name: "Repayment Strategy", value: 0, recurringExpense: "true"} ,...reshapedDebts]
  // }

  return reshapedDebts;
};

export const combineDebtAndBudgetData = (
  debtsData: FinancialRecordSchema[],
  budgetData,
  sumCategories,
  summedCategories,
  incomeAfterExpenses
) => {
  const reshapedDebts = reshapeDebtsForBudget(debtsData, budgetData?.debts);
  const reshapedBudgetData = { ...budgetData, debts: reshapedDebts };
  const monthlyMinimumDebtRepayments: number = reshapedDebts?.reduce(
    (acc, next) => {
      return acc + (next.value || 0);
    },
    0
  );
  const outstandingBalance: number = reshapedDebts?.reduce((acc, next) => {
    return acc + (next.initialBalance || 0);
  }, 0);

  const totalAssets = budgetData?.assets?.length
    ? budgetData?.assets?.reduce((acc, next) => acc + (next.value || 0), 0)
    : 0;

  const _sumCategories = monthlyMinimumDebtRepayments + sumCategories;
  const _summedCategories = [
    ...summedCategories,
    { name: "Debts", value: monthlyMinimumDebtRepayments },
  ];

  const availableAfterIncome = _summedCategories.reduce((acc, next) => {
    return acc - next.value;
  }, Number(budgetData?.income || 0));

  const _incomeAfterExpenses =
    incomeAfterExpenses - monthlyMinimumDebtRepayments;

  if (availableAfterIncome > 0) {
    _summedCategories.push({ name: "Remaining", value: availableAfterIncome });
  }

  return {
    reshapedDebts,
    reshapedBudgetData,
    monthlyMinimumDebtRepayments,
    _sumCategories,
    _summedCategories,
    availableAfterIncome,
    _incomeAfterExpenses,
    totalDebt: outstandingBalance,
    totalAssets,
  };
};

export async function duplicateBudgetForLaterMonth(
  year,
  month,
  budgetInfo,
  axiosAuth,
  create
) {
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
        month === latestBudgetInfo?.data?.month) ||
      year < latestBudgetInfo?.data?.year ||
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
}

export default function BudgetTool() {
  const [date, setDate] = useState<Date | null | undefined>(new Date());
  const [step, setStep] = useState<BudgetMobileSteps>(PLANNER_STEP);
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoadCompleted, setFirstLoadCompleted] = useState(false);
  const axiosAuth = useAxiosAuth();
  const mixpanelCalled = useRef<boolean>(false);
  const queryClient = useQueryClient();
  const [latestIncome, setLatestIncome] = useState(0);

  const { setTabs, setSubTab, subTab, tab, state } = useTabContext();

  const year = date?.getFullYear();
  const month = date?.getMonth();

  // const { paymentScheduleCalculator } = useCalculators();
  // const snowballResultsWithExtra = paymentScheduleCalculator(
  //   [],
  //   "snowball",
  //   1000
  // );

  const {
    data: budgetInfo,
    isLoading: budgetInfoLoading,
    isFetched,
    refetch,
    sumCategories,
    summedCategories,
    incomeAfterExpenses,
    hasBudgetData,
  } = useBudgetData(date);

  const { data: debtsData } = useDebtData();

  // } = useQuery({
  //   queryKey: ["budget-tool", year, month],
  //   queryFn: async () => {
  //     return await axiosAuth.get(`/budget/${year}/${month}`);
  //   },
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: true,
  //   enabled: !!date,
  // });

  const invalidateBudgetQuery = () =>
    queryClient.invalidateQueries({ queryKey: ["budget-tool", year, month] });

  const { create, update } = useBudgetQueries(
    year,
    month,
    setIsLoading,
    budgetInfo?.data?.id
  );

  useEffect(() => {
    refetch();
  }, [date]);

  useEffect(() => {
    duplicateBudgetForLaterMonth(year, month, budgetInfo, axiosAuth, create);
  }, [budgetInfo?.data, year, month]);

  useEffect(() => {
    // if (!firstLoadCompleted && hasBudgetData) {
    //   setFirstLoadCompleted(true);
    //   setLatestIncome(budgetInfo?.data?.income);
    // }
    if (budgetInfo?.data?.income) {
      setLatestIncome(budgetInfo?.data?.income);
    }
  }, [budgetInfo?.data]);

  useEffect(() => {
    if (
      isFetched &&
      (!hasBudgetData || budgetInfo?.data?.income === undefined)
    ) {
      setSubTab(INCOME_STEP);
      setStep(INCOME_STEP);
    } else if (isFetched && !firstLoadCompleted && hasBudgetData) {
      setSubTab(BUDGET_STEP);
      setStep(BUDGET_STEP);
      setFirstLoadCompleted(true);
    }
  }, [isFetched, hasBudgetData, budgetInfo?.data]);

  // useEffect(() => {
  //   setSubTab(BUDGET_STEP);
  // }, []);

  useEffect(() => {
    if (mixpanelCalled.current) return;
    Mixpanel.getInstance().track("view_budget");
    mixpanelCalled.current = true;
  }, []);

  if (budgetInfoLoading) {
    return <Loading />;
  }

  const setPrev = () => {
    const currentIndex = BUDGET_STEPS.findIndex((el) => el === step);
    if (currentIndex === 0) {
      return;
    }
    const nextStep = BUDGET_MOBILE_STEPS[currentIndex - 1] as BudgetMobileSteps;
    setSubTab(nextStep);
    setStep(nextStep);
  };

  // combineDebtAndBudgetData = (debtsData, budgetData, sumCategories, summedCategories, incomeAfterExpenses)
  const {
    reshapedDebts,
    reshapedBudgetData,
    monthlyMinimumDebtRepayments,
    _sumCategories,
    _summedCategories,
    availableAfterIncome,
    _incomeAfterExpenses,
  } = combineDebtAndBudgetData(
    debtsData?.data,
    budgetInfo?.data,
    sumCategories,
    summedCategories,
    incomeAfterExpenses
  );

  return (
    <div
      className={`px-0 lg:px-[28px] lg:py-[26px] ${backgroundColor} pb-[12px] min-h-[min(100vh, min-h-content)] max-w-[100vw] md:max-w-[100vw]`}
    >
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
        {step === BUDGET_STEP || step === "EDIT_STEP" ? (
          <StyledTabs
            value={step === BUDGET_STEP ? 0 : 1}
            onChange={(e, v) => {
              if (v === 0) {
                setSubTab(BUDGET_STEP);
                setStep(BUDGET_STEP);
              }
              if (v === 1) {
                setSubTab("EDIT_STEP");
                setStep("EDIT_STEP");
              }
            }}
          >
            <StyledTab label="Planner" />
            <StyledTab label="Edit" />
          </StyledTabs>
        ) : null}
        {step === INCOME_STEP ? (
          <Income
            sumCategories={_sumCategories}
            setLoading={setIsLoading}
            isLoading={isLoading}
            budgetInfo={budgetInfo?.data}
            date={{ year, month }}
            incomeAfterExpenses={_incomeAfterExpenses}
            titleText="Let’s Build Your Plan!"
            setLatestIncome={setLatestIncome}
          />
        ) : null}

        {step === "EDIT_STEP" ? (
          <Income
            sumCategories={_sumCategories}
            setLoading={setIsLoading}
            isLoading={isLoading}
            budgetInfo={budgetInfo?.data}
            date={{ year, month }}
            incomeAfterExpenses={_incomeAfterExpenses}
            inputText="As your income changes, update your budget. It’s easy, we’ll help you!"
            renderAfterInput={
              <PieBreakdownBlock
                income={budgetInfo?.data?.income}
                border={false}
                useBasicLabel
                values={_summedCategories}
              />
            }
          />
        ) : null}

        {step === BREAKDOWN_STEP ? (
          <PieBreakdownBlock
            income={budgetInfo?.data?.income}
            goBack={setPrev}
            useBasicLabel
            // values={reshapedBudgetData}
            // values={_summedCategories}
          />
        ) : null}

        {step === BUDGET_STEP ? (
          <CategoryBlock
            setLoading={setIsLoading}
            budgetInfo={reshapedBudgetData}
            date={{ year, month }}
            renderAfterInput={
              <PieBreakdownBlock
                income={budgetInfo?.data?.income}
                border={false}
                useBasicLabel
                values={_summedCategories}
                renderPercentValues={true}
                renderShape="flex-row"
                height={190}
              />
            }
          />
        ) : null}

        {step !== BUDGET_STEP ? (
          <div className="relative top-[0px] w-[100vw] flex items-center justify-center">
            <StepsController
              classes="mt-[4px]"
              useButton={true}
              renderDirection="vertical"
              content={
                step === BREAKDOWN_STEP ? (
                  <div className="flex flex-col items-center justify-center text-center px-[16px] mt-[16px]">
                    <span className="text-orange-500 text-lg font-medium leading-[25.20px]">
                      This is where the magic happens!
                    </span>
                    <span className="text-[#858699] text-base font-normal leading-snug">
                      To move faster towards your next financial goals,
                      Investrio suggests the 50/30/20 budget
                    </span>
                  </div>
                ) : undefined
              }
              setNext={() => {
                const currentIndex = BUDGET_STEPS.findIndex(
                  (el) => el === step
                );
                if (currentIndex >= BUDGET_STEPS.length - 1) {
                  return;
                }
                const nextStep = BUDGET_STEPS[
                  currentIndex + 1
                ] as BudgetMobileSteps;
                setSubTab(nextStep);
                setStep(nextStep);
              }}
              setPrev={() => setPrev()}
              // setSkip={() => setShowSteps(false)}
              currentStep={BUDGET_MOBILE_STEPS.findIndex((el) => el === step)}
              numSteps={BUDGET_MOBILE_STEPS.length}
            />
          </div>
        ) : null}
      </div>

      <div className="hidden md:block lg:block">
        <PageHeader
          sectionHeader={"Lifestyle Planner"}
          sectionSubheader={"Budget"}
          date={date}
          setDate={setDate}
        />

        <div className="flex justify-center content-center">
          <Income
            sumCategories={_sumCategories}
            setLoading={setIsLoading}
            isLoading={isLoading}
            budgetInfo={budgetInfo?.data}
            date={{ year, month }}
            incomeAfterExpenses={_incomeAfterExpenses}
          />

          <PieBreakdownBlock
            income={budgetInfo?.data?.income}
            useBasicLabel
            values={_summedCategories}
            renderPercentValues={true}
            height={320}
            renderShape="flex-row"
            scale={1.25}
          />
        </div>

        <CategoryBlock
          setLoading={setIsLoading}
          budgetInfo={reshapedBudgetData}
          date={{ year, month }}
        />
      </div>

      {/* <div className="mt-[28px] text-[#6C7278] text-center text-base">
        © 2024 Investrio. All rights reserved
      </div> */}
    </div>
  );
}
