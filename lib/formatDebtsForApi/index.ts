import { DebtFormType, FinancialRecord } from "@/types/debtFormType";

export const formatDebtsForApi = (
  userId: string,
  debts: DebtFormType[],
  // debt?: DebtFormType,
  extraPayAmount?: string
) => {
  let result = debts.map((debt) => {
    const data: FinancialRecord = {
      userId,
      debtTitle: debt.debtName,
      minPayAmount: parseFloat(
        debt.minPayment.replace("$", "").replaceAll(",", "")
      ),
      interestRate: parseFloat(debt.rate.replace("%", "")), /// 100,
      debtType: debt.debtType,
      initialBalance: parseFloat(
        debt.balance.replace("$", "").replaceAll(",", "")
      ),
      extraPayAmount: extraPayAmount ? parseFloat(extraPayAmount) : 0,
      periodicity: "MONTH",
    };

    if (debt?.id) {
      data["id"] = debt.id;
    }

    return data;
  });

  return result;
};
