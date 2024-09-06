"use client";

import { useEffect, useState } from "react";
import OnboardingIntroStep, {
  OnboardingIntroStepProps,
} from "./OnboardingIntroStep";
import StepsController from "./StepsController";
import { IoMdClose } from "react-icons/io";

const ONBOARDING_STEPS_DATA: OnboardingIntroStepProps[] = [
  {
    headerImage: "/images/steps-image-1.svg",
    title: "Money with Guidance",
    body: "We get it. Student loans, credit cards, big goals or small. Investrio is here to be your financial copilot, helping you navigate your way to a brighter future.",
  },
  {
    headerImage: "/images/steps-image-2.svg",
    title: "Tech + Humans",
    body: "Investrio personalizes a financial journey just for you. Whether you're saving for a dream vacation or planning for retirement, we'll guide you every step of the way.",
  },
  {
    headerImage: "/images/steps-image-3.svg",
    title: "Simple and Easy",
    body: "Investrio breaks down your money goals into bite-sized pieces. We'll connect you with the right tools and resources to get started, so you can focus on what’s important.",
  },
];

const NUM_STEPS = ONBOARDING_STEPS_DATA.length;

interface Props {
  showSteps: boolean;
  setShowSteps: Function;
}

export default function OnboardingIntroSteps({
  showSteps,
  setShowSteps,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  //   const [showSteps, setShowSteps] = useState(true);

  useEffect(() => {
    if (currentStep === NUM_STEPS) {
      setShowSteps(false);
    }
  }, [currentStep]);

  if (!showSteps || currentStep === NUM_STEPS) return <></>;

  return (
    <>
      {/* <IoMdClose
        className="mask mask-pentagon group-hover:bg-primary p-4 shadow transition text-slate-500"
        size={60}
        style={{ position: "absolute", top: 0, right: 0, cursor: "pointer" }}
        onClick={() => setShowSteps(false)}
      /> */}

      <div className="flex flex-col justify-center align-center">
        <OnboardingIntroStep {...ONBOARDING_STEPS_DATA[currentStep]} />
        <StepsController
          // setPrev={() =>
          //   setCurrentStep((prevState) => {
          //     if (prevState === 0) return 0;
          //     return prevState - 1;
          //   })
          // }
          // setSkip={() => setShowSteps(false)}
          // renderLastNext

          setNext={() => setCurrentStep((prevState) => prevState + 1)}
          currentStep={currentStep}
          numSteps={NUM_STEPS}
          classes={`mt-[60px]`}
          registerFlow={true}
        />
      </div>
    </>
  );
}
