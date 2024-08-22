import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import useBudgetQueries from "@/app/hooks/useBudgetQueries";
import useBudgetData from "@/app/hooks/useData/useBudgetData";
import useDebtData from "@/app/hooks/useData/useDebtData";
import MonthPicker from "@/app/components/budget/MonthPicker";
import IncomeBlock from "@/app/components/budget/IncomeBlock";
import Income from "@/app/components/budget/IncomeBlock/Income";
import { backgroundColor } from "@/app/utils/constants";
// import { StyledTab, StyledTabs } from "./StyledTabs";

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
import PieBreakdownBlock from "../budget/components/PieBreakdownBlock";
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
import {
  combineDebtAndBudgetData,
  DEBT_REPAYMENT_STRATEGY_NAME,
  duplicateBudgetForLaterMonth,
} from "../budget/components/BudgetTool";
import { CheckboxTable } from "@/app/components/dashboard/CheckboxTable";
import { getSummaryStatistics } from "../debts/components/helpers";

import AccountSetupProgress from "./AccountSetupProgress";
import { useRouter } from "next/navigation";
import { DEBTS_PAGE, BUDGET_PAGE } from "@/app/utils/constants";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

const LockedWidget = ({ sectionName }: { sectionName: string }) => (
  <div className="flex items-center justify-center w-[100%] min-h-[150px] flex-col gap[-12px] relative">
    <div className="absolute top-[15px] left-[15px] text-black text-lg font-semibold capitalize tracking-tight">
      {sectionName}
    </div>
    {/* <FaLock className="block hover:hidden text-[3rem] text-[#511e99]" /> */}
    {/* <FaLock className="text-[3rem] text-[#511e99]" /> */}
    <div className="text-[3rem]">🔒</div>
  </div>
);

export default function DashboardTool() {
  const [date, setDate] = useState<Date | null | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const year = date?.getFullYear();
  const month = date?.getMonth();
  const axiosAuth = useAxiosAuth();
  const { push } = useRouter();
  const {
    data: budgetInfo,
    isLoading: budgetInfoLoading,
    refetch,
    sumCategories,
    summedCategories,
    incomeAfterExpenses,
    hasBudgetData,
  } = useBudgetData(date);

  useEffect(() => {
    refetch();
  }, [date]);

  useEffect(() => {
    duplicateBudgetForLaterMonth(year, month, budgetInfo, axiosAuth, create);
  }, [budgetInfo?.data, year, month]);

  const { create, update } = useBudgetQueries(
    year,
    month,
    setIsLoading,
    budgetInfo?.data?.id
  );

  const { data: debtsData, hasDebtData } = useDebtData();

  const __extraPayment =
    budgetInfo?.data?.debts?.find(
      (debt: { name: string }) => debt.name === DEBT_REPAYMENT_STRATEGY_NAME
    )?.value || 0;

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

  const {
    paymentScheduleCalculator,
    snowballResultsWithoutExtra,
    snowballResultsWithExtra,
    avalancheResultsWithExtra,
  } = useCalculators(debtsData, __extraPayment);

  const {
    betterMethod,
    selectedMethod,
    endDate,
    totalInterestPaid,
    minPayment,
    totalInterestSaved,
    endBalance,
    neverBecomesDebtFree,
    debtFreeMonthYear,
    timeSavedString,
    monthsFaster,
  } = getSummaryStatistics(
    snowballResultsWithExtra,
    snowballResultsWithoutExtra,
    avalancheResultsWithExtra
  );

  return (
    <div
      className={`px-0 lg:px-[28px] lg:py-[26px] ${backgroundColor} pb-[12px] min-h-[min(100vh, min-h-content)] max-w-[100vw] md:max-w-[100vw]`}
    >
      <div className="lg:hidden md:hidden">
        <PageHeader
          // sectionHeader={"Lifestyle Planner"}
          // sectionSubheader={"Budget"}
          date={date}
          setDate={setDate}
        />
        <div
          className="rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px]"
          style={{
            borderRadius: "18px",
            border: "1px solid #D2DAFF",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <AccountSetupProgress />
        </div>

        <div
          className="rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px] cursor-pointer  bg-[#d2daff] shadow-xl overflow-hidden"
          style={{
            borderRadius: "18px",
            border: "1px solid #D2DAFF",
            background: "#EEF1FF",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
          onClick={() => push(BUDGET_PAGE)}
        >
          {hasBudgetData ? (
            <PieBreakdownBlock
              income={budgetInfo?.data?.income}
              border={false}
              useBasicLabel
              values={_summedCategories}
              renderPercentValues={true}
              renderShape="flex-row"
              scale={1.1}
              paddingY={"1"}
              height={190}
              title={"Lifestyle"}
            />
          ) : (
            <LockedWidget sectionName="Lifestyle Planner" />
          )}
        </div>
        <div
          className="rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px] cursor-pointer  bg-[#d2daff] shadow-xl overflow-hidden"
          style={{
            borderRadius: "18px",
            border: "1px solid #D2DAFF",
            background: "#EEF1FF",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
          onClick={() => push(DEBTS_PAGE)}
        >
          {hasDebtData ? (
            <CheckboxTable
              // infos={debts ?? []}
              // _setPercentDown={_setPercentDown}
              snowballResultsCurrentMonth={
                snowballResultsWithExtra?.payments?.[0]?.accounts ??
                snowballResultsWithoutExtra?.payments?.[0]?.accounts
              }
            />
          ) : (
            <LockedWidget sectionName="Debt Strategy" />
          )}
        </div>
      </div>
    </div>
  );
}
