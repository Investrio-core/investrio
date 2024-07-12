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
    <div className="flex flex-col justify-center align-center justify-self-center self-center">
      <Image src={headerImage} alt={title} width={333} height={250} />
      <div>
        <h1 className="w-[327px] text-center text-neutral-800 text-[28px] font-bold leading-[42px] mb-[8px]">
          {title}
        </h1>
        <p className="w-[326px] text-center text-neutral-400 text-base font-normal leading-snug">
          {body}
        </p>
      </div>
    </div>
  );
}
