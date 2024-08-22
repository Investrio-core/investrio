import React from "react";
import CustomPieChart, {
  ScaledPieChart,
} from "@/app/components/ui/charts/CustomPieChart";
import { backgroundColor } from "@/app/utils/constants";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function PieBreakdownBlock({
  income,
  values,
  goBack,
  title = "",
  border = true,
  useBasicLabel = false,
  renderPercentValues = false,
  renderShape = "",
  height = 180,
  scale = 1,
  paddingY = undefined,
}: {
  height?: number;
  scale?: number;
  income: number;
  goBack?: Function;
  title?: string;
  border?: boolean;
  useBasicLabel?: boolean;
  renderPercentValues?: boolean;
  renderShape?: string;
  paddingY?: string;
  values?: {
    name: string;
    value: number;
    minPayment?: number;
    extraPayAmount?: string | number | undefined;
  }[];
}) {
  return (
    <div
      className={`flex flex-col ${
        renderShape === "flex-row" ? "" : "pb-[24px]"
      }`}
    >
      {/*      ${renderShape === "flex-row" ? "py-[26px]" : "pb-[24px]"}
       */}
      <div
        className={`${paddingY !== undefined ? `py-[${paddingY}px]` : null} ${
          renderShape === "flex-row" ? "mx-[2px]" : "mx-[16px]"
        } lg:my-[16px] xl:px-10 ${backgroundColor} rounded-[18px] ${
          border ? "border border-violet-200" : ""
        } relative`}
      >
        {goBack ? (
          <div
            className="lg:hidden md:hidden absolute top-[14px] left-[14px] cursor-pointer z-100"
            onClick={() => goBack()}
            style={{ zIndex: 1000 }}
          >
            <AiOutlineArrowLeft color="black" />
          </div>
        ) : null}
        <ScaledPieChart
          income={income}
          height={height}
          scale={scale}
          title={title}
          useBasicLabel={useBasicLabel}
          values={values}
          renderPercentValues={renderPercentValues}
          renderShape={renderShape}
        />
      </div>
      {/* <div className="flex flex-col items-center justify-center text-center px-[16px]">
        <span className="text-orange-500 text-lg font-medium leading-[25.20px]">
          This is where the magic happens!
        </span>
        <span className="text-indigo-950 text-lg font-medium leading-[25.20px]">
          To move faster towards your next financial goals, Investrio suggests
          the 50/30/20 budget
        </span>
      </div> */}
    </div>
  );
}
