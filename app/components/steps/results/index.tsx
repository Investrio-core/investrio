import { Card } from "./components/Card";
import { CheckboxTable } from "./components/CheckboxTable";
import { BalanceOverTime } from "./components/BalanceOverTime";
import { Balance } from "./components/Balance";
import { formatMonthName } from "@/utils/formatters";
import { ResultsProps } from "./results.types";
import { Button } from "@/app/components/ui/buttons";
import Link from "next/link";
import dayjs from "dayjs";

export const DebtSummary = ({ data }: ResultsProps) => {
  const debts = data[0].data.map((info, index) => ({
    id: index,
    label: info.title,
    subLabel: "Credit Card",
    value1: info.monthlyPayment,
    value2: info.remainingBalance,
    paid: false,
  }));

  const snowball = data[0];

  const debtFreeBy = dayjs(
    new Date(data[data.length - 1]?.paymentDate).getTime()
  );
  const month = debtFreeBy.format("MMMM");
  const year = debtFreeBy.format("YYYY");

  if (!data?.length) {
    return (
      <div className="text-center mx-auto">
        <h2>No Information has been registered yet.</h2>
        <Link href={"/dashboard/debts/add"}>
          <Button text="Set up Strategy" classProp="mx-auto" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="my-12 w-full gap-9">
        <div className="flex gap-9 overflow-x-auto min-w-full">
          <Card
            icon="calendar"
            label="Min. Payment"
            value={snowball?.monthTotalPayment - snowball?.extraPayAmount || 0}
          />
          <Card
            icon="extra-payment"
            label="Extra payment"
            value={snowball?.extraPayAmount}
          />
          <Card icon="debt-free" label="Debt Free By:" date={{ month, year }} />
          <Card
            icon="total-saved"
            label="Total Interest Saved"
            value={snowball?.totalInterestPaid}
            sublabel="While in Repayment Plan"
          />
        </div>
        <div className="flex mt-9 gap-9">
          <div className="w-full">
            <div className="grid grid-cols-5 gap-9 w-full">
              <div className="col-span-5 md:col-span-2">
                <CheckboxTable infos={debts} />
              </div>
              <div className="col-span-5 md:col-span-3">
                <Balance data={data} />
              </div>
            </div>
            <div className="mt-9">
              <BalanceOverTime
                // onChangeMonth={(month) => {
                //   const index = data.findIndex(
                //     (item) =>
                //       parseInt(item.paymentDate.split("-")[1]) ===
                //       parseInt(month)
                //   );
                //   if (index >= 0) return setIndex(index);
                //   if (!index)
                //     return toast.error(
                //       "We are currently experiencing an issue with the database for this month. Please try again later."
                //     );
                // }}
                data={data}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
