import { verifyJwt } from "@/lib/jwt";
import { limiter } from "@/lib/limiter";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { StepThreeInfo, StepTwoPayments, allUserFinancialRecords, extraPaymentGraph, paymentGraphForStepTwo, snowBallData } from "../utils";
import { PayScheduleData } from "../interface";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const remaining = await limiter.removeTokens(1);
    const queryParams = new URL(request.url).searchParams;
    let recordsResponse;

    try {
        recordsResponse = await allUserFinancialRecords(params.id);

        console.log(recordsResponse);
    } catch (error) {
        console.error("Error fetching financial records:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch financial records" }), { status: 500 });
    }

    const accessToken = request.headers.get("Authorization");

    if (remaining < 0) {
        return new NextResponse(null, {
            status: 429,
            statusText: "Too many requests",
        });
    }

    if (!accessToken || !verifyJwt(accessToken)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const userExists = await prisma.user.findUnique({
        where: { id: params.id },
    });

    if (!userExists) {
        return new Response(JSON.stringify({ error: "User does not exist" }), { status: 401 });
    }


    try {
        if (queryParams.toString() === "") {
            return new Response(JSON.stringify("Invalid Request"), { status: 400 });
        }

        if (queryParams.get('graph') === 'no_extra_pay_graph') {
            let combinedRecord = await paymentGraphForStepTwo(recordsResponse as PayScheduleData[]);
            return new Response(JSON.stringify(combinedRecord), { status: 200 });
        }

        if (queryParams.get('graph') === 'extra_pay_graph') {

            let combinedRecord = await extraPaymentGraph(params.id)
            return new Response(JSON.stringify(combinedRecord));
        }

        if (queryParams.get('graph') === 'dashboard') {
            return await snowBallData(params.id);
        }

        if (queryParams.get('step') === '3')  {
            return await StepThreeInfo(params.id);
        }

        if (queryParams.get('step') === '2')  {
            return await StepTwoPayments(params.id);
        }

        return new Response(JSON.stringify({ error: "Invalid query parameter" }), { status: 400 });
        
    } catch (error) {
        console.log("Error", error);
        return new Response(JSON.stringify({ error: "An unexpected error occurred" }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
