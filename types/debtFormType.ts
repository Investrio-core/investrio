export type DebtFormType = {
  id?: string;
  debtType: string;
  debtName: string;
  balance: string;
  rate: string;
  minPayment: string;
  dueDate: string;
  periodicity: string;
}

export type DebtType = {
  minPayAmount: number;
  title: string;
  initialBalance: number;
  monthlyInterestRate: number;
  data: DebtSnapshotType[];
}

export type DebtSnapshotType = {
  currentDate: number;
  monthlyInterestPaid: number;
  monthlyPayment: number;
  remainingBalance: number;
}