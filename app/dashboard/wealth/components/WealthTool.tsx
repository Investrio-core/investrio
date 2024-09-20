import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import useDebtQueries from "@/app/hooks/useDebtQueries";
import {
  backgroundColor,
  PLANNER_STEP,
  EDIT_STEP,
} from "@/app/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/app/components/ui/Loading";
import mixpanel from "mixpanel-browser";
import Mixpanel from "@/services/mixpanel";
import PageHeader from "@/app/components/Layout/PageHeader";

import { ButtonWithIcon } from "@/app/components/ui/buttons";
import { AiOutlinePlusCircle } from "react-icons/ai";

// import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
// import { useQuery } from "@tanstack/react-query";

// import { Loading } from "@/app/components/ui/Loading";

import { DebtFormType, FinancialRecordSchema } from "@/types/debtFormType";
import { FinancialRecord } from "@/types/financial";
import { PaymentConfiguration } from "@/app/components/strategy/payment-configuration";
import { useTabContext } from "@/app/context/TabContext/context";
import useCalculators from "@/app/hooks/useCalculators";
import MultiInputBlock from "@/app/components/ui/MultiInputBlock";
import { formatCurrency, toFixed } from "@/app/utils/formatters";
import dayjs from "dayjs";
import debounce from "@mui/material/utils/debounce";
import ExtraPayment from "@/public/icons/extra-payment.svg";
import { Results } from "@/app/hooks/calculatorsSnowball";
import useBudgetData from "@/app/hooks/useData/useBudgetData";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { StyledTab, StyledTabs } from "../../budget/components/StyledTabs";
import {
  combineDebtAndBudgetData,
  DEBT_REPAYMENT_STRATEGY_NAME,
} from "../../budget/components/BudgetTool";
import useBudgetQueries from "@/app/hooks/useBudgetQueries";
import { toast } from "react-toastify";
import BudgetProgress from "../../budget/components/BudgetProgress";

import StepsController from "@/app/components/OnboardingIntro/StepsController";
import useDebtData from "@/app/hooks/useData/useDebtData";
import BaseWrapper from "./BaseWrapper";
import WealthGraph from "./WealthGraph";
import DefaultInputs from "./DefaultInputs";
import { Debt } from "@/app/api/user/interface";
import CategoryBlock from "@/app/components/budget/CategoryBlock";
import CategoryBlockCollapsible from "@/app/components/budget/CategoryBlockCollapsible";
import PlaidOrManualSelector from "@/app/components/PlaidOrManualSelector";
import { getMonthStringFromDate } from "../../debts/components/helpers";
import { setHeapSnapshotNearHeapLimit } from "v8";

type WealthMobileSteps = "income" | "suggestedBreakdown" | "budget";

type DebtCategories =
  | "CreditCard"
  | "AutoLoan"
  | "PersonalLoan"
  | "StudentLoan"
  | "Mortgage"
  | "MedicalLoan"
  | "Taxes"
  | "Other";

const DEBT_CATEGORIES = [
  "CreditCard",
  "AutoLoan",
  "PersonalLoan",
  "StudentLoan",
  "Mortgage",
  "MedicalLoan",
  "Taxes",
  "Other",
];

const DEBT_CATEGORY_MAPPER = {
  CreditCard: "Credit Card Debt",
  AutoLoan: "Car Loans",
  PersonalLoan: "Personal Loans",
  StudentLoan: "Student Loans",
  Mortgage: "Mortgage Liabiity",
  MedicalLoan: "Medical Loans",
  Taxes: "Tax Debts",
  Other: "Other Debts",
};

type CollectionMapMember = keyof typeof DEBT_CATEGORY_MAPPER;
type CollectionMap = typeof DEBT_CATEGORY_MAPPER;

