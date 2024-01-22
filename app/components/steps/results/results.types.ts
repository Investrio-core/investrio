export type Info = {
  monthlyInterestPaid: number;
  monthlyInterestRate: number;
  monthlyPayment: number;
  remainingBalance: number;
  title: string;
};

export type Data = {
  extraPayAmount: number;
  monthTotalPayment: number;
  paymentDate: string;
  remainingBalance: number;
  totalInitialBalance: number;
  totalInterestPaid: number;
  data: Info[];
};

export type ResultsProps = {
  data: Data[];
};
