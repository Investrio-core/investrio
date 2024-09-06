import DebtsTable from "@/app/components/strategy/DebtsTable";
import {
  ScaledPieChart,
  COLORS,
} from "@/app/components/ui/charts/CustomPieChart";
import EmptyIcon from "@/public/icons/emptystate.svg";
import { DebtFormType } from "@/types/debtFormType";
import DebtManager from "./DebtManager";
import { formatCurrency } from "@/app/utils/formatters";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";

interface Props {
  debts: DebtFormType[];
  totalDebt: number;
  setDebts: Function;
  showChartMap?: boolean;
  percentDown?: number;
}

export default function DebtSummary({
  debts,
  totalDebt,
  setDebts,
  percentDown,
  showChartMap = false,
}: Props) {
  const debtsForGraph = debts.map((debt) => ({
    name: debt.debtName,
    value: Number(debt.balance),
    minPayment: Number(debt.minPayment),
    extraPayAmount: debt.extraPayAmount,
  }));

  return (
    <div className="flex flex-col pb-[0px]">
      <div className="pb-[0px] mx-[16px] my-[16px] xl:px-10 rounded-[18px] border border-violet-200 relative">
        {/* {debts?.length > 0 ? (
          <div className="text-center text-slate-950 text-2xl leading-[33.60px] mt-[6px] mb-[0px]">
            Let’s Crush this Debt
          </div>
        ) : null} */}
        <div className="flex flex-col px-[16px] py-[16px]">
          <div className=" text-[#000118] text-base font-medium leading-normal">
            Debt Summary{" "}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-right text-black text-xs font-medium leading-normal">
              Total Debt
            </div>
            <div className="text-right text-black text-base font-bold leading-tight">
              {formatCurrency(totalDebt)}
            </div>
          </div>

          {percentDown ? (
            <div className="flex justify-between items-center">
              <div className="text-[#a3aed0] text-xs font-medium leading-normal">
                Month over Month
              </div>
              <div
                className={`text-center ${
                  percentDown < 0 ? "text-[#cd0505]" : "text-green-500"
                } text-xs font-bold leading-tight flex`}
              >
                {percentDown < 0 ? (
                  <IoMdArrowDropup className="w-5 h-5" color="#cd0505" />
                ) : (
                  <IoMdArrowDropdown className="w-5 h-5 text-green-500" />
                )}
                {percentDown < 0 ? "" : "+"}
                {percentDown}%
              </div>
            </div>
          ) : null}
        </div>

        {debts?.length > 0 ? (
          <div className="relative top-[0px] mb-[12px]">
            <ScaledPieChart
              values={debtsForGraph}
              income={totalDebt}
              colorsToUse={COLORS}
              showChartMap={false}
              height={"auto"}
              useBasicLabel
              scale={2}
              // title={"Total Balance"}
            />
          </div>
        ) : null}

        {debts?.length > 0 ? (
          <div className="relative top-[0px]">
            <DebtManager debts={debts} setDebts={setDebts} />
          </div>
        ) : null}

        {!debts.length && (
          <div className="flex flex-col items-center justify-center mx-[12px] my-[12px]">
            <span className="font-light text-[#747682] text-center mb-[12px]">
              <h1 className="mb-1 text-xl font-semibold text-[#03091D] text-center">
                You haven’t added any debts
              </h1>
              Add a debt to proceed
            </span>
            <EmptyIcon style={{ filter: "grayscale(100%)" }} />
          </div>
        )}
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
