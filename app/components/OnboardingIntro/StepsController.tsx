import Image from "next/image";

interface Props {
  setNext: Function;
  setPrev: Function;
  setSkip: Function;
  currentStep: number;
  numSteps: number;
}

export default function StepsController({
  setNext,
  setPrev,
  setSkip,
  currentStep,
  numSteps,
}: Props) {
  const stepsIterator = Array(numSteps).fill(0);
  return (
    <div
      style={{
        display: "flex",
        width: "295px",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        justifySelf: "center",
        // marginTop: "183px",
        position: "absolute",
        bottom: "24px",
      }}
      //   className="bottom-[24px] left-0 right-0 text-center"
    >
      {currentStep === 0 ? (
        <div
          className="text-neutral-400 text-lg font-medium leading-7 cursor-pointer"
          onClick={() => setSkip()}
        >
          Skip
        </div>
      ) : null}
      {currentStep !== 0 ? (
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
                ? "/images/step-selected.svg"
                : "/images/step-unselected.svg"
            }`}
            alt={"step"}
            width={16}
            height={16}
          />
        ))}
      </div>
      <div
        className="text-right text-zinc-800 text-lg font-medium leading-7 cursor-pointer"
        onClick={() => setNext()}
      >
        Next
      </div>
    </div>
  );
}
