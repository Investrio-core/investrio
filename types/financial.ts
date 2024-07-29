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
      remainingBalance: number;
      monthlyInterestPaid: number;
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
  };
};

export type FinancialRecord = {
  id: string; //                    String            @id @default(cuid())
  title: string; //                  String
  type: "CreditCard"; //            enum DebitType
  periodicity: "MONTH"; //          enum Periodicity
  initialBalance: number; //  Float             @map("initial_outstanding_balance")
  interestRate: number; //    Float             @map("interest_rate")
  minPayAmount: number; //    Float             @map("minimum_payment")
  payDueDate: string; //      DateTime          @map("payment_due_date")
  extraPayAmount: number; //  Float             @default(0) @map("extra_payment")
  createdAt: string; //       DateTime          @default(now()) @map("created_at")
  updatedAt: string; //       DateTime          @updatedAt @map("updated_at")
  userId: string; //          String?            @map("user_id")
  // user: //            User?              @relation(fields: [userId], references: [id])
};
