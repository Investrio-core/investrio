import React from "react";
import CustomPieChart, {
  ScaledPieChart,
} from "@/app/components/ui/charts/CustomPieChart";

export default function PieBreakdownBlock({ income }: { income: number }) {
  return (
    <div className="flex flex-col pb-[24px]">
      <div className="pb-[24px] mx-[16px] my-[16px] xl:px-10 bg-indigo-50 rounded-[18px] border border-violet-200">
        <ScaledPieChart income={income} />
      </div>
      <div className="flex flex-col items-center justify-center text-center px-[16px]">
        <span className="text-orange-500 text-lg font-medium leading-[25.20px]">
          This is where the magic happens!
        </span>
        <span className="text-indigo-950 text-lg font-medium leading-[25.20px]">
          To move faster towards your next financial goals, Investrio suggests
          the 50/30/20 budget
        </span>
      </div>
    </div>
  );
}
