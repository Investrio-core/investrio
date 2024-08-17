"use client";

import { OnboardingIntroStepProps } from "@/app/components/OnboardingIntro/OnboardingIntroStep";
import Image from "next/image";

interface Props {
    showCompletion: boolean;
    setShowCompletion: Function;
}

const COMPLETION_DATA: OnboardingIntroStepProps = {
    headerImage: "/images/completion-image.svg",
    title: "All Done!",
    body: "You're now ready to explore and enjoy all the features and benefits we have to offer."
}


export default function CompletionInstruction({
    showCompletion,
    setShowCompletion
}: Props) {

    const toggleShowCompletion = () => {
        setShowCompletion((prevState: boolean) => !prevState);
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
                <Image src={COMPLETION_DATA.headerImage} alt={COMPLETION_DATA.title} width={179} height={177} />
                <div className="text-center items-center mt-9">
                    <h1 className="text-neutral-800 text-[28px] font-bold leading-[42px] mb-[8px]">
                        {COMPLETION_DATA.title}
                    </h1>
                    <p className="text-neutral-400 text-base leading-snug max-w-[260px] mx-auto font-light">
                        {COMPLETION_DATA.body}
                    </p>
                </div>
            </div>
            <button className="all-[unset] box-border flex w-[343px] h-12 items-center justify-center gap-2.5 px-6 py-3 bg-[#8833ff] rounded-xl mt-40">
                <div
                    className="relative w-fit font-semibold text-white text-base text-center tracking-[-0.32px] leading-6 whitespace-nowrap"
                    onClick={toggleShowCompletion}
                >
                    Start Exploring App
                </div>
            </button>
        </div>
    );
} 