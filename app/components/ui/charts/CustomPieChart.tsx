"use client";
import { formatCurrency } from "@/app/utils/formatters";
import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Label } from "recharts";

export const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#6584FF",
  "#F72585",
  "#7209B7",
  "#480CA8",
];

const FIGMA_COLORS = [
  "#165DFF",
  "#14C9C9",
  "#F7BA1E",
  "#722ED1",
  "#F72585",
  "#7209B7",
  "#480CA8",
]; //, "#FFBB28"];

const ratios = [
  { name: "Needs", value: 0.5 },
  { name: "Wants", value: 0.3 },
  // { name: "Savings/Debt", value: 0.2 },
  { name: "Savings", value: 0.1 },
  { name: "Debt", value: 0.1 },
];

// const CustomLabel = ({ LabelJSX, ...props }) => {
//   return (
//     <g>
//       <foreignObject x={0} y={0} width={100} height={100}>
//         {LabelJSX}
//       </foreignObject>
//     </g>
//   );
// };

const getLabel = () => {
  return (
    <g>
      <text
        // x={x + 30}
        // y={y + 25}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        Total:
      </text>
    </g>
  );
};

const getLabelContent = () => {
  return (
    <text
      offset="5"
      x="100.5"
      y="90"
      className="text-[#4d5e80] text-xs font-semibold"
      text-anchor="middle"
    >
      <tspan
        x="170.5"
        dy="-.85em"
        className="text-[#4d5e80] text-xs font-semibold"
      >
        Total
      </tspan>
    </text>
  );
};

const getValueContent = (value: string) => {
  return (
    <text
      offset="5"
      x="100.5"
      y="90"
      className="recharts-text font-bold"
      text-anchor="middle"
    >
      <tspan x="170.5" dy=".7em">
        {value}
      </tspan>
    </text>
  );
};

