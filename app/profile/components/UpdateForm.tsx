"use client"
import Form from "@/app/components/ui/Form";
import { Switch } from "@mui/material";
import 'react-phone-number-input/style.css'
import PhoneInput, { type Value } from 'react-phone-number-input'


interface Props {
    onSubmit: (data: { name: string; email: string; phoneNumber: Value | undefined }) => void;
    error: string;
    isLoading: boolean;
    userName: string;
    setUserName: Function;
    userEmail: string;
    setUserEmail: Function;
    userPhoneNumber: Value | undefined;
    setUserPhoneNumber: (value?: Value | undefined) => void;
    showNotifications: boolean;
    setShowNotifications: Function;
    setWindowOpen: Function;
    loginType: string;
}

export default function UpdateForm({
    onSubmit,
    error,
    isLoading,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    userPhoneNumber,
    setUserPhoneNumber,
    showNotifications,
    setShowNotifications,
    setWindowOpen,
    loginType
}: Props) {

    const handleToggle = () => {
        setShowNotifications(!showNotifications);
    };

    const handleWindowOpen = () => {
        setWindowOpen(true);
    }
    return (
        <>
            <div>
                <div className="mb-5">
                    <label className="text-left">
                        <span
                            className={"label-text text-md font-semibold text-black"}
                        >
                            Full Name
                        </span>
                    </label>
                    <input
                        type="name"
                        placeholder={userName}
                        value={loginType !== "google" ? userName : undefined}
                        onChange={loginType !== "google" ? (e) => setUserName(e.target.value) : undefined}
                        disabled={loginType === "google"}
                        name="name"
                        className="input input-bordered join-item w-full h-12 mt-1 rounded-xl"
                    />
                </div>

                <div className="mb-5">
                    <label className="text-left">
                        <span
                            className={"label-text text-md font-semibold text-black"}
                        >
                            Email
                        </span>
                    </label>
                    <input
                        type="email"
                        placeholder={userEmail}
                        value={loginType !== "google" ? userEmail : undefined}
                        onChange={loginType !== "google" ? (e) => setUserEmail(e.target.value) : undefined}
                        disabled={loginType === "google"}
                        name="email"
                        className="input input-bordered join-item w-full h-12 mt-1 rounded-xl"
                    />
                </div>

                <div className="mb-10">
                    <label className="text-left">
                        <span
                            className={"label-text text-md font-semibold text-black"}
                        >
                            Phone Number
                        </span>
                    </label>
                    <PhoneInput
                        value={userPhoneNumber ? userPhoneNumber : ""}
                        defaultCountry="US"
                        onChange={setUserPhoneNumber}
                        className="input input-bordered join-item w-full h-12 mt-1 rounded-xl"
                        placeholder={userPhoneNumber ? userPhoneNumber : "Your phone number"}
                    />
                </div>

                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                        <img
                            src="/icons/bell.svg"
                            alt="Bell Icon"
                            className="h-7 w-7 mr-2"
                        />
                        <label className="mr-2 text-base font-light text-gray-700">Show Notifications</label>
                    </div>
                    <Switch
                        defaultChecked={false}
                        checked={showNotifications}
                        onChange={handleToggle}
                        sx={{
                            height: 40,
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: "#8833FF",
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: "#F2F2F5",
                            },
                        }} />
                </div>

                {error && <p className="text-left text-sm text-red-500">{error}</p>}

                <div className="form-control mt-12">
                    <button
                        type="submit"
                        className="btn btn-primary capitalize text-base text-white w-full font-light"
                        disabled={isLoading}
                        style={{
                            borderRadius: "12px",
                        }}
                        onClick={() => onSubmit({ name: userName, email: userEmail, phoneNumber: userPhoneNumber })}
                    >
                        {isLoading ? "Loading..." : "Update"}
                    </button>
                </div>
            </div>

            <div className="form-control mt-6">
                <button
                    onClick={handleWindowOpen}
                    className=" text-red-500 w-full font-light text-base"
                    style={{
                        borderRadius: "12px",
                    }}
                >
                    Logout
                </button>
            </div>
        </>
    );
}