const accumulateDebtCategories = (debts: Debt[]) => {
  if (debts === undefined) return {};
  const acc = {} as CollectionMap;
  const total = debts.reduce((acc, next) => acc + next.initialBalance, 0);

  for (let next of debts) {
    const type = next.type as CollectionMapMember;
    if (acc?.[type] !== undefined) {
      acc[type]["total"] += next.initialBalance;
      acc[type]["items"].push(next);
      acc[type]["percent"] = toFixed(acc[type]["total"] / total) * 100;
      // acc[type]["categoryName"] = DEBT_CATEGORY_MAPPER[type];
    } else {
      acc[type] = {
        total: next.initialBalance,
        items: [next],
        categoryName: DEBT_CATEGORY_MAPPER[type],
        percent: toFixed(next.initialBalance / total) * 100,
      };
    }
  }

  return acc;

  // return (
  //   debts?.reduce((acc: CollectionMap, next: Debt) => {
  //     const type = next.type as CollectionMapMember;
  //     if (acc[type]) {
  //       acc[type]["total"] += next.initialBalance;
  //       acc[type]["debts"].push(next);
  //     } else {
  //       acc[type] = { total: next.initialBalance, debts: [next] };
  //     }
  //   }, {}) ?? {}
  // );
};

const WEALTH_STEPS = ["DEFAULT_INPUTS"];

const setNext = (setSubTab: Function, steps: string[], currentStep: string) => {
  const currentIndex = steps.findIndex((el) => el === currentStep);
  if (currentIndex >= steps.length - 1) {
    return;
  }
  const nextStep = steps[currentIndex + 1];
  setSubTab(nextStep);
};

const setPrev = (setSubTab: Function, steps: string[], currentStep: string) => {
  const currentIndex = steps.findIndex((el) => el === currentStep);
  if (currentIndex === 0) {
    return;
  }
  const nextStep = steps[currentIndex - 1];
  setSubTab(nextStep);
};

