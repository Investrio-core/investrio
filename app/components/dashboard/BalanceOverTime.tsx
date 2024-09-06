import CustomLineChart from "@/app/components/ui/charts/CustomLineChart";
import { formatNumberToKFormat } from "@/app/utils/formatters";
import { Area } from "recharts";
import { Data } from "./results.types";
import { PaymentPlanObject } from "@/app/hooks/calculatorsSnowball/types";

type Props = {
  data: Data[];
  results: PaymentPlanObject[];
};

export const BalanceOverTime = ({ data, results }: Props) => {
  // needs name, balance, paymentDate, remainingBalance
  // const totalBalance = data[0].totalInitialBalance;
  const totalBalance =
    typeof results?.[0]?.accounts?.reduce === "function"
      ? results?.[0]?.accounts?.reduce((acc, next) => {
          return acc + next.balanceStart;
        }, 0)
      : 0;
  // let modifiedData = data?.map((item) => {
  //   return {
  //     name: new Date(item.paymentDate).toLocaleDateString("en-US", {
  //       month: "short",
  //       year: "2-digit",
  //     }),
  //     label: "oi",
  //     balance: item.remainingBalance,
  //   };
  // });

  let modifiedData = results?.map((item) => {
    return {
      name: new Date(item?.accounts?.[0]?.paymentDate).toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "2-digit",
        }
      ),
      label: "oi",
      balance: item.balance,
    };
  });

  return (
    <div className="bg-white px-6 pt-6 w-full">
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
