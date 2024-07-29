import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import useDebtQueries from "@/app/hooks/useDebtQueries";

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

import { DashboardInfo } from "@/app/dashboard/debts/components/DebtsRepayment";
import DebtsComparison from "./DebtsComparison";
// import { Loading } from "@/app/components/ui/Loading";

import DebtSummary from "./DebtSummary";
import AddDebt from "./AddDebt";
import { DebtFormType, FinancialRecordSchema } from "@/types/debtFormType";
import { FinancialRecord } from "@/types/financial";
import { PaymentConfiguration } from "@/app/components/strategy/payment-configuration";
import { useTabContext } from "@/app/context/TabContext/context";
import { SummarySection } from "./SummarySections";
import useCalculators from "@/app/hooks/useCalculators";
import MultiInputBlock from "@/app/components/ui/MultiInputBlock";
import { formatCurrency } from "@/app/utils/formatters";
import dayjs from "dayjs";
import debounce from "@mui/material/utils/debounce";
import ExtraPayment from "@/public/icons/extra-payment.svg";
import { Results } from "@/app/hooks/calculatorsSnowball";
import { getSummaryStatistics } from "./helpers";
import useBudgetData from "@/app/hooks/useData/useBudgetData";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

type DebtMobileSteps = "summary" | "add" | "suggestions" | "priorities";
export const DEBT_SUMMARY = "summary";
export const ADD_DEBT = "add";
export const SUGGESTIONS = "suggestions";
export const PRIORITIES = "priorities";
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
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const { data: session } = useSession();
  const [debts, setDebts] = useState<DebtFormType[]>([]);
  const [totalDebtBalance, setTotalDebtBalance] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [extraPaymentAmount, setExtraPaymentAmount] = useState<
    number | undefined
  >();
  const { setTabs, setSubTab, subTab, tab, state } = useTabContext();
  const [showAddDebt, setShowAddDebt] = useState(false);
  const [extraPayment, setExtraPayment] = useState(0);
  const axiosAuth = useAxiosAuth();

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

  // useEffect(() => {
  //   if (firstLoad) {
  //     setFirstLoad(false);
  //   } else {
  //     handleSubmit();
  //   }
  // }, [debts]);

  // const handleSubmit = async () => {
  //   // if (deletedIds.length) {
  //   //   const deletedResult = await deleteRecords();
  //   // }

  //   // setDebts((prevState: DebtFormType[]) => [...prevState, newDebt]);

  //   if (debtsData?.data?.length) {
  //     console.log("-- in update --");
  //     updateDebt({ debts, extraPayAmount: extraPaymentAmount ?? 0 });
  //   } else {
  //     console.log("-- in create --");
  //     // const newDebts = [...debts, newDebt]
  //     await createDebt({ debts, extraPayAmount: extraPaymentAmount ?? 0 });
  //     setStep(2);
  //   }
  // };

  // model SnowballPaymentSchedule[] by userID -> snowball
  // const { data, isLoading, refetch, isRefetching } = useQuery({
  //   queryKey: ["dashboard"], // ["dashboard", session?.user?.id],
  //   queryFn: async () => {
  //     // if (session?.user.isShowPaywall) {
  //     //   return mock
  //     // }
  //     const dashboardDataFetched = await axiosAuth.get(
  //       `/dashboard/${session?.user?.id}`
  //     );
  //     // console.log("-- dashboard data --");
  //     // console.log(dashboardDataFetched);

  //     // queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
  //     // queryClient.invalidateQueries({ queryKey: ["extra-payments"] });
  //     return dashboardDataFetched;
  //   },
  //   refetchOnWindowFocus: true,
  //   refetchOnReconnect: true,
  //   refetchOnMount: true,
  //   // staleTime: 148000,
  //   // cacheTime: 148000,
  //   enabled: !!session?.user?.id,
  //   //     onSuccess: () => {
  //   //   queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
  //   // },
  // });

  // model FinancialRecord[] by userID -> debts
  const {
    data: debtsData,
    isLoading: debtsLoading,
    refetch: refetchDebts,
    isRefetching: isRefetchingDebts,
  } = useQuery({
    queryKey: ["extra-payments"],
    queryFn: async () => {
      const debtsData = await axiosAuth.get(
        `/dashboard/records/${session?.user?.id}`
      );

      // queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
      // queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      // console.log("-- FETCHED DEBTS --");
      // console.log(debtsData);

      // normalize debt data as the old interest rate was saved as zero leading decimals, e.g. 0.25...
      const debts = debtsData?.data.map((debt: FinancialRecordSchema) => {
        if (String(debt.interestRate)?.[0] === "0") {
          return { ...debt, interestRate: debt.interestRate * 100 };
        }
        return debt;
      });

      return { ...debtsData, data: debts };
    },
    staleTime: 148000,
    // refetchOnMount: status !== "payment-config",
    // refetchOnWindowFocus: status !== "payment-config",
    // enabled: !!session?.user.id || status !== "payment-config",
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["no-extra-payments"] });
    // },
  });

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

  const budgetProgress = (
    <div className="h-9 w-[100%] relative mt-[38px] mb-[0px] bg-white rounded-[18px] border border-2 border-violet-200">
      <div className="font-md text-violet-500 font-bold mx-[4px] relative top-[-28px] left-[3%]">
        {hasBudgetData
          ? "Monthly Disposable Income"
          : "Set a budget to plan better"}
      </div>
      <LinearProgress
        sx={{
          borderRadius: "15%",
          marginTop: "3px",
          maxWidth: "92%",
          position: "relative",
          top: "-28px",
          left: "5%",
          backgroundColor: "darkred",
          "& .MuiLinearProgress-bar": {
            backgroundColor: hasBudgetData ? "darkgreen" : "darkgrey",
          },
        }}
        variant="determinate"
        value={(totalExpenses / income) * 100}
      />
      <div
        style={{
          position: "absolute",
          color: "darkgreen",
          top: "4px",
          left: "13%",
          transform: "translateX(-50%)",
        }}
      >
        Income
      </div>
      <div
        style={{
          position: "absolute",
          color: "black",
          top: "4px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {/* {((totalExpenses / income) * 100).toFixed(2)}% */}
        Available: {formatCurrency(incomeAfterExpenses - extraPayment)}
      </div>
      <div
        style={{
          position: "absolute",
          color: "darkred",
          top: "4px",
          left: "87%",
          transform: "translateX(-50%)",
        }}
      >
        Expenses
      </div>
    </div>
  );

  const { paymentScheduleCalculator } = useCalculators();

  // useEffect(() => {
  //   console.log("-- have budget info in debt tool");
  //   console.log(budgetInfo);

  //   console.log(totalExpenses);
  //   console.log(income);
  //   console.log((totalExpenses / income) * 100);
  //   console.log(incomeAfterExpenses);
  // }, [budgetInfo]);

  useEffect(() => {
    // console.log("-- debts data changed --");
    // console.log(debtsData?.data);

    if (Array.isArray(debtsData?.data)) {
      // const defaultExtraPayAmount = debtsData?.data?.[0]?.extraPayAmount;

      // if (defaultExtraPayAmount) {
      //   setExtraPaymentAmount(defaultExtraPayAmount);
      // }

      // if (!firstLoad) return;

      let totalDebt = 0;

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
  }, [debtsData?.data]);

  useEffect(() => {
    setStep(DEBT_MOBILE_STEPS.findIndex((step: string) => step === subTab));
  }, [subTab]);

  const DEBT_STEP = DEBT_MOBILE_STEPS.findIndex(
    (step: string) => step === ADD_DEBT
  );

  // TODO:
  const snowballResultsWithoutExtra = useMemo(
    () =>
      debtsData !== undefined
        ? paymentScheduleCalculator(debtsData?.data ?? [], "snowball", 0)
        : undefined,
    [debtsData?.data]
  );

  const snowballResultsWithExtra = useMemo(() => {
    if (debtsData === undefined) return undefined;

    if (extraPayment === 0) return undefined;

    return paymentScheduleCalculator(
      debtsData?.data ?? [],
      "snowball",
      extraPayment
    );
  }, [debtsData?.data, extraPayment]);

  const avalancheResultsWithExtra = useMemo(() => {
    if (debtsData === undefined) return undefined;
    if (extraPayment === 0) return undefined;
    return paymentScheduleCalculator(
      debtsData?.data ?? [],
      "avalanche",
      extraPayment
    );
  }, [debtsData?.data, extraPayment]);

  // console.log("-- AVALANCHE --");
  // console.log(avalancheResultsWithExtra);
  // console.log("-- SNOWBALL --");
  // console.log(snowballResultsWithExtra);

  if (debtsData?.data === undefined) {
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
      aboveInput={
        <div className="py-0 my-0">
          <div className="flex flex-col lg:flex-row items-center min-w-fit-content py-0 my-0 lg:mb-4">
            <div>
              <ExtraPayment />
            </div>
            <span className="text-gray-500 font-normal text-sm lg:text-normal text-base leading-6 ml-2 whitespace-nowrap lg:whitespace-normal">
              Extra Payment
            </span>
          </div>
        </div>
      }
      addPadding={false}
      number={extraPayment}
      setNumber={setExtraPayment}
      step={10}
      sectionTitle="See how extra monthly payments affect your finances"
      lastSavedNumber={extraPayment}
      sectionTitleStyles="mt-[18px] w-[100%] text-center text-slate-400 text-sm font-semibold tracking-tight"
      sectionTitleStyle={{ color: "#8E8ECC" }}
      max={extraPayment * 1.05 + 1000}
    />
  );

  return (
    <div className="lg:px-[28px] lg:py-[26px] bg-violet-50 max-w-[95vw] md:max-w-[100vw]">
      {/* Mobile version */}
      <div className="lg:hidden md:hidden flex flex-col">
        <PageHeader
          sectionHeader={"Payoff Planner"}
          sectionSubheader={"Debt"}
          Button={() => (
            <ButtonWithIcon
              // icon={<AiOutlinePlusCircle className="text-2xl" />}
              classProp="font-semibold"
              disabled={step === DEBT_STEP}
              onClick={() => {
                setStep(DEBT_STEP);
                setSubTab(DEBT_MOBILE_STEPS[DEBT_STEP]);
              }}
              text="Add Debt"
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

        {budgetProgress}
        {/* {headerSummary} */}

        {DEBT_MOBILE_STEPS[step] === DEBT_SUMMARY || subTab === DEBT_SUMMARY ? (
          <>
            <DebtSummary
              debts={debts}
              totalDebt={totalDebtBalance}
              setDebts={setDebts}
            />
          </>
        ) : null}
        {DEBT_MOBILE_STEPS[step] === ADD_DEBT || subTab === ADD_DEBT ? (
          <>
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
          </>
        ) : null}
        {DEBT_MOBILE_STEPS[step] === SUGGESTIONS || subTab === SUGGESTIONS ? (
          <>
            {extraPaymentInput}
            <DashboardInfo
              debtsData={debtsData?.data}
              snowballResultsWithExtra={selectedMethod} //{snowballResultsWithExtra}
              snowballResultsWithoutExtra={snowballResultsWithoutExtra}
            />
          </>
        ) : null}
        {DEBT_MOBILE_STEPS[step] === PRIORITIES || subTab === PRIORITIES ? (
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
      <div className="hidden md:block lg:block">
        <PageHeader
          sectionHeader={"Payoff Planner"}
          sectionSubheader={"Debt"}
          Button={() => (
            <ButtonWithIcon
              icon={<AiOutlinePlusCircle className="text-2xl" />}
              classProp="font-semibold"
              // disabled={formHasError}
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
        {/* <div className="grid grid-cols-4 lg:flex max-w-[100vw] min-h-fit"> */}
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

            {/* <div className="flex"> */}

            <DashboardInfo
              // data={data?.data}
              debtsData={debtsData?.data}
              snowballResultsWithExtra={selectedMethod}
              snowballResultsWithoutExtra={snowballResultsWithoutExtra}
            />
          </div>
          <div className="col-span-2">
            <DebtsComparison
              userId={session?.user?.id}
              // data={data?.data}
              debts={debtsData?.data}
              snowballResultsWithExtra={selectedMethod}
              snowballResultsWithoutExtra={snowballResultsWithoutExtra}
              neverBecomesDebtFree={neverBecomesDebtFree}
              endBalance={endBalance}
              endDate={endDate}
            />
          </div>
        </div>
      </div>

      <div className="mt-[10px] text-[#6C7278] text-center text-base mt-[24px] mb-[18px]">
        © 2024 Investrio. All rights reserved
      </div>
    </div>
  );
}
