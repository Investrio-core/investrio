import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { DebitType, Periodicity } from "@prisma/client";
import {
  allUserFinancialRecords,
  snowBallPaymentScheduleCalculator,
} from "../utils";

interface RequestBody {
  userId: string;
  debtTitle: string;
  interestRate: number;
  debtType: DebitType;
  periodicity: Periodicity;
  initialBalance: number;
  minPayAmount: number;
  extraPayAmount: number;
  payDueDate: string;
}

export async function POST(request: Request) {
  const accessToken = request.headers.get("Authorization");
  const body: RequestBody[] = await request.json();
  const userId = body[0].userId;

  // Verify user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userExists) {
    return new Response(JSON.stringify({ error: "User does not exist" }), {
      status: 401,
    });
  }

  // Verify the access token
  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
    });
  }
  // Check for duplicate titles
  const titles = body.map((item) => item.debtTitle);
  const uniqueTitles = new Set(titles);
  if (titles.length !== uniqueTitles.size) {
    return new Response(
      JSON.stringify({ error: "Duplicate titles found, cannot add records." }),
      { status: 400 }
    );
  }

  // Create the records
  const dataForCreation = body.map((debtRecord: any) => ({
    interestRate: debtRecord.interestRate,
    title: debtRecord.debtTitle,
    type: debtRecord.debtType,
    periodicity: debtRecord.periodicity,
    initialBalance: debtRecord.initialBalance,
    minPayAmount: debtRecord.minPayAmount,
    payDueDate: new Date(),
    extraPayAmount: debtRecord.extraPayAmount,
    userId: debtRecord.userId,
  }));

  await prisma.financialRecord.createMany({
    data: dataForCreation,
    skipDuplicates: true,
  });

  try {
    const recordsResponse = await allUserFinancialRecords(userId, dataForCreation);
    if ("error" in recordsResponse) {
      return new Response(
        JSON.stringify({ message: "Record Created Successfully." }),
        { status: 201 }
      );
    }
    const saveTasks = recordsResponse.flatMap((record) => {
      const dataToCreate = record.data.map((payment: any) => {
        return {
          FinancialRecordId: record.id,
          title: record.title,
          extraPayAmount: record.extraPayAmount,
          paymentDate: new Date(payment.currentDate),
          monthlyInterestPaid: payment.monthlyInterestPaid,
          monthlyPayment: payment.monthlyPayment,
          remainingBalance: payment.remainingBalance,
          minPayAmount: record.minPayAmount,
        }})

      return prisma.paymentSchedule.createMany({
        data: dataToCreate,
        skipDuplicates: true
      })
  });
    try {
      // Execute all save operations in parallel
      await Promise.all(saveTasks);
      let waitForResult = await snowBallPaymentScheduleCalculator(userId);
      waitForResult;
      return new Response(JSON.stringify(recordsResponse));
    } catch (error) {
      console.error("Error saving financial records:", error);
      // Handle the error by returning or logging
      return new Response(
        JSON.stringify({
          error: "Failed when trying to save financial records.",
        }),
        { status: 400 }
      );
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    // return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    console.error("Error in POST function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
