import Image from "next/image";
import { StandardButton } from "../ui/buttons";
import { useRouter } from "next/navigation";

interface Props {
  setNext: Function;
  currentStep: number;
  numSteps: number;
  classes?: string;
}

export default function StepsController({
  setNext,
  currentStep,
  numSteps,
  classes = "",
}: Props) {
  const stepsIterator = Array(numSteps).fill(0);
  const router = useRouter();

  const nextButton = (currentStep < numSteps - 1) ? (
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
  return (
    <div className={classes}>
      <div className="justify-center align-center items-start gap-[4px] flex mb-10">
        {stepsIterator.map((discard, idx) => (
          <Image
            src={`${idx <= currentStep
              ? "/images/step-selected.svg"
              : "/images/step-unselected.svg"
              }`}
            key={`step-${idx}`}
            alt={"step"}
            width={16}
            height={16}
          />
        ))}
      </div>
      {nextButton}
    </div >
  );
}

// interface Props {
//   setNext: Function;
//   setPrev: Function;
//   setSkip?: Function;
//   currentStep: number;
//   numSteps: number;
//   useButton?: boolean;
//   renderLastNext?: boolean;
//   classes?: string;
// }

// export default function StepsController({
//   setNext,
//   setPrev,
//   setSkip,
//   currentStep,
//   numSteps,
//   useButton = false,
//   renderLastNext = false,
//   classes = "",
// }: Props) {
//   const stepsIterator = Array(numSteps).fill(0);

//   const nextButton = useButton ? (
//     <button
//       className={`btn btn-primary mt-4 capitalize text-base/[14px]`}
//       style={{
//         borderRadius: "12px",
//         position: "relative",
//         top: "-10px",
//       }}
//       onClick={() => setNext()}
//     >
//       Next
//     </button>
//   ) : (
//     <div
//       className="text-right text-zinc-800 text-lg font-medium leading-7 cursor-pointer"
//       onClick={() => setNext()}
//     >
//       Next
//     </div>
//   );
//   return (
//     <div
//       className={classes}
//       style={{
//         display: "flex",
//         width: "295px",
//         justifyContent: "space-between",
//         alignItems: "center",
//         alignSelf: "center",
//         justifySelf: "center",
//       }}
//     >
//       {currentStep === 0 && setSkip ? (
//         <div
//           className="text-neutral-400 text-lg font-medium leading-7 cursor-pointer"
//           onClick={() => (setSkip ? setSkip() : undefined)}
//         >
//           Skip
//         </div>
//       ) : null}
//       {currentStep !== 0 ? (
//         <div
//           className="text-left text-zinc-800 text-lg font-medium leading-7 cursor-pointer"
//           onClick={() => setPrev()}
//         >
//           Previous
//         </div>
//       ) : null}
//       <div className="justify-center align-center items-start gap-[4px] flex">
//         {stepsIterator.map((discard, idx) => (
//           <Image
//             src={`${idx <= currentStep
//               ? "/images/step-selected.svg"
//               : "/images/step-unselected.svg"
//               }`}
//             key={`step-${idx}`}
//             alt={"step"}
//             width={16}
//             height={16}
//           />
//         ))}
//       </div>
//       {currentStep < numSteps - 1 || renderLastNext ? nextButton : null}
//     </div>
//   );
// }
