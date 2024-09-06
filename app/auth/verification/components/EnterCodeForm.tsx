"use client";
import { useState, useEffect } from "react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { VerificationType } from '@prisma/client';
import { useRouter } from "next/navigation";


interface Dictionary<T> {
    [key: string]: T;
}

const DESTINATION: Dictionary<string> = {
    signup: "/auth/signup/completion",
    passwordReset: "/auth/resetPassword",
    updateProfile: "/profile"
}

interface Props {
    email: string;
    type: string;
    updateData?: any;
}

export default function EnterCodeForm({
    email,
    type,
    updateData
}: Props) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const ONE_MINUTE = 60;
    const axiosAuth = useAxiosAuth();
    const router = useRouter();

    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
    const [resendCountdown, setResendCountdown] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>("");

    const handleResendClick = async () => {
        try {
            setIsLoading(true);
            setError("");
            await axiosAuth.post(
                `${API_URL}/user/send-verification`,
                { email: email, type: type }
            );

            setIsResendDisabled(true);
            setResendCountdown(ONE_MINUTE);
        } catch (err: AxiosError | any) {
            console.log(err.message);
            setError(err.response.data);
        } finally {
            setIsLoading(false);
        }
    }

    const handleVerificationClick = async (data: {
        email: string,
        type: VerificationType,
        token: string
    }) => {
        try {
            setIsLoading(true);
            setError("");
            const response = await axiosAuth.post(`${API_URL}/user/verify-token`, data);
            if (response.status === 200) {
                if (type === "updateProfile") {
                    const response = await axiosAuth.post(`${API_URL}/user/update-profile`, updateData);
                    if (response.status === 200) {
                        toast.success("Profile updated");
                    }
                } else if (type === "passwordReset") {
                    const modifyToken = response.data.token;
                    sessionStorage.setItem('passwordData', JSON.stringify({ email: data.email, modifyToken: modifyToken }));
                } else {
                    toast.success("Verified Successfully!");
                }
                sessionStorage.removeItem('userData');
                router.push(DESTINATION[type]);
            }
        } catch (err: AxiosError | any) {
            setError(err.response.data);
        } finally {
            setIsLoading(false);
        }
    }

    // Set up the timer for resend
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isResendDisabled && resendCountdown > 0) {
            timer = setTimeout(() => {
                setResendCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (resendCountdown === 0) {
            setIsResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown, isResendDisabled]);

    return (
        <>
            <div className="items-center flex flex-col justify-center mb-4">
                <h2 className="w-full text-center text-neutral-800 text-[25px] font-bold leading-[42px] mb-[1rem] mt-[-2rem]">
                    Please verify the email first.
                </h2>

                <p className="w-[326px] text-center text-[#858699] text-lg font-light leading-snug mb-[4rem]">
                    {`We sent a 6-digit verification code to your email: `}
                    <span className="font-bold text-black">{email}</span>
                    {`. Please check your inbox and enter the code in 10 minutes`}
                </p>
            </div>

            <div className="items-center">
                <div className="mb-[3rem]">
                    <input
                        className="input input-bordered join-item w-full h-12 mt-1 rounded-xl"
                        placeholder="Verification code"
                        value={accessToken ? accessToken : undefined}
                        onChange={(e) => setAccessToken(e.target.value)}
                    />

                </div>

                {error && <p className="text-left text-sm text-red-500">{error}</p>}

                <div className="form-control mt-6 mb-3">
                    <button
                        type="submit"
                        className={`font-semibold text-white text-center text-base py-3 rounded-xl transition-all duration-200 ease-in-out w-full ${isLoading ? 'bg-gray-500' : 'bg-[#8833ff]'
                            }`}
                        disabled={isLoading}
                        onClick={() => handleVerificationClick({ email: email, type: type as VerificationType, token: accessToken })}
                    >
                        {isLoading ? "Loading..." : "Verify the Code"}
                    </button>
                </div>

                <div className="form-control mt-2">
                    <button
                        className={`font-semibold text-center text-base py-3 rounded-xl transition-all duration-200 ease-in-out w-full ${isResendDisabled ? 'text-gray-500' : 'text-[#8833ff]'
                            }`}
                        onClick={handleResendClick}
                        disabled={isResendDisabled}
                    >
                        {isResendDisabled ? `Resend the link (${resendCountdown}s)` : 'Resend the link'}
                    </button>
                </div>
            </div>
        </>
    );
}