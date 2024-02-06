import { getCookie } from "@/utils/session";
import { Session } from "next-auth";

export type Debt = {
  debtName: string;
  minPayment: string;
  rate: string;
  debtType: string;
  balance: string;
  dueDate: string;
  periodicity: string;
};

export const formatDebtsForApi = ( userId: string ,debts: Debt[], extraPayAmount: string ) => {
  let result = debts.map((debt) => ({
    userId,
    debtTitle: debt.debtName,
    minPayAmount: parseFloat(debt.minPayment.replace("$", "").replaceAll(",", "")),
    interestRate: parseFloat(debt.rate.replace("%", "")) / 100,
    debtType: debt.debtType,
    initialBalance: parseFloat(
      debt.balance.replace("$", "").replaceAll(",", "")
    ),
    extraPayAmount: parseFloat(extraPayAmount),
    periodicity: "MONTH",
  })); 
  return result;
};
