import { signJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
    email: string;
    password: string;
}
export async function POST(request: Request) {
    const body: RequestBody = await request.json();

    const user = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    });

    try {
        if (user && user.password && (await bcrypt.compare(body.password, user.password))) {
            const { password, ...userWithoutPass } = user;
            const accessToken = signJwtAccessToken(userWithoutPass);
            const result = {
                ...userWithoutPass,
                accessToken,
            };
            return new Response(JSON.stringify(result));
        } else {
            return new Response(
                JSON.stringify({
                    error: "unauthorized",
                }),
                {
                    status: 401,
                }
            );
        };

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
    finally {
        await prisma.$disconnect();
    }
}