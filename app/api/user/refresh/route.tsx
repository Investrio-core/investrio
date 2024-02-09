import axios from "axios";
import { signJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
    email: string;
    password: string;
}
export async function POST(request: Request) {
    try {
        console.log('object');
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/refresh`, {}, {withCredentials: true})

        console.log(response.data);

        const token = response?.data?.accessToken;

        if (token) {
            return new Response(JSON.stringify({accessToken: token}))
        }
        
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}