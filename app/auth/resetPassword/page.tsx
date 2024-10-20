"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import { toast } from "react-toastify";
import Form from "@/app/components/ui/Form";


const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function ResetPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [modifyToken, setModifyToken] = useState<string>('');
    const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const passwordData = sessionStorage.getItem('passwordData');
        if (!passwordData) {
            router.push('/auth/login');
        } else {
            const parsedPasswordData = JSON.parse(passwordData);
            setEmail(parsedPasswordData.email || '');
            setModifyToken(parsedPasswordData.modifyToken || '');
        }
        setIsPageLoading(false);
    }, [router]);

    async function onSubmit(data: { password: string, repeatPassword: string }) {
        try {
            setError("");
            setIsLoading(true);
            if (data.password !== data.repeatPassword) {
                console.log(data.password);
                console.log(data.repeatPassword);
                setError("Two passwords are not the same");
            } else {
                if (data.password.length < 8) {
                    setError("Your password must be at least 8 characters long.");
                    return;
                }
                const response = await axios.post(
                    `${API_URL}/user/update-password`,
                    { email: email, password: data.password, modifyToken: modifyToken }
                );
                if (response.status === 200) {
                    toast.success("Reset Successfully!");
                    router.push('/auth/login');
                    sessionStorage.removeItem('passwordData');
                }
            }
        } catch (err: AxiosError | any) {
            setError(err.response.data);
        } finally {
            setIsLoading(false);
        }
    }

    if (isPageLoading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="items-center">
                <Image
                    src="/images/logo.svg"
                    alt="Investrio"
                    width={225}
                    height={53}
                    className={"mx-auto size-64 mt-[-1rem]"}
                />
            </div>

            <div className="items-center flex flex-col justify-center mb-2">
                <h2 className="w-full text-center text-neutral-800 text-[25px] font-bold leading-[42px] mb-[1rem] mt-[-2rem]">
                    Reset your email.
                </h2>

                <p className="w-[326px] text-center text-[#858699] text-lg font-light leading-snug mb-[1rem]">
                    Please create & confirm your new password.
                </p>
            </div>

            <Form onSubmit={onSubmit}>
                <div className="flex flex-col gap-5 mt-7">
                    <div className="mb-2">
                        <Input
                            label="Password"
                            name="password"
                            required
                            placeholder="Password"
                            type="password"
                            labelStyles={"text-xs"}
                        />
                    </div>

                    <div className="mb-11">
                        <Input
                            label="Confirm password"
                            name="repeatPassword"
                            required
                            placeholder="Confirm your password"
                            type="password"
                            labelStyles={"text-xs"}
                        />
                    </div>

                    {error && <p className="text-left text-sm text-red-500">{error}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary capitalize text-base/[16px] text-white mt-6"
                        disabled={isLoading}
                        style={{
                            borderRadius: "12px",
                        }}
                    >
                        {isLoading ? "Loading..." : "Reset Password"}
                    </button>
                </div>

            </Form>


        </>
    );
}