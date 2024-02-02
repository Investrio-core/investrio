import { verifyJwt } from "@/lib/jwt";
import { limiter } from "@/lib/limiter";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const remaining = await limiter.removeTokens(1);
  const { id: userId } = params;

  const accessToken = request.headers.get("Authorization");

  if (remaining < 0) {
    return new NextResponse(null, {
      status: 429,
      statusText: "Too many requests",
    });
  }

  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userExists = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!userExists) {
    return new Response(JSON.stringify({ error: "User does not exist" }), {
      status: 401,
    });
  }

  try {
    const res = await prisma.$transaction(
      [
        prisma.paymentSchedule.deleteMany({
          where: { userId: userId } 
        }),
        prisma.snowballPaymentSchedule.deleteMany({
          where: { userId: userId },
        }),
        prisma.financialRecord.deleteMany({ 
          where: { userId: userId },
        }),
      ],
    );

    return new Response(JSON.stringify(res), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
