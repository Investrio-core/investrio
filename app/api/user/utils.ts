import prisma from "@/lib/prisma";
import {
  CardData,
  CombineGraphData,
  DebtRecord,
  Payment,
  PaymentCalculationResult,
  PayScheduleData,
  RecordData,
  TransformedData,
} from "./interface";
import { error } from "console";

import { toFixed } from "@/utils/formatters";

export function roundToTwo(num: number): number {
  return Math.round(num * 100 + Number.EPSILON) / 100;
}

function monthDiff(d1: Date, d2: Date) {
  let months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

// This function just calculates the schedule for every debt record without taking in consideration the EXTRA PAYMENT AMOUNT - this should be handled in another function
export async function allUserFinancialRecords(userId: string) {
  try {
    const userDebts = await prisma.financialRecord.findMany({
      where: { userId: userId },
      orderBy: {
        initialBalance: "asc",
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (userDebts.length === 0) {
      return {
        error: "No records found for the specified user.",
        status: 404,
      };
    }

    const responseArray: any[] = [];
    // needs to be optimized <>
    userDebts.forEach((debt: any) => {
      let balance = debt.initialBalance;
      let monthly_ir = debt.interestRate / 12;
      let currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(1);
      currentDate.setHours(0, 0, 0, 0);

      const debtObj: DebtRecord = {
        id: debt.id,
        title: debt.title,
        extraPayAmount: debt.extraPayAmount,
        initialBalance: debt.initialBalance,
        monthlyInterestRateFraction: monthly_ir,
        minPayAmount: debt.minPayAmount,
        data: [],
      };

      while (balance > 0) {
        let monthly_ir_paid = roundToTwo(balance * monthly_ir);
        let monthly_payment =
          balance < debt.minPayAmount
            ? balance + monthly_ir_paid
            : debt.minPayAmount;
        let previousBalance = balance;
        balance -= monthly_payment - monthly_ir_paid;
        balance = roundToTwo(balance);

        if (balance >= previousBalance) {
          throw new Error(
            "Balance is not decreasing, potential infinite loop detected"
          );
        }

        debtObj.data.push({
          currentDate: currentDate.getTime(),
          monthlyInterestPaid: monthly_ir_paid,
          monthlyPayment: monthly_payment,
          remainingBalance: balance,
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      responseArray.push(debtObj);
    });

    return responseArray;
  } catch (error) {
    console.error({ "Error:": error });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function extraPaymentGraph(userId: string) {
  try {
    const userData = await prisma.snowballPaymentSchedule.findMany({
      where: { userId },
      orderBy: { paymentDate: "asc" },
      select: {
        totalInitialBalance: true,
        totalInterestPaid: true,
        monthTotalPayment: true,
        remainingBalance: true,
        paymentDate: true,
        data: true,
      },
    });

    if (userData.length === 0) {
      throw new Error("No data found for user");
    }

    let dateGroupMap = new Map<string, CardData[]>();

    // Group data by date
    userData.forEach((item) => {
      const dateString = item.paymentDate.toISOString().split("T")[0];
      if (!item.data || !Array.isArray(item.data)) {
        return;
      }

      const cardDataArray = item.data.filter((card) => {
        return typeof card === "object" && card !== null && "title" in card;
      });

      const currentArray: any = dateGroupMap.get(dateString) || [];
      currentArray.push(...cardDataArray);
      dateGroupMap.set(dateString, currentArray);
    });
    let combinedBalanceWithFirstMonthInterest = userData[0].totalInitialBalance;
    // Transform the grouped data
    let transformed: TransformedData = {
      title: [],
      combinedInitialBalance: userData[0].totalInitialBalance,
      combinedBalanceWithFirstMonthInterest:
        combinedBalanceWithFirstMonthInterest + userData[0].totalInterestPaid,
      minPayAmount: userData[0].monthTotalPayment,
      debtFreeMonth: new Date(
        userData[userData.length - 1].paymentDate
      ).getTime(),
      monthlyInterestRateFraction: 0,
      extraPayAmount: 0,
      data: [],
    };

    dateGroupMap.forEach((cardDataArray, dateString) => {
      let combinedRemainingBalance = cardDataArray.reduce(
        (acc, card) => acc + card.remainingBalance,
        0
      );
      let combinedMonthlyPayment = cardDataArray.reduce(
        (acc, card) => acc + card.monthlyPayment,
        0
      );
      let combinedMonthlyInterestPaid = cardDataArray.reduce(
        (acc, card) => acc + card.monthlyInterestPaid,
        0
      );

      if (transformed.title.length === 0) {
        transformed.title = cardDataArray.map((card) => card.title);
      }

      transformed.data.push({
        currentDate: new Date(dateString).getTime(),
        monthlyInterestPaid: combinedMonthlyInterestPaid,
        monthlyPayment: combinedMonthlyPayment,
        remainingBalance: combinedRemainingBalance,
      });
    });

    return transformed;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export function paymentGraphForStepTwo(
  records: PayScheduleData[],
  useExtraPayAmount: boolean = false
): CombineGraphData {
  const singleExtraAmount = useExtraPayAmount ? records[0].extraPayAmount : 0;
  const combinedTitle = records.map((r) => r.title);
  let combinedInitialBalance = 0,
    combinedMonthlyInterestRate = 0,
    combinedMinPayAmount = 0;

  records.forEach((r) => {
    combinedInitialBalance += r.initialBalance;
    combinedMonthlyInterestRate += r.monthlyInterestRateFraction;
    combinedMinPayAmount += r.minPayAmount;
  });

  let dateMap = new Map<number, RecordData>();

  records.forEach((record) => {
    record.data.forEach((dataPoint) => {
      let existingData = dateMap.get(dataPoint.currentDate);
      const totalMonthlyPayment = dataPoint.monthlyPayment + singleExtraAmount;
      if (existingData) {
        existingData.monthlyInterestPaid += dataPoint.monthlyInterestPaid;
        existingData.monthlyPayment += totalMonthlyPayment;
        existingData.remainingBalance += dataPoint.remainingBalance;
      } else {
        dateMap.set(dataPoint.currentDate, {
          currentDate: dataPoint.currentDate,
          monthlyInterestPaid: dataPoint.monthlyInterestPaid,
          monthlyPayment: dataPoint.monthlyPayment + singleExtraAmount,
          remainingBalance: roundToTwo(dataPoint.remainingBalance),
        });
      }
    });
  });

  let monthlyRecords = Array.from(dateMap.values());
  monthlyRecords.sort((a, b) => a.currentDate - b.currentDate);

  let lastRecordDate = monthlyRecords[monthlyRecords.length - 1].currentDate;
  let initialBalanceWithFirstMonthInterest =
    monthlyRecords[0].monthlyInterestPaid + combinedInitialBalance;
  let result = {
    title: combinedTitle,
    combinedInitialBalance,
    monthlyInterestRateFraction: combinedMonthlyInterestRate,
    combinedBalanceWithFirstMonthInterest: initialBalanceWithFirstMonthInterest,
    minPayAmount: combinedMinPayAmount,
    debtFreeMonth: lastRecordDate,
    extraPayAmount: singleExtraAmount,
    data: monthlyRecords,
  };

  return result;
}

// function calculateXPayment(debts: Debt[], extraPayment: boolean): PaymentCalculationResult[] {
function calculateXPayment(
  debts: any,
  extraPayment: boolean
): PaymentCalculationResult[] {
  const grouped: {
    [dateKey: string]: {
      payments: Payment[];
      totalInterest: number;
      userId: string;
    };
  } = {};
  let totalInitialBalance = debts.reduce(
    (acc: any, debt: any) => acc + debt.initialBalance,
    0
  );

  try {
    for (const debt of debts) {
      const monthlyInterestRate = debt.interestRate / 12;
      const user_id = debt.userId;

      for (const { financialRecord, ...payment } of debt.PaymentSchedule) {
        const minPayAmount = payment.minPayAmount;
        const dateKey = payment.paymentDate;
        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            payments: [],
            totalInterest: 0,
            userId: user_id,
          };
        }
        grouped[dateKey].payments.push({
          ...payment,
          monthlyInterestRate,
          minPayAmount,
          initialBalance: financialRecord.initialBalance,
        });
        grouped[dateKey].totalInterest += payment.monthlyInterestPaid;
      }
    }

    let cumulativeInterestPaid = 0;
    let cumulativePayments = 0;

    let paymentResults = Object.keys(grouped)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((dateKey) => {
        cumulativeInterestPaid += grouped[dateKey].totalInterest;
        const monthlyPaymentsSum = grouped[dateKey].payments.reduce(
          (sum, payment) => sum + payment.monthlyPayment,
          0
        );
        cumulativePayments += monthlyPaymentsSum;

        const balance =
          totalInitialBalance + cumulativeInterestPaid - cumulativePayments;
        return {
          paymentDate: dateKey,
          userId: grouped[dateKey].userId,
          totalInitialBalance: totalInitialBalance,
          totalPayment: monthlyPaymentsSum,
          extraPayAmount: grouped[dateKey].payments[0].extraPayAmount,
          totalInterestPaid: grouped[dateKey].totalInterest,
          balance: balance,
          data: grouped[dateKey].payments.map(
            ({ extraPayAmount, paymentDate, ...rest }) => rest
          ),
        };
      });

    const paymentResultsLength = paymentResults[0].data.length;

    const mappedFilteredPaymentsResults = paymentResults.map((result) => {
      if (result.data.length < paymentResultsLength) {
        const titles = debts.map((e: any) => e.title);

        titles.forEach((_el: unknown, idx: number) => {
          if (!titles.includes(result.data[idx]?.title)) {
            result.data.push({
              title: debts[idx].title,
              id: "",
              remainingBalance: 0,
              initialBalance: debts[idx].initialBalance,
              monthlyInterestPaid: 0,
              monthlyPayment: 0,
              monthlyInterestRate: 0,
              minPayAmount: debts[idx].minPayAmount,
            });
          }
        });
      }
      return result;
    });

    return extraPayment
      ? applyExtraPaymentsToBalance(mappedFilteredPaymentsResults)
      : paymentResults;
  } catch (error) {
    console.error(error);
    return []; // return an empty array or handle the error appropriately
  }
}

function recalculatePrevious(payment: PaymentCalculationResult, extra: number) {
  let available = extra;

  for (let i = 0; i < payment.data.length; i++) {
    const data = payment.data[i];

    if (data.remainingBalance > 0) {
      const newBalance = data.remainingBalance - available;

      if (newBalance < 0) {
        available = Math.abs(newBalance);
        data.remainingBalance = 0;
        data.monthlyPayment = data.monthlyPayment + data.remainingBalance;
      } else {
        data.monthlyPayment = data.monthlyPayment + available;
        data.remainingBalance = newBalance;
        break;
      }
    }
  }
}

function recalculateExtra(
  payment: PaymentCalculationResult,
  extra: number,
  prevPayment: PaymentCalculationResult | null
) {
  let available = extra;

  for (let i = 0; i < payment.data.length; i++) {
    let prevData = null;
    let data = payment.data[i];
    if (prevPayment) {
      prevData = prevPayment.data[i];
    }

    let balanceToPay = prevData
      ? prevData.remainingBalance
      : data.remainingBalance - data.monthlyInterestPaid + data.minPayAmount;
    balanceToPay = toFixed(balanceToPay);
    const interest = toFixed(balanceToPay * data.monthlyInterestRate, 3);
    console.log("interest", interest);
    const balanceWithInterest = toFixed(balanceToPay + interest);

    let balanceWithPayment = toFixed(
      balanceWithInterest - (data.minPayAmount + available)
    );

    if (balanceWithPayment > 0) {
      data.remainingBalance = toFixed(balanceWithPayment);
      data.monthlyPayment = toFixed(data.minPayAmount + available);
      data.monthlyInterestPaid = interest;
      available = 0;
    } else {
      data.remainingBalance = 0;
      data.monthlyInterestPaid = interest;
      data.monthlyPayment = toFixed(
        data.minPayAmount + available - Math.abs(balanceWithPayment)
      );
      available = toFixed(Math.abs(balanceWithPayment));
    }

    if (i === payment.data.length - 1 && available > 0) {
      recalculatePrevious(payment, available);
    }
  }
}

function applyExtraPaymentsToBalance(
  payments: PaymentCalculationResult[]
): PaymentCalculationResult[] {
  let prevPayment: PaymentCalculationResult | null = null;

  for (let i = 0; i < payments.length; i++) {
    let payment = payments[i];

    if (i > 0) {
      prevPayment = payments[i - 1];
    }

    payment.data.sort((a, b) => {
      return a.initialBalance - b.initialBalance;
    });

    recalculateExtra(payment, payment.extraPayAmount, prevPayment);

    // Update overall balance and ensure it doesn't go negative
    // remainingExtraPayment = updateOverallBalance(payment, availableExtraPayment);

    // Update remaining balances and interest for each debt
    // updateDebtPayments(payments, payment, i);

    // Recalculate total payment for the schedule
    recalculateTotalPayment(payment);

    // Calculate balance for each schedule
    calculateScheduleBalance(payments, payment, i);

    // Update total interest paid for the payment schedule
    updateTotalInterestPaid(payment);
  }

  // Additional check for the last schedule
  if (payments.length > 0) {
    let lastPayment = payments[payments.length - 1];
    if (lastPayment.balance < 0) {
      lastPayment.balance = 0;
    }
  }

  const filteredPayments = payments.filter((v) => v.totalPayment !== 0);

  upsertSnowballSchedule(filteredPayments);
  return filteredPayments;
}

function recalculateTotalPayment(payment: PaymentCalculationResult): void {
  payment.totalPayment = payment.data.reduce(
    (sum, debt) => sum + debt.monthlyPayment,
    0
  );
}
// Apply Extra Payment to First Debt that is not zero of debts
function applyExtraPaymentToFirstDebt(
  payment: PaymentCalculationResult,
  availableExtraPayment: number
): number {
  // Iterate over each debt
  for (let i = 0; i < payment.data.length; i++) {
    let debtPayment = payment.data[i];

    if (availableExtraPayment <= 0) {
      break; // Exit loop if no extra payment is available
    }
    let appliedExtraPayment = Math.min(
      debtPayment.remainingBalance,
      availableExtraPayment
    ); // set up for right order of operations bellow
    debtPayment.remainingBalance -= appliedExtraPayment;
    availableExtraPayment -= appliedExtraPayment;

    debtPayment.monthlyPayment += appliedExtraPayment;
    payment.totalPayment += appliedExtraPayment;

    if (i !== payment.data.length - 1 && debtPayment.remainingBalance <= 0) {
      debtPayment.monthlyPayment -= appliedExtraPayment;
      payment.totalPayment -= appliedExtraPayment;

      availableExtraPayment = 0;
      availableExtraPayment += payment.extraPayAmount;
    } else {
      if (debtPayment.remainingBalance < 0) {
        availableExtraPayment += -debtPayment.remainingBalance;
        // availableExtraPayment += payment.extraPayAmount
        debtPayment.remainingBalance = 0;
      }
    }

    // Adjust for negative balance and move to the next debt if current is fully paid
    // if (debtPayment.remainingBalance < 0) {
    //   availableExtraPayment += -debtPayment.remainingBalance;
    //   // availableExtraPayment += payment.extraPayAmount
    //   debtPayment.remainingBalance = 0;
    // }
  }

  return availableExtraPayment;
}

function applyExtraPaymentToSubsequentDebts(
  payment: PaymentCalculationResult,
  availableExtraPayment: number
): number {
  payment.data.forEach((debt, index) => {
    if (index !== 0 && availableExtraPayment > 0) {
      let appliedExtraPayment = Math.min(
        debt.remainingBalance,
        availableExtraPayment
      );

      debt.remainingBalance -= appliedExtraPayment;
      availableExtraPayment -= appliedExtraPayment;

      debt.monthlyPayment += appliedExtraPayment;
      payment.totalPayment += appliedExtraPayment;

      if (debt.remainingBalance < 0) {
        availableExtraPayment += -debt.remainingBalance;
        debt.remainingBalance = 0;
      }
    }
  });

  return availableExtraPayment;
}

function updateOverallBalance(
  payment: PaymentCalculationResult,
  availableExtraPayment: number
): number {
  payment.balance -= payment.totalPayment;
  if (payment.balance < 0) {
    availableExtraPayment += -payment.balance;
    payment.balance = 0;
  }
  return availableExtraPayment;
}

function calculateScheduleBalance(
  payments: PaymentCalculationResult[],
  payment: PaymentCalculationResult,
  index: number
): void {
  payment.balance = payment.data.reduce(
    (sum, debt) => sum + debt.remainingBalance,
    0
  );

  // Ensure balance does not go negative
  if (payment.balance < 0) {
    payment.balance = 0;
  }
}

function updateDebtPayments(
  payments: PaymentCalculationResult[],
  payment: PaymentCalculationResult,
  index: number
): void {
  for (let debtPayment of payment.data) {
    if (index > 0) {
      let previousPayment = payments[index - 1];
      let previousDebtPayment = previousPayment.data.find(
        (d) => d.title === debtPayment.title
      );
      // There's a problem here, which if the extraPayAmount isn't applied to the first debt, should go for the following one within the same schedule and not the following
      if (previousDebtPayment) {
        // Check if debt is about to be paid off
        let potentialRemainingBalance = toFixed(
          previousDebtPayment.remainingBalance -
            (debtPayment.monthlyPayment - debtPayment.monthlyInterestPaid)
        );
        if (potentialRemainingBalance <= 0) {
          // Adjust monthlyPayment for the final payment
          debtPayment.remainingBalance = 0;
        } else {
          debtPayment.remainingBalance = potentialRemainingBalance;
        }
      } else {
        // Handle the case when previousDebtPayment is undefined
        // Set default values or handle the error accordingly
        console.log("previousDebtPayment is undefined");
      }
    }
  }
}

function updateTotalInterestPaid(payment: PaymentCalculationResult): void {
  payment.totalInterestPaid = payment.data.reduce(
    (sum, dp) => toFixed(sum + dp.monthlyInterestPaid),
    0
  );
}

async function upsertSnowballSchedule(payments: PaymentCalculationResult[]) {
  try {
    const batchUpsert = payments.map((payment) => {
      return prisma.snowballPaymentSchedule.upsert({
        where: {
          userId_paymentDate: {
            userId: payment.userId,
            paymentDate: new Date(payment.paymentDate),
          },
        },
        update: {
          // Fields to update
          totalInitialBalance: payment.totalInitialBalance,
          monthTotalPayment: payment.totalPayment,
          extraPayAmount: payment.extraPayAmount,
          totalInterestPaid: payment.totalInterestPaid,
          remainingBalance: payment.balance,
          data: payment.data, // Assuming direct JSON assignment works
        },
        create: {
          // Fields for a new record
          userId: payment.userId,
          paymentDate: new Date(payment.paymentDate),
          totalInitialBalance: payment.totalInitialBalance,
          monthTotalPayment: payment.totalPayment,
          extraPayAmount: payment.extraPayAmount,
          totalInterestPaid: payment.totalInterestPaid,
          remainingBalance: payment.balance,
          data: payment.data, // Assuming direct JSON assignment works
        },
      });
    });
    await prisma.$transaction(batchUpsert);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
  return payments;
}

export async function snowBallPaymentScheduleCalculator(userId: string) {
  try {
    const userDebtsPayments = await prisma.financialRecord.findMany({
      where: { userId: userId },
      orderBy: { initialBalance: "asc" },
      select: {
        id: true,
        userId: true,
        title: true,
        type: true,
        periodicity: true,
        initialBalance: true,
        interestRate: true,
        minPayAmount: true,
        payDueDate: true,

        PaymentSchedule: {
          select: {
            title: true,
            monthlyInterestPaid: true,
            minPayAmount: true,
            monthlyPayment: true,
            remainingBalance: true,
            extraPayAmount: true,
            paymentDate: true,
            financialRecord: {
              select: {
                initialBalance: true,
              },
            },
          },
        },
      },
    });

    // Assumption: `debts` is already sorted by `initialBalance` in ascending order due to Prisma's retrieval.
    if (userDebtsPayments.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
      // return new Response(JSON.stringify({ message: 'No outstanding debts found for the user.', noDebts: true }), { status: 200 });
    }

    // Issue here is that struct of Debt[] is different from the struct of PaymentSchedule[]
    let paymentSchedule = await calculateXPayment(userDebtsPayments, true);

    // Return the payment schedule
    return new Response(JSON.stringify(paymentSchedule), { status: 200 });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error calculating snowball payment schedule:", error);
    return new Response("Error calculating snowball payment schedule", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function snowBallData(userId: string) {
  try {
    const userDebtsPayments = await prisma.snowballPaymentSchedule.findMany({
      where: { userId: userId },
      orderBy: { paymentDate: "asc" },
      select: {
        paymentDate: true,
        totalInitialBalance: true,
        extraPayAmount: true,
        monthTotalPayment: true,
        totalInterestPaid: true,
        remainingBalance: true,
        data: true,
      },
    });

    // Assumption: `debts` is already sorted by `initialBalance` in ascending order due to Prisma's retrieval.
    if (userDebtsPayments.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    // Filter out records where monthTotalPayment is 0
    const filteredPayments = userDebtsPayments.filter(
      (payment) => payment.monthTotalPayment !== 0
    );

    // Return the payment schedule
    return new Response(JSON.stringify(filteredPayments), { status: 200 });
  } catch (error) {
    return new Response("Error calculating snowball payment schedule", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function StepThreeInfo(userId: string) {
  try {
    const financialRecords = await prisma.financialRecord.findMany({
      where: { userId },
      orderBy: { payDueDate: "asc" },
      select: {
        title: true,
        PaymentSchedule: {
          orderBy: { paymentDate: "asc" },
          select: {
            monthlyInterestPaid: true,
            paymentDate: true,
          },
        },
      },
    });

    let totalInterestPaid = 0;
    let lastPaymentDateFinancial = new Date(0);

    financialRecords.forEach((record) => {
      record.PaymentSchedule.forEach((schedule) => {
        totalInterestPaid += schedule.monthlyInterestPaid;
        const scheduleDate = new Date(schedule.paymentDate);
        if (scheduleDate > lastPaymentDateFinancial) {
          lastPaymentDateFinancial = scheduleDate;
        }
      });
    });

    const snowballRecords = await prisma.snowballPaymentSchedule.findMany({
      where: { userId },
      select: {
        totalInterestPaid: true,
      },
    });

    const totalInterestPaidSnowball = snowballRecords.reduce(
      (sum, record) => sum + record.totalInterestPaid,
      0
    );

    const lastSnowballRecordWithZeroBalance =
      await prisma.snowballPaymentSchedule.findFirst({
        where: { userId, remainingBalance: 0 },
        orderBy: { paymentDate: "asc" },
        select: { paymentDate: true },
      });

    let lastPaymentDateSnowball = lastSnowballRecordWithZeroBalance
      ? new Date(lastSnowballRecordWithZeroBalance.paymentDate)
      : null;

    let monthsFaster = 0;
    if (lastPaymentDateFinancial && lastPaymentDateSnowball) {
      monthsFaster = monthDiff(
        lastPaymentDateSnowball,
        lastPaymentDateFinancial
      );
    }

    const savings = totalInterestPaid - totalInterestPaidSnowball;

    const response = {
      withoutPlaningTotalInterest: totalInterestPaid,
      debtFreeDateSnowball: lastPaymentDateSnowball?.toISOString(),
      debtFreeDateNoPlan: lastPaymentDateFinancial.toISOString(),
      snowballTotalInterestPaid: totalInterestPaidSnowball,
      savings,
      monthsFaster,
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "An error occurred!" }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function StepTwoPayments(userId: string) {
  try {
    const data = await prisma.financialRecord.findMany({
      where: { userId: userId },
      select: {
        id: true,
        title: true,
        type: true,
        periodicity: true,
        initialBalance: true,
        interestRate: true,
        minPayAmount: true,
        payDueDate: true,
        extraPayAmount: true,
      },
    });

    if (data === undefined || data === null || data.length === 0) {
      return new Response(
        JSON.stringify({ message: "No records found for user!" }),
        { status: 204 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "An error occurred!" }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
