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
import { combineDebtAndBudgetData } from "../budget/components/BudgetTool";
import { CheckboxTable } from "@/app/components/dashboard/CheckboxTable";
import { getSummaryStatistics } from "../debts/components/helpers";

import AccountSetupProgress from "./AccountSetupProgress";

export default function DashboardTool() {
  const [date, setDate] = useState<Date | null | undefined>(new Date());
  const year = date?.getFullYear();
  const month = date?.getMonth();
  const {
    data: budgetInfo,
    isLoading: budgetInfoLoading,
    refetch,
    sumCategories,
    summedCategories,
    incomeAfterExpenses,
  } = useBudgetData(date);

  const { data: debtsData } = useDebtData();

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
  } = useCalculators(debtsData, 600);

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
        <div className="rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px]">
          <AccountSetupProgress />
        </div>

        <div className="rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px]">
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
        </div>

        <div className="rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px]">
          <CheckboxTable
            // infos={debts ?? []}
            // _setPercentDown={_setPercentDown}
            snowballResultsCurrentMonth={
              snowballResultsWithExtra?.payments?.[0]?.accounts ??
              snowballResultsWithoutExtra?.payments?.[0]?.accounts
            }
          />
        </div>
      </div>
    </div>
  );
}
