import { CustomBarChart } from "@/app/components/ui/charts/CustomBarChart";
import { Data } from "./results.types";

type Props = {
  data: Data[];
}

export const Balance = ({data}: Props) => {
  return (
    <div className="card bg-white px-6 pt-6 w-full">
      <div className="text-xl leading-5 font-bold text-[#03091D] flex justify-between mb-4">
        Monthly Payments
      </div>
      <div className="flex justify-start items-start">
        <CustomBarChart data={data} />
      </div>
    </div>
  );
};
