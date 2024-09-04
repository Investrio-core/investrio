import { memo, useEffect, useMemo, useRef, useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import useBudgetQueries from "@/app/hooks/useBudgetQueries";
import useBudgetData from "@/app/hooks/useData/useBudgetData";
import useDebtData from "@/app/hooks/useData/useDebtData";
import MonthPicker from "@/app/components/budget/MonthPicker";
import IncomeBlock from "@/app/components/budget/IncomeBlock";
import Income from "@/app/components/budget/IncomeBlock/Income";
import { backgroundColor } from "@/app/utils/constants";
import { StyledTab, StyledTabs } from "./StyledTabs";

import CategoryBlock from "@/app/components/budget/CategoryBlock";
import CopyButton from "@/app/components/budget/CopyButton";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loading } from "@/app/components/ui/Loading";
import mixpanel from "mixpanel-browser";
import Mixpanel from "@/services/mixpanel";
import CustomPieChart, {
  ScaledPieChart,
} from "@/app/components/ui/charts/CustomPieChart";
import PieBreakdownBlock from "./PieBreakdownBlock";
import PageHeader from "@/app/components/Layout/PageHeader";
import StepsController from "@/app/components/OnboardingIntro/StepsController";
import { useTabContext } from "@/app/context/TabContext/context";
import useCalculators from "@/app/hooks/useCalculators";
import { FinancialRecordSchema } from "@/types/debtFormType";
import {
  BUDGET_STEPS,
  BREAKDOWN_STEP,
  INCOME_STEP,
  BUDGET_STEP,
} from "@/app/components/Layout/MobileNavigator";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
const categories = ["wants", "needs", "savings", "debts"];

let loaded = false;

type BudgetMobileSteps = "income" | "suggestedBreakdown" | "budget";

const BUDGET_MOBILE_STEPS: BudgetMobileSteps[] = [
  INCOME_STEP,
  BREAKDOWN_STEP,
  BUDGET_STEP,
];

export const DEBT_REPAYMENT_STRATEGY_NAME = "Repayment Strategy";
const EDIT_STEP = "EDIT_STEP";

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
  // const [step, setStep] = useState<BudgetMobileSteps>(INCOME_STEP);
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoadCompleted, setFirstLoadCompleted] = useState(false);
  const axiosAuth = useAxiosAuth();
  const mixpanelCalled = useRef<boolean>(false);
  const queryClient = useQueryClient();
  const [latestIncome, setLatestIncome] = useState(0);

  const { setTabs, setSubTab, subTab: step, tab, state } = useTabContext();

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
    refetch,
    sumCategories,
    summedCategories,
    incomeAfterExpenses,
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

  // useEffect(() => {
  //   addDebtsToBudget(
  //     debtsData?.data,
  //     update,
  //     budgetInfo?.data?.["debts"],
  //     invalidateBudgetQuery
  //   );
  // }, [debtsData, budgetInfo?.data?.["debts"]]);

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
    duplicateBudgetForLaterMonth(year, month, budgetInfo, axiosAuth, create);
  }, [budgetInfo?.data, year, month]);

  useEffect(() => {
    if (
      !firstLoadCompleted &&
      budgetInfo?.data !== undefined &&
      Object.keys(budgetInfo?.data)?.length > 0
    ) {
      // setStep(BUDGET_STEP);
      setSubTab(BUDGET_STEP);
      setFirstLoadCompleted(true);
      setLatestIncome(budgetInfo?.data?.income);
    }
  }, [budgetInfo?.data]);

  useEffect(() => {
    if (mixpanelCalled.current) return;
    Mixpanel.getInstance().track("view_budget");

    mixpanelCalled.current = true;
  }, []);

  // const calculateSumCategories = () => {
  //   return categories.map((category) => {
  //     if (budgetInfo?.data[category]) {
  //       return budgetInfo?.data[category].reduce(
  //         (p: number, c: { value: number }) => p + c.value,
  //         0
  //       );
  //     }

  //     return 0;
  //   });
  // };

  // const sumCategories = useMemo(
  //   () => calculateSumCategories().reduce((p: number, c: number) => p + c, 0),
  //   [
  //     budgetInfo?.data["wants"],
  //     budgetInfo?.data["needs"],
  //     budgetInfo?.data["savings"],
  //     budgetInfo?.data["debts"],
  //   ]
  // );

  // if (budgetInfoLoading || isLoading) {
  if (budgetInfo?.data === undefined) {
    return <Loading />;
  }

  const setPrev = () => {
    const currentIndex = BUDGET_STEPS.findIndex((el) => el === step);
    if (currentIndex === 0) {
      return;
    }
    const nextStep = BUDGET_MOBILE_STEPS[currentIndex - 1] as BudgetMobileSteps;
    setSubTab(nextStep);
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
              }
              if (v === 1) {
                setSubTab("EDIT_STEP");
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
              setNext={
                () => {
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
                }
                // setStep((prevState) => {
                //   const currentIndex = BUDGET_MOBILE_STEPS.findIndex(
                //     (el) => el === prevState
                //   );
                //   if (currentIndex >= BUDGET_MOBILE_STEPS.length - 1)
                //     return prevState;
                //   return BUDGET_MOBILE_STEPS[
                //     currentIndex + 1
                //   ] as BudgetMobileSteps;
                // })
              }
              setPrev={
                () => setPrev()
                // setStep((prevState) => {
                //   const currentIndex = BUDGET_MOBILE_STEPS.findIndex(
                //     (el) => el === prevState
                //   );
                //   if (currentIndex === 0) return prevState;
                //   return BUDGET_MOBILE_STEPS[
                //     currentIndex - 1
                //   ] as BudgetMobileSteps;
                // })
              }
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
