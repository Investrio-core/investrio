// import { DebtFormType } from "@/types/debtFormType";
import { REPAYMENT_STRATEGIES } from "./calculatorsSnowball";
import Snowball from "./calculatorsSnowball/Snowball";

// const DUMMY_DEBTS_TEST = [
//   {
//     title: "Chase",
//     initialBalance: 10000,
//     minPayAmount: 300,
//     interestRate: 10, // test that high interest rate doesn't break this...
//   },
//   {
//     title: "Amex",
//     initialBalance: 15000,
//     minPayAmount: 450,
//     interestRate: 15,
//   },
//   {
//     title: "Discover",
//     initialBalance: 20000,
//     minPayAmount: 600,
//     interestRate: 20,
//   },
// ];

export function roundToTwo(num: number): number {
  return Math.round(num * 100 + Number.EPSILON) / 100;
}
/*
      FinancialRecordId: record.id,
        userId: userId,
        title: record.title,
        extraPayAmount: record.extraPayAmount,
        paymentDate: new Date(payment.currentDate),
        monthlyInterestPaid: payment.monthlyInterestPaid,
        monthlyPayment: payment.monthlyPayment,
        remainingBalance: payment.remainingBalance,
        minPayAmount: record.minPayAmount,
*/

// DEBT:
// id: 'clz217xhl012qc608z4rcwua6',
// userId: 'clyz41gf00000342wav7f86n9',
// title: 'Visa',
// type: 'CreditCard',
// periodicity: 'MONTH',
// initialBalance: 100,
// interestRate: 1,
// minPayAmount: 3,

/*
        balanceStart: this.balance,
        balanceEnd: this.balance,
        accruedInterest: 0,
        minPayment: this.minPayment,
        additionalPayment: 0,
        paymentAmount: 0,
        name: this.name,
*/

/*
export interface AccountObject {
  name: string;
  balance: number;
  interest: number;
  minPayment: number;
}
*/

function paymentScheduleCalculator(
  debts: {
    title: string;
    initialBalance: number;
    interestRate: number;
    minPayAmount: number;
  }[],
  strategy = REPAYMENT_STRATEGIES.SNOWBALL,
  additionalPayment: number
) {
  const accounts =
    debts?.map((debt) => ({
      name: debt.title,
      balance: debt.initialBalance,
      interest: debt.interestRate, // * 100,
      minPayment: debt.minPayAmount,
    })) ?? [];

  const snowball = new Snowball(
    accounts,
    additionalPayment,
    strategy === "snowball"
      ? REPAYMENT_STRATEGIES.SNOWBALL
      : REPAYMENT_STRATEGIES.AVALANCHE
  );
  const snowballPaymentPlan = snowball.createPaymentPlan();
  // console.log("-- real payment plan --");
  // console.log(snowballPaymentPlan);

  // console.log("-- calculating snowball payment plan --");
  // const snowballTest = new Snowball(
  //   DUMMY_DEBTS_TEST.map((debt) => ({
  //     name: debt.title,
  //     balance: debt.initialBalance,
  //     interest: debt.interestRate,
  //     minPayment: debt.minPayAmount,
  //   })),
  //   100,
  //   REPAYMENT_STRATEGIES.SNOWBALL
  // );

  // const snowballPaymentPlanTest = snowballTest.createPaymentPlan();
  // console.log("-- dummy payment plan --");
  // console.log(snowballPaymentPlanTest);

  return snowballPaymentPlan;
}

export default function useCalculators() {
  return {
    paymentScheduleCalculator,
  };
}
