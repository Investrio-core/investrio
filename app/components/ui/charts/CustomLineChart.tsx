import { ReactNode } from "react";
import {
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
  CartesianGrid,
} from "recharts";

type Props = {
  data: any[];
  area: ReactNode;
  showPayloadNameOnLabel?: boolean; // default true
};

const CustomTooltip = ({ active, payload, showPayloadNameOnLabel }: TooltipProps<number, string> & { showPayloadNameOnLabel?: boolean }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
        {showPayloadNameOnLabel && <p className="text-sm text-gray-600">{payload[0].name}</p>}
        <p className="text-md font-bold text-blue-600">
          {payload[0]?.value?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </p>
      </div>
    );
  }

  return null;
};

const formatYAxis = (value: number): string | number => {
  return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
};

const formatXAxis = (tickItem: string) => {
  return tickItem
};

export default function CustomLineChart({ data, area, showPayloadNameOnLabel = true }: Props) {
  const possibleColors = [
    {
      id: "primary",
      color: "#8833FF",
    },
    {
      id: "secondary",
      color: "#FF6B6B",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 30,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          {possibleColors.map(({ id, color }) => (
            <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={.6}/>
              <stop offset="95%" stopColor={color} stopOpacity={.1}/>
            </linearGradient>
          ))}
        </defs>
        <XAxis
        interval={'preserveStartEnd'}
          className="text-xs"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tickFormatter={formatXAxis}
        />
        <YAxis
          className="text-sm"
          axisLine={false}
          tickLine={false}
          tickFormatter={formatYAxis as any}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <Tooltip content={<CustomTooltip showPayloadNameOnLabel={showPayloadNameOnLabel}/>}/>
        {area}
      </AreaChart>
    </ResponsiveContainer>
  );
}
