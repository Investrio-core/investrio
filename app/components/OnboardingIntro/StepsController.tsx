import Image from "next/image";
import { StandardButton } from "../ui/buttons";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  setNext: Function;
  setPrev?: Function;
  setSkip?: Function;
  currentStep: number;
  numSteps: number;
  useButton?: boolean;
  renderLastNext?: boolean;
  classes?: string;
  content?: JSX.Element;
  stepsIterator?: number[];
  renderDirection?: "horizontal" | "vertical";
  registerFlow?: boolean;
}

function StepsControllerVertical({
  setNext,
  setPrev,
  setSkip,
  currentStep,
  numSteps,
  useButton = false,
  renderLastNext = false,
  classes = "",
  content,
  stepsIterator,
}: Props) {
  const renderNext = currentStep < numSteps - 1;
  return (
    <div
      className={classes}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        justifySelf: "center",
      }}
    >
      <div className="justify-center align-center items-start gap-[4px] flex">
        {stepsIterator &&
          stepsIterator.map((discard, idx) => (
            <Image
              src={`${
                idx === currentStep
                  ? "/images/step-selected-green.svg"
                  : "/images/step-unselected-green.svg"
              }`}
              key={`step-${idx}`}
              alt={"step"}
              width={16}
              height={16}
            />
          ))}
      </div>
      <div>{content}</div>
      <div className="w-[100%] flex justify-center align-center">
        {currentStep < numSteps - 1 || renderLastNext ? (
          <div
            // className={`btn btn-primary text-right text-zinc-800 text-lg font-medium leading-7 cursor-pointer w-[100%] mt-[45px]`}
            className={
              "mt-[30px] w-[100%] mx-[8px] h-12 py-2 bg-[#8833ff] mx-[12px] rounded-lg justify-center items-center gap-2.5 inline-flex"
            }
            style={{
              borderRadius: "12px",
              position: "relative",
              top: "-10px",
            }}
            onClick={() => setNext()}
          >
            <div className="text-center text-white text-base font-semibold leading-normal">
              Next
            </div>
          </div>
        ) : null}
        {setPrev && currentStep !== 0 && !renderNext ? (
          <div
            // className="btn btn-primary text-left text-zinc-800 text-lg font-medium leading-7 cursor-pointer w-[100%] mt-[45px]"
            className={
              "mt-[30px] w-[100%] mx-[8px] h-12 py-2 bg-[#8833ff] mx-[12px] rounded-lg justify-center items-center gap-2.5 inline-flex"
            }
            style={{
              borderRadius: "12px",
              position: "relative",
              top: "-10px",
            }}
            onClick={() => setPrev()}
          >
            <div className="text-center text-white text-base font-semibold leading-normal">
              Previous
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function StepsController({
  setNext,
  setPrev,
  setSkip,
  currentStep,
  numSteps,
  useButton = false,
  renderLastNext = false,
  classes = "",
  renderDirection = "horizontal",
  content,
  registerFlow = false,
}: Props) {
  const router = useRouter();
  const stepsIterator = Array(numSteps).fill(0);

  if (renderDirection === "vertical") {
    return (
      <StepsControllerVertical
        setNext={setNext}
        setPrev={setPrev}
        setSkip={setSkip}
        currentStep={currentStep}
        numSteps={numSteps}
        renderLastNext={renderLastNext}
        stepsIterator={stepsIterator}
        content={content}
        classes={classes}
      />
    );
  }

  let nextButton = useButton ? (
    <button
      className={`btn btn-primary mt-4 capitalize text-base/[14px]`}
      style={{
        borderRadius: "12px",
        position: "relative",
        top: "-10px",
      }}
      onClick={() => setNext()}
    >
      Next
    </button>
  ) : (
    <div
      className="text-right text-zinc-800 text-lg font-medium leading-7 cursor-pointer"
      onClick={() => setNext()}
    >
      Next
    </div>
  );

  if (registerFlow) {
    nextButton = currentStep < numSteps - 1 ? (
      <button
        className="bg-[#8833ff] font-semibold text-white text-center text-base py-3 rounded-xl transition-all duration-200 ease-in-out w-full mt-6"
        onClick={() => setNext()}
      >
        Get Started
      </button>
    ) : (
      <div className="flex gap-5">
        <button
          className="bg-[#8833ff] font-semibold text-white text-center text-base py-3 rounded-xl transition-all duration-200 ease-in-out w-full mt-6"
          onClick={() => router.push("/auth/signup")}
        >
          Register
        </button>
        <button
          className="bg-[#8833ff] font-semibold text-white text-center text-base py-3 rounded-xl transition-all duration-200 ease-in-out w-full mt-6"
          onClick={() => setNext()}
        >
          Log In
        </button>
      </div>
    );
  }
  
  return (
    <div
      className={classes}
      style={
        !registerFlow
          ? {
              display: "flex",
              width: "295px",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "center",
              justifySelf: "center",
            }
          : {}
      }
    >
      {currentStep === 0 && setSkip ? (
        <div
          className="text-neutral-400 text-lg font-medium leading-7 cursor-pointer"
          onClick={() => (setSkip ? setSkip() : undefined)}
        >
          Skip
        </div>
      ) : null}
      {setPrev && currentStep !== 0 ? (
        <div
          className="text-left text-zinc-800 text-lg font-medium leading-7 cursor-pointer"
          onClick={() => setPrev()}
        >
          Previous
        </div>
      ) : null}
      <div className="justify-center align-center items-start gap-[4px] flex">
        {stepsIterator.map((discard, idx) => (
          <Image
            src={`${
              idx === currentStep
                ? "/images/step-selected-green.svg"
                : "/images/step-unselected-green.svg"
            }`}
            key={`step-${idx}`}
            alt={"step"}
            width={16}
            height={16}
          />
        ))}
        {!registerFlow && (currentStep < numSteps - 1 || renderLastNext)
          ? nextButton
          : null}
      </div>
      {registerFlow ? nextButton : null}
      {/* {currentStep < numSteps - 1 || renderLastNext ? nextButton : null} */}
    </div>
  );
}
