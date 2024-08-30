"use client";

import { useState } from 'react';
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { AxiosError } from "axios";


interface Props {
    email: string;
    type: string;
    setEmail: Function;
}

export default function EnterEmailForm({
    email,
    type,
    setEmail
}: Props) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const axiosAuth = useAxiosAuth();
    const [inputEmail, setInputEmail] = useState<string>(email);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleClick = async (data: { newEmail: string }) => {
        try {
            setIsLoading(true);
            setError("");
            await axiosAuth.post(
                `${API_URL}/user/send-verification`,
                { email: data.newEmail, type: type }
            );
        } catch (err: AxiosError | any) {
            console.log(err.message);
            setError(err.response.data);
        } finally {
            setIsLoading(false);
        }
        setEmail(data.newEmail);
    }

    return (
        <>
            <div className="items-center flex flex-col justify-center mb-4">
                <h2 className="w-full text-center text-neutral-800 text-[25px] font-bold leading-[42px] mb-[1rem] mt-[-2rem]">
                    Please verify the email first.
                </h2>

                <p className="w-[326px] text-center text-[#858699] text-lg font-light leading-snug mb-[4rem]">
                    Please enter your email below.
                </p>
            </div>

            <div className="items-center">
                <div className="mb-[3rem]">
                    <input
                        className="input input-bordered join-item w-full h-12 mt-1 rounded-xl"
                        type="email"
                        placeholder="Your email"
                        value={inputEmail ? inputEmail : undefined}
                        onChange={(e) => setInputEmail(e.target.value)}
                    />
                </div>

                {error && <p className="text-left text-sm text-red-500">{error}</p>}

                <div className="form-control mt-6 mb-3">
                    <button
                        type="submit"
                        className={`font-semibold text-white text-center text-base py-3 rounded-xl transition-all duration-200 ease-in-out w-full ${isLoading ? 'bg-gray-500' : 'bg-[#8833ff]'
                            }`}
                        onClick={() => handleClick({ newEmail: inputEmail })}
                    >
                        {isLoading ? "Loading..." : "Confirm"}
                    </button>
                </div>

            </div>


        </>
    );
}