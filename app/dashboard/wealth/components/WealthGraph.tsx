import { formatCurrency } from "@/app/utils/formatters";
import { BarLineGraph } from "./BarLineGraph";

interface Props {
  data: {
    name: string;
    Debts: number;
    Assets: Number;
    Networth: Number;
  }[];
  balanceDecreasing?: boolean;
  percentDown?: number;
  totalBalance: number;
}

export default function WealthGraph({
  balanceDecreasing,
  percentDown,
  totalBalance,
  data,
}: Props) {
  return (
    <div className="rounded-lg rounded-[18px] border border-[#d2daff] w-full display flex flex-col justify-start px-[18px] py-[8px] lg:py-3 lg:py-4 bg-white">
      <div className="mb-[8px] flex justify-start items-center gap-[8px]">
        {/* <div className="w-9 h-5 inline-flex relative self-center justify-self-center mr-[4px]">
          <Calender />
        </div> */}
        <div className="text-[#2b3674] font-medium leading-loose self-center justify-self-center">
          Path to Wealth
        </div>
      </div>

      <div style={{ width: "100%", height: "281px", paddingBottom: "20px" }}>
        <BarLineGraph data={data} />
      </div>

      <div className="w-[100%] h-[39px] justify-between items-center inline-flex mb-[14px]">
        <div className="flex flex-col gap-[4px]">
          <div className="text-black-500 text-sm font-medium leading-normal">
            Total Net Worth
          </div>
          {percentDown !== undefined ? (
            <div className="text-[#a3aed0] text-xs font-medium leading-normal">
              Month over Month
            </div>
          ) : null}
        </div>
        <div className="flex-col justify-start items-end inline-flex">
          <div
            className={`text-right ${
              totalBalance < 0 ? "text-[#eb5757]" : "text-[#2b3674]"
            } text-base font-bold leading-tight`}
          >
            {formatCurrency(totalBalance)}
          </div>
          {percentDown !== undefined ? (
            <div className="justify-start items-center gap-1 inline-flex">
              <div className="w-5 h-5 relative" />
              <div
                className={`text-center ${
                  balanceDecreasing ? "text-[#05cd99]" : "text-red-500"
                } text-xs font-bold leading-tight`}
              >
                {balanceDecreasing ? `+${percentDown}` : `${percentDown}`}%
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
