import { PaymentScheduleGraphType } from "@/types/financial";
import dayjs from "dayjs";

const noData = {
  debtFreeDate: "-",
  totalInterest: 0,
  saved: 0,
  monthsFaster: 0,
}

export function generateMonthAndYear(debtFreeMonth: number) {
  const date = dayjs(debtFreeMonth);
  const month = date.format('MMMM');
  const year = date.year();

  return `${month} - ${year} `;
}

export function convertGraphDataToDisplayData({ graphData, summary, withPlanning = true }: {
  graphData?: PaymentScheduleGraphType,
  summary: any,
  withPlanning?: boolean
}) {
  if (!graphData || !graphData?.data?.length) return noData;

  const lastPaidEntry = graphData.data.find(d => d.remainingBalance === 0);
  const lastPaidDate = lastPaidEntry ? lastPaidEntry.currentDate : null;
  const totalInterest = (withPlanning ? summary?.snowballTotalInterestPaid : summary?.withoutPlaningTotalInterest) || 0

  return {
    debtFreeDate: lastPaidDate ? generateMonthAndYear(lastPaidDate) : '-',
    totalInterest,
    saved: summary?.savings || 0,
    monthsFaster: summary?.monthsFaster || 0
  }
}


export function generateGraphData(graphData?: PaymentScheduleGraphType) {
  console.log(graphData);
  if (!graphData || !graphData?.data?.length) return [];

  return graphData.data.map((item) => ({
    name: dayjs(item.currentDate).format('MMM'),
    balance: item.remainingBalance,
  }));
}