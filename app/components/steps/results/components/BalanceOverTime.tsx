import CustomLineChart from "@/app/components/charts/CustomLineChart";
import { formatNumberToKFormat } from "@/utils/formatters";
import { Area } from "recharts";
import { Data } from "../results.types";

type Props = {
  data: Data[];
  // onChangeMonth: (month: string) => void;
};

export const BalanceOverTime = ({ data }: Props) => {
  const totalBalance = data[0].remainingBalance + data[0].monthTotalPayment

  const modifiedData = data?.map((item) => {
    return {
      name: new Date(item.paymentDate).toLocaleDateString('en-US', { month: 'short', year: "2-digit" }),
      label: "oi",
      balance: item.remainingBalance,
    };
  });

  // const balancePercentage = () => {
  //   if (totalBalance > data[0].remainingBalance)
  //     return `+${(totalBalance / data[0].remainingBalance).toPrecision(3)}`;
  //   if (totalBalance < data[0].remainingBalance)
  //     return `-${(data[0].remainingBalance / totalBalance).toPrecision(3)}`;
  // };


  // const defaultSelectValue = new Date().getMonth().toLocaleString();
  //
  // const monthOptions: Option[] = data?.map((item) => {
  //   const [_year, month] = item.paymentDate.split("-");
  //
  //   return {
  //     label: formatMonthName(parseInt(month)),
  //     value: month,
  //   };
  // });

  return (
    <div className="card bg-white px-6 pt-6 w-full">

      <div className="text-xl leading-5 font-bold text-[#03091D] flex justify-between mb-4 items-center ">
        Balance Over Time
        {/* <Select
          onChange={(e) => onChangeMonth(e.target.value)}
          size="sm"
          name="month"
          label=""
          options={monthOptions}
          defaultValue={defaultSelectValue}
        /> */}
      </div>
      <div className="flex justify-start items-center">
        <span className="font-bold text-3xl">
         ${formatNumberToKFormat(totalBalance)}
        </span>
        {/* <div className="flex items-center"> */}
          {/* <div className="bg-purple-600 rounded-[50%] ml-4 w-4 h-4 flex justify-center items-center mb-4 mr-1">
            <PiArrowUpBold
              style={{
                transform: "rotate(28deg)",
                color: "#ffffff",
              }}
            />
          </div> */}
          {/* <div className="flex flex-col justify-start"> */}
            {/* <span className="text-purple-600 font-bold text-sm flex justify-start"> */}
              {/* {`${balancePercentage()}`} */}
            {/* </span> */}
            {/* <span className="text-sm text-[#747682]"> */}
              {/* Total Balance */}
            {/* </span> */}
          {/* </div> */}
        {/* </div> */}
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