export function ScaledPieChart({
  income,
  values,
  colorsToUse,
  title,
  showChartMap = true,
  height = 250,
  scale = 1,
  useBasicLabel = false,
  renderPercentValues = false,
  renderShape = "",
}: {
  income: number;
  values?: {
    name: string;
    value: number;
    minPayment?: number;
    extraPayAmount?: string | number | undefined;
  }[];
  colorsToUse?: string[];
  title?: string;
  showChartMap?: boolean;
  height?: number | string;
  scale?: number;
  useBasicLabel?: boolean;
  renderPercentValues?: boolean;
  renderShape?: string;
}) {
  const colorsArray = colorsToUse ?? FIGMA_COLORS;
  let scaledData =
    values ??
    ratios.map(({ name, value }) => {
      return { name: name, value: income ? income * value : 1 * value };
    });

  if (renderPercentValues) {
    scaledData = values
      ? values?.map(({ name, value }) => ({
          name: name,
          // value: (value / income).toFixed(1),
          value: value / income,
        }))
      : scaledData;

    // ratios.map(({ name, value }) => {
    //   return { name: name, value: income ? income * value : 1 * value };
    // });
  }

  const dollarFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // const ValueJsx = (
  //   <div className="px-[16px] w-[100%] justify-between items-center inline-flex my-1">
  //     <div className="text-center text-slate-400 text-2xl capitalize font-medium leading-normal">
  //       Total balance
  //     </div>
  //     <div className="flex-col justify-start items-end inline-flex">
  //       <div className="justify-start items-center gap-1 inline-flex">
  //         <div className="w-5 h-5 relative" />
  //         <div className="text-center text-teal-500 text-xs font-bold leading-tight">
  //           +2.45%
  //         </div>
  //       </div>
  //       <div className="text-right text-indigo-900 text-base font-bold leading-tight">
  //         {formatCurrency(income)}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <>
      {title ? (
        // <div className="text-center text-slate-400 text-2xl font-medium leading-normal capitalize mt-2">
        <div className="px-[10px] pt-[10px] text-black text-base font-medium text-lg leading-normal">
          {title}
        </div>
      ) : null}

      <div
        className={`flex flex-col min-[1106px]:flex-row items-center justify-between relative ${renderShape}`}
        style={renderShape === "flex-row" ? { flexDirection: "row" } : {}}
      >
        <ResponsiveContainer
          height={height}
          width={"100%"}
          // width={renderShape === "flex-row" ? "65%" : "100%"}
          // minWidth="140px"
          aspect={scale}
        >
          <PieChart
          // width={renderShape === "flex-row" ? 120 : 200}
          // height={height}
          >
            <Pie
              data={scaledData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              style={{ position: "relative" }}

              // label={({
              //   cx,
              //   cy,
              //   midAngle,
              //   innerRadius,
              //   outerRadius,
              //   value,
              //   index,
              // }) => {
              //   if (values === undefined) return <></>;
              //   console.log("handling label?");
              //   const RADIAN = Math.PI / 180;
              //   // eslint-disable-next-line
              //   const radius = 25 + innerRadius + (outerRadius - innerRadius);
              //   // eslint-disable-next-line
              //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
              //   // eslint-disable-next-line
              //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

              //   return (
              //     <text
              //       x={x}
              //       y={y}
              //       fill="#8884d8"
              //       textAnchor={x > cx ? "start" : "end"}
              //       dominantBaseline="central"
              //       className="absolute z-[9999]"
              //       // className={`relative ${
              //       //   x > cx ? "left-[20px]" : "right-[20px]"
              //       // }`}
              //     >
              //       {values[index].minPayment}/{values[index].extraPayAmount}
              //       <br />({value})
              //     </text>
              //   );
              // }}
            >
              {!useBasicLabel ? (
                <Label
                  // value={income ? CustomLabel({ LabelJSX: ValueJsx }) : "100%"}
                  // value={income ? ValueJsx : "100%"}
                  value={"Total"}
                  // content={getLabel()}
                  content={
                    getLabelContent()
                    // <div className="text-black">
                    //   {income ? `${dollarFormatter.format(income)}` : "100%"}
                    // </div>
                  }
                  position="centerTop"
                  className="font-bold"
                  fill="#000"
                  // style={{ position: "relative", top: "-20px" }}
                />
              ) : null}
              {useBasicLabel ? (
                <Label
                  value={income ? `${dollarFormatter.format(income)}` : "100%"}
                  position="center"
                  className="text-xl font-bold"
                  fill="#000"
                />
              ) : (
                <Label
                  content={
                    income
                      ? getValueContent(dollarFormatter.format(income))
                      : getValueContent("100%")
                  }
                  position="center"
                  className="text-xl font-bold"
                  fill="#000"
                />
              )}

              {scaledData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorsArray[index % colorsArray.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {showChartMap ? (
          <div className="w-[240px] md:w-[200px] lg:w-[220px]">
            <ul>
              {scaledData.map((entry, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-between md:gap-2 lg:gap-4 xl:gap-10 text-neutral-700 text-base font-normal leading-tight ${
                    renderShape === "flex-row" ? "mb-[8px]" : ""
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <div
                      style={{
                        backgroundColor:
                          colorsArray[index % colorsArray.length],
                      }}
                      className="w-3 h-3 rounded"
                    ></div>
                    {entry.name}
                  </div>
                  <span className="font-medium mr-[10px] justify-end items-end">
                    {income && !renderPercentValues
                      ? dollarFormatter.format(entry.value)
                      : `${(Number(entry.value?.toFixed(4)) * 100).toFixed(
                          1
                        )}%`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}

const data = [
  { name: "Needs", value: 45 },
  { name: "Wants", value: 28 },
  { name: "Savings", value: 10 },
  { name: "Debt", value: 10 },
  { name: "Other", value: 7 },
];

export default function CustomPieChart() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between">
      <ResponsiveContainer width={200} height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            <Label
              value={"$1,000"}
              position="center"
              className="text-3xl font-bold"
              fill="#000"
            />

            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="w-[180px]">
        <ul>
          {data.map((entry, index) => (
            <li
              key={index}
              className="flex items-center justify-between xl:gap-10 text-neutral-700 text-base font-normal leading-tight"
            >
              <div className="flex gap-2 items-center">
                <div
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                  className="w-3 h-3 rounded"
                ></div>
                {entry.name}
              </div>
              <span className="font-medium">{entry.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
