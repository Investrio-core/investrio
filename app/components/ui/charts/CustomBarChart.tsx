import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/app/utils/formatters";

interface DebtData {
  title: string;
  monthlyPayment: number;
  remainingBalance: number;
}

interface MonthlyData {
  paymentDate: string;
  totalInitialBalance: number;
  extraPayAmount: number;
  monthTotalPayment: number;
  totalInterestPaid: number;
  remainingBalance: number;
  data: DebtData[];
}

interface CustomToolTipProps {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string;
  data: MonthlyData[];
}

interface ChartDataEntry {
  name: string;

  [key: string]: number | string;
}

type Props = {
  data: MonthlyData[];
  alreadyTransformedData?: ChartDataEntry[];
  labels?: Set<string>;
};

const COLORS = [
  "#f72585",
  "#b5179e",
  "#7209b7",
  "#560bad",
  "#480ca8",
  "#3a0ca3",
  "#3f37c9",
  "#4361ee",
  "#4895ef",
  "#4cc9f0",
  "#9E383B",
  "#DA6C6A",
  "#00C896",
  "#BE8120",
];

const formatYAxis = (value: number): string => {
  return value >= 100000
    ? `${(value / 1000).toFixed(0)}k`
    : `$${value.toString()}`;
};

const getColorForKey = (
  key: string,
  data: MonthlyData[],
  labels?: Set<string>
): string => {
  const uniqueKeys =
    labels !== undefined
      ? labels
      : new Set(data.flatMap((d) => d.data.map((dd) => dd.title)));
  const keyIndex = Array.from(uniqueKeys).indexOf(key);
  return COLORS[keyIndex % COLORS.length] || COLORS[0];
};

const CustomTooltip = ({ active, payload, label }: CustomToolTipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-3 rounded">
        <span className="font-bold">{label}</span>
        <hr />
        {payload.map((item, index: number) => (
          <div key={item.value + index} className="flex flex-col my-2">
            <span className="font-bold">{item.dataKey}</span>
            <span>{formatCurrency(item.value)}</span>
            {index < payload.length - 1 && <hr />}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CustomBarChart = ({
  data,
  alreadyTransformedData,
  labels,
}: Props) => {
  const transformedData: ChartDataEntry[] =
    alreadyTransformedData ??
    data?.map((item) => ({
      name:
        new Date(item.paymentDate).toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }) ?? [],
      ...(item?.data?.reduce((acc, curr) => {
        acc[curr.title] = curr.monthlyPayment;
        return acc;
      }, {} as { [key: string]: number }) ?? []),
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={transformedData}
        margin={{ top: -10, right: 0, left: -20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          className="text-sm"
          interval={"preserveStartEnd"}
        />
        <YAxis tickFormatter={formatYAxis} className="text-sm" />
        <Tooltip
          cursor={{ fill: "#451B8010" }}
          allowEscapeViewBox={{ x: false, y: true }}
          content={<CustomTooltip data={data} />}
          wrapperStyle={{ zIndex: 9999 }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="right" />
        {Object.keys(transformedData?.[0] ?? {})
          .filter((key) => key !== "name")
          .map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={getColorForKey(key, data, labels)}
              stackId="a"
              barSize={20}
              animationBegin={20}
              radius={[3, 3, 0, 0]}
            />
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
