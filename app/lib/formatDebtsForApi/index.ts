import { getCookie } from "@/utils/session";
import { Session } from "next-auth";

export type Debt = {
  id?: string,
  debtName: string;
  minPayment: string;
  rate: string;
  debtType: string;
  balance: string;
  dueDate: string;
  periodicity: string;
};

export type FinancialRecord = {
  userId: string;
  id?: string;
  debtTitle: string;
  minPayAmount: number;
  interestRate: number;
  debtType: string;
  initialBalance: number;
  extraPayAmount: number;
  periodicity: string;
}

export const formatDebtsForApi = ( userId: string ,debts: Debt[], extraPayAmount: string ) => {
  let result = debts.map((debt) => {

    const data: FinancialRecord = {
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
  }

  if (debt?.id) {
    data['id'] = debt.id
  }

  return data
}); 

  return result;
};
