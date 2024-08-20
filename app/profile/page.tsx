"use client";

import PageHeader from "@/app/components/Layout/PageHeader";
import { useSession, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import UpdateForm from "./components/UpdateForm";
import UpdateHandle from "./components/UpdateHandle";
import LogoutWindow from "./components/LogoutWindow";
import { AxiosError } from "axios";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useRouter } from "next/navigation";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileData {
    name: string;
    email: string;
    phoneNumber: string | null;
    loginType: string;
}

export default function Profile() {
    const { data } = useSession();
    const { user } = data!;
    const { image } = user;
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isWindowOpen, setWindowOpen] = useState<boolean>(false);
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axiosAuth.get(`${API_URL}/user/profile`);
                setProfileData(response.data);
            } catch (err: AxiosError | any) {
                console.error("Error fetching profile data:", err.message);
                setError("Failed to load profile data.");
            }
        };
        fetchProfileData();
    }, [axiosAuth]);

    async function onSubmit(data: {
        name: string;
        email: string;
        phoneNumber: string;
    }) {
        try {
            setIsLoading(true);
            setError("");
            await axiosAuth.post(`${API_URL}/user/update-profile`, data);
            window.location.reload();
        } catch (err: AxiosError | any) {
            console.log(err.message);
            setError(err.response.data);
        } finally {
            setIsLoading(false);
        }
    }

    if (!profileData) {
        return null;
    }

    return (
        <>
            <div>
                <div className="text-center">
                    <h2 className="text-base/[30px] font-semibold mb-2">My Profile</h2>
                </div>

                <div>
                    <Image
                        className="rounded-[50%] mb-8 mx-auto"
                        src={image || "/logo.svg"}
                        alt={"profile image"}
                        width={80}
                        height={80}
                    />

                    {/* <UpdateHandle /> */}

                    <UpdateForm
                        onSubmit={onSubmit}
                        error={error}
                        isLoading={isLoading}
                        userName={profileData!.name}
                        userEmail={profileData!.email}
                        userPhoneNumber={profileData!.phoneNumber}
                        showNotifications={showNotifications}
                        setShowNotifications={setShowNotifications}
                        setWindowOpen={setWindowOpen}
                        loginType={profileData!.loginType}
                    />
                </div>

                <LogoutWindow
                    isWindowOpen={isWindowOpen}
                    setWindowOpen={setWindowOpen}
                />
            </div>
        </>
    );
}