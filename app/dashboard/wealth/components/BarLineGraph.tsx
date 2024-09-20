import { formatCurrency } from "@/app/utils/formatters";
import React, { FunctionComponent, PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomizedDot: FunctionComponent<any> = (props: any) => {
  const { cx, cy, value } = props;

  return (
    <svg
      x={cx - 10}
      y={cy - 10}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="#FFAE4C"
    >
      <path opacity="0.25" d="M8 0L16 8L8 16L0 8L8 0Z" fill="#FFAE4C" />
      <path d="M8 3L13 8L8 13L3 8L8 3Z" fill="#FFAE4C" />
      <path
        d="M3.70711 8L8 3.70711L12.2929 8L8 12.2929L3.70711 8Z"
        stroke="black"
        stroke-opacity="0.25"
      />
    </svg>
  );
};

const renderLegendText = (value: string, entry: any) => {
  // const { color } = entry;
  //<div className="text-black/70 text-xs font-normal font-['Inter']">Visa</div>
  return (
    <span className="text-black/70 text-xs font-normal">
      {formatCurrency(value)}
    </span>
  );
};

const formatYAxis = (value: number): string | number => {
  return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
};

const BarWithBorder = (borderHeight, borderColor, barColor) => {
  return (props) => {
    const { fill, x, y, width, height } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          stroke="none"
          fill={barColor}
        />
        <rect
          x={x}
          y={y}
          width={width}
          height={borderHeight}
          stroke="none"
          fill={borderColor}
        />
      </g>
    );
  };
};

interface Props {
  data: {
    name: string;
    Debts: number;
    Assets: Number;
    Networth: Number;
  }[];
}

export const BarLineGraph = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%">
      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          right: 0,
          left: -15,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" scale="band" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={renderLegendText} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          // formatter={renderLegendText}
          iconSize={8}
        />
        <Bar
          dataKey="Assets"
          barSize={20}
          // fill="#7086FD"
          fill="rgba(112, 134, 253, 0.6)"
          shape={BarWithBorder(
            4,
            "rgb(112, 134, 253)",
            "rgba(112, 134, 253, 0.6)"
          )}
        />
        <Bar
          dataKey="Debts"
          barSize={20}
          fill="rgba(111, 209, 149, 0.6)"
          shape={BarWithBorder(
            4,
            "rgb(111, 209, 149)",
            "rgba(111, 209, 149, 0.6)"
          )}
        />
        <Line
          type="monotone"
          dataKey="Networth"
          stroke="#FFAE4C"
          dot={<CustomizedDot />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
