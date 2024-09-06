"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import UpdateForm from "./components/UpdateForm";
import LogoutWindow from "./components/LogoutWindow";
import { AxiosError } from "axios";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { isValidPhoneNumber, type Value } from 'react-phone-number-input'
import { toast } from "react-toastify";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileData {
    name: string;
    email: string;
    phoneNumber: string | null;
    loginType: string;
}

export default function Profile() {
    const axiosAuth = useAxiosAuth();
    const { data } = useSession();
    const { user } = data!;
    const { image } = user;
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPhoneNumber, setUserPhoneNumber] = useState<Value | undefined>("" as Value);
    const [isWindowOpen, setWindowOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axiosAuth.get(`${API_URL}/user/profile`);
                setProfileData(response.data);
                setUserName(response.data.name);
                setUserEmail(response.data.email);
                setUserPhoneNumber(response.data.phoneNumber ? response.data.phoneNumber as Value : undefined);
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
        phoneNumber: Value | undefined;
    }) {
        try {
            setIsLoading(true);
            setError("");
            if (!isValidPhoneNumber(data.phoneNumber!)) {
                setError("Phone Number is invalid");
            } else {
                const updateData = { ...data, phoneNumber: data.phoneNumber as string }
                const response = await axiosAuth.post(`${API_URL}/user/update-profile`, updateData);
                if (response.status === 200) {
                    toast.success("Profile updated");
                }
            }
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

                    <UpdateForm
                        onSubmit={onSubmit}
                        error={error}
                        isLoading={isLoading}
                        userName={userName}
                        setUserName={setUserName}
                        userEmail={userEmail}
                        setUserEmail={setUserEmail}
                        userPhoneNumber={userPhoneNumber}
                        setUserPhoneNumber={setUserPhoneNumber}
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