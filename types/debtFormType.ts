export type DebtFormType = {
  id?: string;
  debtType: string;
  debtName: string;
  balance: string;
  rate: string;
  minPayment: string;
  dueDate: string;
  periodicity: string;
  extraPayAmount?: string | number;
};

export type DebtType = {
  minPayAmount: number;
  title: string;
  initialBalance: number;
  monthlyInterestRate: number;
  data: DebtSnapshotType[];
};

export type DebtSnapshotType = {
  currentDate: number;
  monthlyInterestPaid: number;
  monthlyPayment: number;
  remainingBalance: number;
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
};
