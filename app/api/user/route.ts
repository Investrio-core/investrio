import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import * as yup from "yup";
import { Prisma } from '@prisma/client';


interface RequestBody {
    name: string;
    email: string;
    password: string;
}

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
});


function handleError(error: Error | Prisma.PrismaClientKnownRequestError) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return new Response(JSON.stringify({ error: 'Email already exists' }), { status: 400 });
        }
    } else if (error.message === 'Invalid input') {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    console.error(error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
}

export async function POST(request: Request) {
    try {
        const body: RequestBody = await request.json();
        await schema.validate(body);

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: await bcrypt.hash(body.password, 10),
            },
        });

        const { password, ...result } = user;
        return new Response(JSON.stringify(result), { status: 201 });
    } catch (error: any) {
        if (error instanceof Error) {
            return handleError(error);
        } else {
            console.error('An unexpected error occurred:', error);
            return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
        }
    } finally {
        await prisma.$disconnect();
    }
}