export default function WealthTool() {
  const [showPlaidOrManual, setShowPlaidOrManual] = useState(true);
  const [date, setDate] = useState<Date | null | undefined>(new Date());
  const [step, setStep] = useState(PLANNER_STEP);
  const [isLoading, setIsLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [liabilities, setLiabilities] = useState({});
  const { data: debtsData, hasDebtData } = useDebtData();
  const {
    data: budgetInfo,
    isLoading: budgetInfoLoading,
    refetch,
    sumCategories,
    summedCategories,
    incomeAfterExpenses,
  } = useBudgetData(date);
  const { setTabs, setSubTab, subTab, tab, state } = useTabContext();

  // get next two months??
  const year = date?.getFullYear();
  const month = date?.getMonth();

  useEffect(() => {
    if (debtsData?.data) {
      const accumulatedDebtsObject = accumulateDebtCategories(debtsData.data);
      setLiabilities(accumulatedDebtsObject);
    }
  }, [debtsData?.data]);

  const {
    // reshapedDebts,
    reshapedBudgetData,
    monthlyMinimumDebtRepayments,
    _sumCategories,
    _summedCategories,
    availableAfterIncome,
    _incomeAfterExpenses,
    totalDebt,
    totalAssets,
  } = combineDebtAndBudgetData(
    debtsData?.data,
    budgetInfo?.data,
    sumCategories,
    summedCategories,
    incomeAfterExpenses
  );

  let reshapedDebts =
    debtsData?.data?.map((debt) => ({
      name: debt.title,
      value: debt.minPayAmount,
      recurringExpense: "true",
      type: debt.type,
      initialBalance: debt.initialBalance,
      interestRate: debt.interestRate,
      id: debt.id,
    })) ?? [];

  const accumulatedDebtsObject = accumulateDebtCategories(reshapedDebts);
  const collapsableItems = { debts: accumulatedDebtsObject };

  const totalSavings = _summedCategories?.[2]?.value || 0;
  const total = totalDebt + totalAssets;
  // const debtProportion = Number((totalDebt / total).toFixed(2)) * 100;
  // const assetsProportion = Number((totalAssets / total).toFixed(2)) * 100;
  const debtProportion = (toFixed(totalDebt / total) * 100).toFixed(0);
  const assetsProportion = (toFixed(totalAssets / total) * 100).toFixed(0);
  // const savingsProportion = Number((totalSavings / total).toFixed(2)) * 100;

  // console.log("debt proportion");
  // console.log(debtProportion);
  // console.log("savings proportion");
  // console.log(savingsProportion);

  const currentNetWorthNormal = totalAssets - totalDebt;

  const currentNetWorth =
    totalAssets - totalDebt > 0
      ? totalAssets - totalDebt
      : (totalAssets - totalDebt) * -1;

  const data = [
    {
      name: getMonthStringFromDate(date),
      Debts: totalDebt,
      Assets: totalAssets,
      Networth: currentNetWorth,
    },
    // {
    //   name: "Jul",
    //   Debts: 18,
    //   Assets: 96,
    //   Networth: 96 - 18,
    // },
    // {
    //   name: "Aug",
    //   Debts: 17,
    //   Assets: 95,
    //   Networth: 95 - 17,
    // },
  ];

  return (
    <div
      className={`lg:px-[28px] lg:py-[26px] ${backgroundColor} max-w-[100vw] md:max-w-[100vw] flex flex-col`}
    >
      {/* Mobile version */}
      <div className="flex flex-col">
        <PageHeader
          sectionHeader={"Wealth Builder"}
          sectionSubheader={"Investing"}
          //   date={date}
          //   setDate={setDate}
        />

        {showPlaidOrManual ? (
          <PlaidOrManualSelector
            title={"Let’s Build Wealth!"}
            blurb={
              "Build a tailored plan, fit for your current lifestyle and future goals"
            }
            setShow={setShowPlaidOrManual}
          />
        ) : null}

        {(step === PLANNER_STEP || step === EDIT_STEP) &&
        showPlaidOrManual === false ? (
          <BaseWrapper
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            // setSubTab={setSubTab}
            setSubTab={setStep}
            setTab={setSubTab}
            // Component={
            //   <div className="mx-[16px] my-[16px]">
            //     <WealthGraph
            //       balanceDecreasing={true}
            //       percentDown={0.45}
            //       totalBalance={-67900}
            //       data={data}
            //     />
            //   </div>
            // }
          />
        ) : null}

        {step === PLANNER_STEP && showPlaidOrManual === false ? (
          <div className="mx-[16px] my-[16px]">
            <WealthGraph
              balanceDecreasing={true}
              // percentDown={0.45}
              totalBalance={currentNetWorthNormal}
              data={data}
            />
          </div>
        ) : null}

        {step === EDIT_STEP && showPlaidOrManual === false ? (
          <CategoryBlockCollapsible
            combinedCategories={collapsableItems}
            setLoading={setIsLoading}
            budgetInfo={reshapedBudgetData}
            date={{ year, month }}
            useCategories={[
              { name: "assets", percent: assetsProportion },
              { name: "debts", percent: debtProportion },
            ]}
            useLabels={["assets", "liabilities"]}
            showRecommended={false}
            useValueKey={{ debts: "initialBalance" }}
            collapseCategories={["debts"]}
          />
        ) : null}
        {/* 
        {step === EDIT_STEP ? (
          <CategoryBlock
            setLoading={setIsLoading}
            budgetInfo={reshapedBudgetData}
            date={{ year, month }}
            useCategories={[
              { name: "assets", percent: assetsProportion },
              { name: "debts", percent: debtProportion },
            ]}
            useLabels={["assets", "liabilities"]}
            showRecommended={false}
            useValueKey={{ debts: "initialBalance" }}
            // renderAfterInput={
            //   <PieBreakdownBlock
            //     income={budgetInfo?.data?.income}
            //     border={false}
            //     useBasicLabel
            //     values={_summedCategories}
            //     renderPercentValues={true}
            //     renderShape="flex-row"
            //     height={190}
            //   />
            // }
          />
        ) : null} */}

        {step === "INPUT_STEP" ? (
          <div className="mx-[16px] my-[16px]">
            <DefaultInputs />
          </div>
        ) : null}

        <StepsController
          classes="mt-[4px]"
          useButton={true}
          renderDirection="vertical"
          //   content={
          //     step === BREAKDOWN_STEP ? (
          //       <div className="flex flex-col items-center justify-center text-center px-[16px] mt-[16px]">
          //         <span className="text-orange-500 text-lg font-medium leading-[25.20px]">
          //           This is where the magic happens!
          //         </span>
          //         <span className="text-[#858699] text-base font-normal leading-snug">
          //           To move faster towards your next financial goals,
          //           Investrio suggests the 50/30/20 budget
          //         </span>
          //       </div>
          //     ) : undefined
          //   }
          setNext={() => {}}
          setPrev={() => setPrev(setSubTab, WEALTH_STEPS, step)}
          // setSkip={() => setShowSteps(false)}
          currentStep={WEALTH_STEPS.findIndex((el) => el === step)}
          numSteps={WEALTH_STEPS.length}
        />
      </div>
    </div>
  );
}
