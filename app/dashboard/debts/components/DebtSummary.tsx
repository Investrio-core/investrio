import DebtsTable from "@/app/components/strategy/DebtsTable";
import {
  ScaledPieChart,
  COLORS,
} from "@/app/components/ui/charts/CustomPieChart";
import EmptyIcon from "@/public/icons/emptystate.svg";
import { DebtFormType } from "@/types/debtFormType";
import DebtManager from "./DebtManager";
import { formatCurrency } from "@/app/utils/formatters";

interface Props {
  debts: DebtFormType[];
  totalDebt: number;
  setDebts: Function;
}

export default function DebtSummary({ debts, totalDebt, setDebts }: Props) {
  const debtsForGraph = debts.map((debt) => ({
    name: debt.debtName,
    value: Number(debt.balance),
    minPayment: Number(debt.minPayment),
    extraPayAmount: debt.extraPayAmount,
  }));

  return (
    <div className="flex flex-col pb-[0px]">
      <div className="pb-[0px] mx-[16px] my-[16px] xl:px-10 bg-indigo-50 rounded-[18px] border border-violet-200 relative">
        {/* {debts?.length > 0 ? (
          <div className="text-center text-slate-950 text-2xl leading-[33.60px] mt-[6px] mb-[0px]">
            Let’s Crush this Debt
          </div>
        ) : null} */}

        {debts?.length > 0 ? (
          <div className="relative top-[0px]">
            <ScaledPieChart
              values={debtsForGraph}
              income={totalDebt}
              colorsToUse={COLORS}
              showChartMap={false}
              height={180}
              title={"Total Balance"}
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
