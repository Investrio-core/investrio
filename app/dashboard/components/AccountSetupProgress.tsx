import { useRouter } from "next/navigation";
import LinearProgressBar from "./LinearProgressBar";
import Image from "next/image";
import { BUDGET_PAGE, DEBTS_PAGE } from "@/app/utils/constants";

const Completed = () => (
  <div
    style={{
      width: "26px",
      height: "26px",
      padding: "2px",
      fontSize: "22px",
      position: "relative",
      top: "-6px",
      right: "2px",
    }}
  >
    ✅
  </div>
);

const InProgress = ({ onClick }: { onClick: Function }) => (
  <div
    style={{
      backgroundColor: "#8e8ecc",
      borderRadius: "50%",
      width: "22px",
      height: "22px",
      padding: "2px",
      cursor: "pointer",
    }}
    onClick={() => onClick()}
  >
    <Image
      src={`/icons/arrow.svg`}
      alt={"completed"}
      width={22}
      height={22}
    />
  </div>
);

interface Props {
  budgetCompleted?: boolean;
  debtCompleted?: boolean;
  wealthCompleted?: boolean;
  smartSuggestionsCompleted?: boolean;
}

export default function AccountSetupProgress({
  budgetCompleted,
  debtCompleted,
  wealthCompleted,
  smartSuggestionsCompleted,
}: Props) {
  const router = useRouter();
  const completed = [
    budgetCompleted,
    debtCompleted,
    wealthCompleted,
    smartSuggestionsCompleted,
  ];
  const stepsCompleted = completed.filter(Boolean).length;
  const totalSteps = completed.length;

  console.log(completed);
  console.log(stepsCompleted);
  console.log(totalSteps);

  return (
    <div className="w-[100%] px-[14px] py-[10px] flex flex-col gap-[15px]">
      <div className="flex flex-row justify-between items-center">
        <div className="text-black text-lg font-semibold capitalize tracking-tight">
          Finish account setup
        </div>
        <LinearProgressBar
          stepsCompleted={stepsCompleted}
          totalSteps={totalSteps}
        />
      </div>

      <div className="flex flex-row justify-between items-center">
        <div className="text-black text-sm font-medium">
          Complete Your Budget
        </div>
        <div>
          {budgetCompleted ? (
            <Completed />
          ) : (
            <InProgress onClick={() => router.push(BUDGET_PAGE)} />
          )}
        </div>
      </div>

      <div className="flex flex-row justify-between items-center">
        <div className="text-black text-sm font-medium">Review Your Debt</div>
        <div>
          {debtCompleted ? (
            <Completed />
          ) : (
            <InProgress onClick={() => router.push(DEBTS_PAGE)} />
          )}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-black text-sm font-medium">Build Wealth Plan</div>
        <div>
          {wealthCompleted ? <Completed /> : <InProgress onClick={() => {}} />}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="text-black text-sm font-medium">
          Meet Smart Suggestions
        </div>
        <div>
          {smartSuggestionsCompleted ? (
            <Completed />
          ) : (
            <InProgress onClick={() => {}} />
          )}
        </div>
      </div>
    </div>
  );
}
