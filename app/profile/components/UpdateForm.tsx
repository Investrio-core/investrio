"use client"
import Form from "@/app/components/ui/Form";
import { Switch } from "@mui/material";

interface Props {
    onSubmit: (data: { name: string; email: string; phoneNumber: string }) => void;
    error: string;
    isLoading: boolean;
    userName: string;
    userEmail: string;
    userPhoneNumber: string | null;
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
    userEmail,
    userPhoneNumber,
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
            <Form onSubmit={onSubmit} className="w-full">
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
                    <input
                        type="phone"
                        placeholder={userPhoneNumber ? userPhoneNumber : "Your phone number"}
                        name="phoneNumber"
                        className="input input-bordered join-item w-full h-12 mt-1 rounded-xl"
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
                    >
                        {isLoading ? "Loading..." : "Update"}
                    </button>
                </div>
            </Form>
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