import LinearProgressBar from "./LinearProgressBar";

export default function AccountSetupProgress() {
  return (
    <div className="w-[100%] px-[14px] py-[10px] flex flex-col gap-[15px]">
      <div className="flex flex-row justify-between items-center">
        <div className="text-black text-lg font-semibold capitalize tracking-tight">
          Finish account setup
        </div>
        <LinearProgressBar stepsCompleted={1} totalSteps={4} />
      </div>

      <div className="text-black text-xs font-medium">Complete Your Budget</div>

      <div className="text-black text-xs font-medium">Review Your Debt</div>

      <div className="text-black text-xs font-medium">Build Wealth Plan</div>

      <div className="text-black text-xs font-medium">
        Meet Smart Suggestions
      </div>
    </div>
  );
}
