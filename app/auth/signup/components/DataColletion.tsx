"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const buttonLabels = [
    "I want to be debt free",
    "I want to build wealth",
    "I want to meet a financial coach",
    "I want to feel in control",
    "I want to join a money community",
    "I'm just curious!",
];

const options = [
    "Be debt free",
    "Build wealth",
    "Meet a financial coach",
    "Feel in control",
    "Join a community",
    "Just curious"
]

export default function DataCollection() {
    const router = useRouter();
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const axiosAuth = useAxiosAuth();

    // Handle the clicking
    const handleOptionClick = (index: number): void => {
        if (selectedOptions.includes(index)) {
            setSelectedOptions(selectedOptions.filter((i) => i !== index));
        } else {
            setSelectedOptions([...selectedOptions, index]);
        }
    };

    const handleExploreClick = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError("");
            const priority = selectedOptions.map(index => options[index]);
            if (priority.length === 0) {
                setError("Please pick one before exploring the app! Thanks!");
                setIsLoading(false);
                return;
            }
            await axiosAuth.post(
                `${API_URL}/user/priority/create`,
                { priority: priority }
            );
            router.push("/dashboard/debts");
        } catch (err: AxiosError | any) {
            console.log(err.message);
            setError(err.response.data);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center mt-[-5rem] mb-20">
            <div className="flex flex-col justify-center items-center">
                <div className="text-center items-center mt-9">
                    <h1 className="text-neutral-800 text-xl font-semibold leading-loose mb-[8px] w-[264px] [font-family:'Poppins-SemiBold',Helvetica]">
                        {"Before jumping in, let's explore why you're here"}
                    </h1>
                    <p className="text-neutral-400 text-base leading-snug max-w-[260px] [font-family:'Poppins-Regular',Helvetica] mx-auto font-light">
                        {"Select your top priorities below:"}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-7">
                {buttonLabels.map((label, index) => (
                    <button
                        key={index}
                        className={`${selectedOptions.includes(index)
                            ? "bg-[#8833ff] text-white"
                            : "bg-white text-black"
                            } font-semibold text-base py-3 rounded-lg w-[265px] drop-shadow-xl border border-[#d2daff]`}
                        onClick={() => handleOptionClick(index)}
                    >
                        {label}
                    </button>
                ))}

                {error && <p className="text-left text-sm text-red-500">{error}</p>}

                <button
                    className={`${isLoading ? "bg-gray-500" : "bg-[#8833ff]"} font-semibold text-white text-base py-3 rounded-xl transition-all duration-200 ease-in-out w-[343px] mt-6`}
                    disabled={isLoading}
                    onClick={handleExploreClick}
                >
                    {isLoading ? "Loading..." : "Start Exploring App"}
                </button>
            </div>
        </div >
    );
};
