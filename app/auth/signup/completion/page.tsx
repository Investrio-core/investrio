"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import CompletionInstruction from '../components/CompletionInstruction';
import DataCollection from "../components/DataColletion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { clearSession } from "@/app/utils/session";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupCompletionPage() {
    const session = useSession();
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const [showCompletion, setShowCompletion] = useState<boolean>(true);
    const [loadPage, setLoadPage] = useState<boolean | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const handleSession = async () => {
            if (session.status === "unauthenticated") {
                router.push("/auth/login");
            } else if (session.status === "authenticated") {
                try {
                    const { data } = await axiosAuth.get(`${API_URL}/user/priority`);
                    if (data?.priority.length !== 0) {
                        setLoadPage(false);
                    } else {
                        setLoadPage(true);
                    }
                } catch (error: any) {
                    setError("Failed to retrieve priority information.");
                    setLoadPage(null);
                    clearSession();
                }
            }
        };
        handleSession();
    }, [session, router]);

    useEffect(() => {
        if (loadPage === false) {
            router.push("/dashboard");
        }
    }, [loadPage, router])

    if (session.status === "loading" || !session?.data?.user) {
        return null;
    }

    return (
        <>
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
            {loadPage === true ? <>
                <Image
                    src="/images/logo.svg"
                    alt="Investrio"
                    width={225}
                    height={53}
                    // className={`mx-auto pb-[12px] ${showSteps ? "mt-[0px]" : "mt-[20px]"}`}
                    className={"mx-auto size-64 mt-[-2rem]"}
                />

                {showCompletion ?
                    <CompletionInstruction
                        showCompletion={showCompletion}
                        setShowCompletion={setShowCompletion}
                    /> : <DataCollection />
                }
            </> : null}
        </>
    );
}