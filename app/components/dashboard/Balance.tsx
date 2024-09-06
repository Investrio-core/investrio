import { CustomBarChart } from "@/app/components/ui/charts/CustomBarChart";
import { Data } from "./results.types";
import {
  AccountMonth,
  PaymentPlanObject,
} from "@/app/hooks/calculatorsSnowball";

type Props = {
  data: Data[];
  results: PaymentPlanObject[];
};

export const Balance = ({ data, results }: Props) => {
  const labels =
    results?.[0]?.accounts?.map !== undefined
      ? new Set<string>(results?.[0]?.accounts?.map((account) => account.name))
      : undefined;

  const transformedData = results?.map((item) => {
    return {
      name:
        new Date(item?.accounts?.[0]?.paymentDate).toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }) ?? [],
      ...(item?.accounts?.reduce((acc, curr) => {
        acc[curr.name] = curr.paymentAmount;
        return acc;
      }, {} as { [key: string]: number }) ?? []),
    };
  });

  return (
    <div className="bg-white px-6 pt-6 w-full">
      {/* <div className="text-xl leading-5 font-bold text-[#03091D] flex justify-between mb-4">
        Monthly Payments
      </div> */}
      <div className="flex justify-start items-start">
        <CustomBarChart
          data={data}
          alreadyTransformedData={transformedData}
          labels={labels}
        />
      </div>
    </div>
  );
};
