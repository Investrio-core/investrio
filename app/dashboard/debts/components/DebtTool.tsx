import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import useDebtQueries from "@/app/hooks/useDebtQueries";
import { backgroundColor } from "@/app/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loading } from "@/app/components/ui/Loading";
import mixpanel from "mixpanel-browser";
import Mixpanel from "@/services/mixpanel";
import PageHeader from "@/app/components/Layout/PageHeader";
import { ButtonWithIcon } from "@/app/components/ui/buttons";
import { useSession } from "next-auth/react";
import { DashboardInfo } from "@/app/dashboard/debts/components/DebtsRepayment";
import DebtsComparison from "./DebtsComparison";
import DebtSummary from "./DebtSummary";
import AddDebt from "./AddDebt";
import { DebtFormType, FinancialRecordSchema } from "@/types/debtFormType";
import { FinancialRecord } from "@/types/financial";
import { useTabContext } from "@/app/context/TabContext/context";
import { getDebtFreeInfo, SummarySection } from "./SummarySections";
import useCalculators from "@/app/hooks/useCalculators";
import MultiInputBlock from "@/app/components/ui/MultiInputBlock";
import { getSummaryStatistics } from "./helpers";
import useBudgetData from "@/app/hooks/useData/useBudgetData";
import { StyledTab, StyledTabs } from "../../budget/components/StyledTabs";
import { DEBT_REPAYMENT_STRATEGY_NAME } from "../../budget/components/BudgetTool";
import useBudgetQueries from "@/app/hooks/useBudgetQueries";
import { toast } from "react-toastify";
import BudgetProgress from "../../budget/components/BudgetProgress";
import useDebtData from "@/app/hooks/useData/useDebtData";

type DebtMobileSteps = "summary" | "add" | "suggestions" | "priorities";

export const DEBT_SUMMARY = "summary";
export const ADD_DEBT = "add";
export const SUGGESTIONS = "suggestions";
export const PRIORITIES = "priorities";
export const PLANNER_STEP = "PLANNER_STEP";
export const EDIT_STEP = "EDIT_STEP";
export const DEBT_MOBILE_STEPS: DebtMobileSteps[] = [
  DEBT_SUMMARY,
  ADD_DEBT,
  SUGGESTIONS,
  PRIORITIES,
];

export interface DebtItem {
  name: string;
  value: number;
  // recurringExpense?: string;
}

