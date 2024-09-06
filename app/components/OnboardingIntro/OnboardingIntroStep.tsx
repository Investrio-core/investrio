import Image from "next/image";

export interface OnboardingIntroStepProps {
  headerImage: string; //{ src: string; height: number; width: number };
  title: string;
  body: string;
}

export default function OnboardingIntroStep({
  headerImage,
  title,
  body,
}: OnboardingIntroStepProps) {
  return (
    <div className="flex flex-col justify-center align-center justify-self-center self-center mt-[-2rem]">
      <Image src={headerImage} alt={title} width={333} height={250} className="mb-7" />
      <div>
        <h1 className="w-full text-center text-neutral-800 text-[33px] font-bold leading-[42px] mb-[10px]">
          {title}
        </h1>
        <p className="w-[326px] text-center text-[#858699] text-lg font-light leading-snug">
          {body}
        </p>
      </div>
    </div>
  );
}
