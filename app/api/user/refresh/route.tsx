import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {

        const refreshToken = cookies().get('refreshToken')
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/refresh`, {}, { headers: {Cookie: `refreshToken=${refreshToken?.value}`}})

        const token = response?.data?.accessToken;

        if (token) {
            return new Response(JSON.stringify({accessToken: token}))
        }
        
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}