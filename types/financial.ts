export type PaymentScheduleGraphType = {
  combinedBalanceWithFirstMonthInterest: number;
  combinedInitialBalance: number;
  data: PaymentScheduleItemType[];
  debtFreeMonth: number;
  extraPayAmount: number;
  minPayAmount: number;
  monthlyInterestRateFraction: number;
  title: string[];
};

export type IPaymentScheduleGraphType = {
  data: {
    combinedBalanceWithFirstMonthInterest: number;
    combinedInitialBalance: number;
    data: PaymentScheduleItemType[];
    debtFreeMonth: number;
    extraPayAmount: number;
    minPayAmount: number;
    monthlyInterestRateFraction: number;
    title: string[];
  };
};

type PaymentScheduleItemType = {
  currentDate: number;
  monthlyInterestPaid: number;
  monthlyPayment: number;
  remainingBalance: number;
};

export type ComparisonData = {
  data: {

    withoutStrategy: {
      paymentDate: string;
      _sum: { remainingBalance: number; monthlyInterestPaid: number };
    }[];
    withStrategy: {
      paymentDate: string;
      remainingBalance: number;
      totalInterestPaid: number;
    }[];
    totalInterestPaid: number;
    withStrategyTotalInterestPaid: number;
    savedInterest: number;
    monthsFaster: number;
  }
};