export default function DebtTool() {
  const [date, setDate] = useState(new Date());
  const [step, setStep] = useState<string>(PLANNER_STEP);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [debts, setDebts] = useState<DebtFormType[]>([]);
  const [totalDebtBalance, setTotalDebtBalance] = useState(0);
  const [firstLoadCompleted, setFirstLoadCompleted] = useState(true);
  const [extraPaymentAmount, setExtraPaymentAmount] = useState<
    number | undefined
  >();
  const [tabIndex, setTab] = useState(0);
  const { setTabs, setSubTab, subTab, tab, state } = useTabContext();
  const [extraPayment, setExtraPayment] = useState(0);
  const [percentDown, _setPercentDown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {
    createDebt,
    isSuccess,
    isPending,
    updateDebt,
    updateIsSuccess,
    updateIsPending,
    deleteRecords,
    deleteIsSuccess,
  } = useDebtQueries(setDebts);

  // const setExtraPaymentDebounce = (amount: number) => {
  //   debounce(() => setExtraPayment(amount), 100);
  // };

  // model FinancialRecord[] by userID -> debts
  const {
    data: debtsData,
    hasDebtData,
    debtsLoading,
    debtsFetched,
  } = useDebtData();

  const {
    data: budgetInfo,
    isLoading: budgetInfoLoading,
    refetch: refetchBudgetInfo,
    incomeAfterExpenses,
    sumCategories,
    totalExpenses,
    income,
    hasBudgetData,
  } = useBudgetData(date);

  const __extraPayment =
    budgetInfo?.data?.debts?.find(
      (debt: { name: string }) => debt.name === DEBT_REPAYMENT_STRATEGY_NAME
    )?.value || 0;

  const _year = date?.getFullYear();
  const _month = date?.getMonth();
  const { update: updateBudgetCategory } = useBudgetQueries(
    _year,
    _month,
    setIsLoading,
    budgetInfo?.data?.id
  );

  const updateDebtRepaymentStrategy = async () => {
    const debts = budgetInfo?.data?.debts.filter(
      (debt: { name: string }) => debt.name !== DEBT_REPAYMENT_STRATEGY_NAME
    );

    const newDebts = [
      {
        name: DEBT_REPAYMENT_STRATEGY_NAME,
        value: extraPayment,
        recurringExpense: "true",
      },
      ...debts,
    ];

    await updateBudgetCategory({ debts: newDebts });
    toast.success("Repayment Strategy updated");
  };

  const budgetProgress = (
    <BudgetProgress
      hasBudgetData={hasBudgetData}
      income={income}
      totalExpenses={totalExpenses}
      incomeAfterExpenses={incomeAfterExpenses}
      extraPayment={extraPayment}
      oldExtraPayment={__extraPayment}
    />
  );

  useEffect(() => {
    if (hasDebtData) {
      let totalDebt = 0;
      setSubTab(PLANNER_STEP);
      setStep(PLANNER_STEP);

      setDebts(
        debtsData?.data?.map((r: FinancialRecord) => {
          totalDebt += r.initialBalance;

          return {
            id: r.id,
            debtName: r.title,
            balance: String(r.initialBalance),
            periodicity: r.periodicity,
            debtType: r.type,
            dueDate: r.payDueDate,
            rate: String(r.interestRate) + "%",
            minPayment: String(r.minPayAmount),
            extraPayAmount: r.extraPayAmount,
          };
        })
      );

      setTotalDebtBalance(totalDebt);
    }
  }, [debtsData?.data, hasDebtData]);

  useEffect(() => {
    if (debtsFetched && !hasDebtData) {
      setSubTab(ADD_DEBT);
      setStep(ADD_DEBT);
    } else if (debtsFetched && !firstLoadCompleted && hasBudgetData) {
      setSubTab(PLANNER_STEP);
      setStep(PLANNER_STEP);
      setFirstLoadCompleted(true);
    }
  }, [debtsFetched, hasDebtData, debtsData?.data]);

  const {
    paymentScheduleCalculator,
    snowballResultsWithoutExtra,
    snowballResultsWithExtra,
    avalancheResultsWithExtra,
  } = useCalculators(debtsData, extraPayment);

  console.log("-- calc results --");
  console.log(snowballResultsWithoutExtra);
  console.log(snowballResultsWithExtra);

  if (debtsLoading) {
    return <Loading />;
  }

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

  // const headerSummary = (
  //   <div className="w-[100%] mt-[12px] flex items-center justify-center text-center text-violet-500">
  //     Current Outcome:
  //     <div className="text-lg text-center text-violet-500 w-[200px] font-bold">
  //       Debt Free {betterMethod ? `${betterMethod} By:` : "By:"} <br />{" "}
  //       {dayjs(endDate).format("MMMM YYYY")}
  //     </div>
  //     <div className="text-lg text-center text-violet-500 w-[200px] font-bold">
  //       Interest Paid: <br /> {formatCurrency(totalInterestPaid)}
  //     </div>
  //   </div>
  // );

  const showFallBack =
    !debtsData?.data?.length && !(debtsData?.data?.length > 0);

  const extraPaymentInput = showFallBack ? (
    <></>
  ) : (
    <MultiInputBlock
      // aboveInput={
      //   <div className="py-0 my-0">
      //     <div className="flex flex-col lg:flex-row items-center min-w-fit-content py-0 my-0 lg:mb-4">
      //       <div>
      //         <ExtraPayment />
      //       </div>
      //       <span className="text-gray-500 font-normal text-sm lg:text-normal text-base leading-6 ml-2 whitespace-nowrap lg:whitespace-normal">
      //         Extra Payment
      //       </span>
      //     </div>
      //   </div>
      // }
      aboveInput={
        <div className="flex flex-col text-center">
          <div className="w-[309px] text-center text-[#03091d] text-xl font-semibold">
            Here’s what we found:
          </div>
          <div className="w-[285px] py-[12px] text-center text-[#747682] text-base font-normal">
            See how extra monthly payments impact your finances
          </div>
        </div>
      }
      addPadding={false}
      // padding="px-[20px]"
      number={extraPayment}
      setNumber={setExtraPayment}
      step={10}
      // sectionTitle="See how extra monthly payments affect your finances"
      lastSavedNumber={__extraPayment}
      sectionTitleStyles="mt-[18px] w-[100%] text-center text-slate-400 text-sm font-semibold tracking-tight"
      sectionTitleStyle={{ color: "#8E8ECC" }}
      max={extraPayment * 1.05 + 1000}
      submitButtonText={"Update Strategy"}
      onSubmit={updateDebtRepaymentStrategy}
    />
  );

  const { formattedString, debtFreeBy, month, year } = getDebtFreeInfo(
    typeof endDate === "string" ? new Date(endDate) : endDate ?? new Date(),
    endBalance,
    "MMM YYYY"
  );

  return (
    <div
      className={`lg:px-[28px] lg:py-[26px] lg:max-w-[65vw] lg:ml-[5vw] ${backgroundColor} max-w-[100vw] md:max-w-[100vw] flex flex-col`}
    >
      {/* Mobile version */}
      <div className="flex flex-col">
        {/* <div className="lg:hidden md:hidden flex flex-col"> */}
        <PageHeader
          sectionHeader={"Payoff Planner"}
          sectionSubheader={"Debt"}
          Button={() => (
            <ButtonWithIcon
              // icon={<AiOutlinePlusCircle className="text-2xl" />}
              classProp="font-semibold"
              disabled={subTab === ADD_DEBT}
              onClick={() => {
                setSubTab(ADD_DEBT);
                setStep(ADD_DEBT);
              }}
              text="Add Debt"
            />
          )}
          useMonthPicker={false}
        />
        {/* <SummarySection
          extraPayAmount={extraPayment}
          betterMethod={betterMethod}
          endDate={endDate}
          totalInterestPaid={totalInterestPaid}
          minPayment={minPayment}
          totalInterestSaved={totalInterestSaved}
          endBalance={endBalance}
        /> */}

        <StyledTabs
          value={tabIndex}
          onChange={(e, v) => {
            setTab(v);
            if (v === 0) {
              setSubTab(PLANNER_STEP);
              setStep(PLANNER_STEP);
            }
            if (v === 1) {
              setSubTab(EDIT_STEP);
              setStep(EDIT_STEP);
            }
          }}
        >
          <StyledTab label="Planner" />
          <StyledTab label="Edit" />
        </StyledTabs>

        {/* U+1F4B8 */}

        {/* {budgetProgress} */}

        {/* {headerSummary} */}
        {step === PLANNER_STEP || subTab === undefined ? (
          <>
            <div className="h-[41px] mx-[16px] px-[11px] mt-[11px] flex justify-between items-center bg-white rounded-[18px] border border-[#b1b2ff]/80">
              <div className="h-5 text-center text-black text-sm font-medium text-nowrap">
                💸 Debt Free Date
              </div>
              <div className="w-12 h-5 text-center text-[#40405c] text-sm font-normal mr-[4px] text-nowrap">
                {formattedString}
              </div>
            </div>
            <div className="px-[16px]">{budgetProgress}</div>
            <DashboardInfo
              debtsData={debtsData?.data}
              snowballResultsWithExtra={selectedMethod} //{snowballResultsWithExtra}
              snowballResultsWithoutExtra={snowballResultsWithoutExtra}
              _setPercentDown={_setPercentDown}
            />
            <SummarySection
              extraPayAmount={extraPayment}
              betterMethod={betterMethod}
              endDate={endDate}
              totalInterestPaid={totalInterestPaid}
              minPayment={minPayment}
              totalInterestSaved={totalInterestSaved}
              endBalance={endBalance}
              timeSavedString={timeSavedString}
            />
            <DebtSummary
              debts={debts}
              totalDebt={totalDebtBalance}
              setDebts={setDebts}
              percentDown={percentDown}
              // showChartMap={true}
            />
          </>
        ) : null}

        {step === EDIT_STEP ? (
          <>
            <div className="px-[16px]">{budgetProgress}</div>
            <div className="rounded-[18px] border border-[#d2daff] px-[16px] mx-[18px] mt-[12px] mb-[24px]">
              {extraPaymentInput}
              <DebtsComparison
                userId={session?.user?.id}
                debts={debtsData?.data}
                snowballResultsWithExtra={selectedMethod}
                // snowballResultsWithExtra={snowballResultsWithExtra}
                snowballResultsWithoutExtra={snowballResultsWithoutExtra}
                neverBecomesDebtFree={neverBecomesDebtFree}
                endBalance={endBalance}
                endDate={endDate}
                monthsFaster={monthsFaster}
              />
            </div>
          </>
        ) : null}

        {step === DEBT_SUMMARY ? (
          <>
            <DebtSummary
              debts={debts}
              totalDebt={totalDebtBalance}
              setDebts={setDebts}
            />
          </>
        ) : null}
        {step === ADD_DEBT ? (
          <>
            <AddDebt
              debts={debts}
              setDebts={setDebts}
              createDebt={createDebt}
              extraPaymentAmount={extraPaymentAmount}
              setExtraPaymentAmount={setExtraPaymentAmount}
              cancel={() => {
                if (Array.isArray(debtsData?.data)) {
                  setSubTab(PLANNER_STEP);
                  setStep(PLANNER_STEP);
                } else {
                  setSubTab(DEBT_SUMMARY);
                  setStep(PLANNER_STEP);
                }
              }}
            />
          </>
        ) : null}
        {step === SUGGESTIONS ? (
          <>
            {extraPaymentInput}
            <DashboardInfo
              debtsData={debtsData?.data}
              snowballResultsWithExtra={selectedMethod} //{snowballResultsWithExtra}
              snowballResultsWithoutExtra={snowballResultsWithoutExtra}
            />
          </>
        ) : null}
        {step === PRIORITIES ? (
          <>
            {extraPaymentInput}
            <DebtsComparison
              userId={session?.user?.id}
              debts={debtsData?.data}
              snowballResultsWithExtra={selectedMethod}
              // snowballResultsWithExtra={snowballResultsWithExtra}
              snowballResultsWithoutExtra={snowballResultsWithoutExtra}
              neverBecomesDebtFree={neverBecomesDebtFree}
              endBalance={endBalance}
              endDate={endDate}
            />
          </>
        ) : null}
      </div>
      {/* Desktop version */}
      {/* <div className="hidden md:block lg:block">
        <PageHeader
          sectionHeader={"Payoff Planner"}
          sectionSubheader={"Debt"}
          Button={() => (
            <ButtonWithIcon
              icon={<AiOutlinePlusCircle className="text-2xl" />}
              classProp="font-semibold"
              text="Add Debt"
              onClick={() => setShowAddDebt(true)}
            />
          )}
          useMonthPicker={false}
        />
        <SummarySection
          extraPayAmount={extraPayment}
          betterMethod={betterMethod}
          endDate={endDate}
          totalInterestPaid={totalInterestPaid}
          minPayment={minPayment}
          totalInterestSaved={totalInterestSaved}
          endBalance={endBalance}
        />
    
        <div className="flex flex-wrap">
          <div className="flex flex-row">
            <DebtSummary
              debts={debts}
              totalDebt={totalDebtBalance}
              setDebts={setDebts}
            />
            {showAddDebt ? (
              <AddDebt
                debts={debts}
                setDebts={setDebts}
                createDebt={createDebt}
                extraPaymentAmount={extraPaymentAmount}
                setExtraPaymentAmount={setExtraPaymentAmount}
                cancel={() => {
                  setSubTab(DEBT_SUMMARY);
                  setStep(0);
                }}
              />
            ) : null}



            <DashboardInfo
    
              debtsData={debtsData?.data}
              snowballResultsWithExtra={selectedMethod}
              snowballResultsWithoutExtra={snowballResultsWithoutExtra}
            />
          </div>
          <div className="col-span-2">
            <DebtsComparison
              userId={session?.user?.id}

              debts={debtsData?.data}
              snowballResultsWithExtra={selectedMethod}
              snowballResultsWithoutExtra={snowballResultsWithoutExtra}
              neverBecomesDebtFree={neverBecomesDebtFree}
              endBalance={endBalance}
              endDate={endDate}
            />
          </div>
        </div>
      </div> */}

      {/* <div className="mt-[10px] text-[#6C7278] text-center text-base mt-[24px] mb-[18px]">
        © 2024 Investrio. All rights reserved
      </div> */}
    </div>
  );
}
