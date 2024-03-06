import CustomLineChart from "@/app/components/ui/charts/CustomLineChart";
import { formatNumberToKFormat } from "@/app/utils/formatters";
import { Area } from "recharts";
import { Data } from "./results.types";

type Props = {
  data: Data[];
};

export const BalanceOverTime = ({ data }: Props) => {
  const totalBalance = data[0].totalInitialBalance;

  let modifiedData = data?.map((item) => {
    return {
      name: new Date(item.paymentDate).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      label: "oi",
      balance: item.remainingBalance,
    };
  });

  return (
    <div className="card bg-white px-6 pt-6 w-full">
      <div className="text-xl leading-5 font-bold text-[#03091D] flex justify-between mb-4 items-center ">
        Balance Over Time
      </div>
      <div className="flex justify-start items-center">
        <span className="font-bold text-3xl">
          ${formatNumberToKFormat(totalBalance)}
        </span>
      </div>
      <div className="w-full">
        <CustomLineChart
          data={modifiedData}
          showPayloadNameOnLabel={false}
          area={
            <Area
              dataKey="balance"
              strokeWidth={3}
              stroke="#8884d8"
              fill="url(#primary)"
              type={"monotone"}
            />
          }
        />
      </div>
    </div>
  );
};
