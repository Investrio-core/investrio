"use client";
import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Label } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6584FF"];

const FIGMA_COLORS = ["#F72585", "#7209B7", "#480CA8"]; //, "#FFBB28"];

const ratios = [
  { name: "Needs", value: 0.5 },
  { name: "Wants", value: 0.3 },
  { name: "Savings/Debt", value: 0.2 },
];

export function ScaledPieChart({ income }: { income: number }) {
  const scaledData = ratios.map(({ name, value }) => {
    return { name: name, value: income ? income * value : 1 * value };
  });

  const dollarFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="flex flex-col min-[1106px]:flex-row items-center justify-between">
      {/* <ResponsiveContainer width={200} height={250}> */}
      <PieChart width={200} height={250}>
        <Pie
          data={scaledData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
        >
          <Label
            value={income ? dollarFormatter.format(income) : "100%"}
            position="center"
            className="text-xl font-bold"
            fill="#000"
          />

          {scaledData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={FIGMA_COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
      {/* </ResponsiveContainer> */}
      <div className="w-[240px] md:w-[200px] lg:w-[220px]">
        <ul>
          {scaledData.map((entry, index) => (
            <li
              key={index}
              className="flex items-center justify-between md:gap-2 lg:gap-4 xl:gap-10 text-neutral-700 text-base font-normal leading-tight"
            >
              <div className="flex gap-2 items-center">
                <div
                  style={{
                    backgroundColor: FIGMA_COLORS[index % COLORS.length],
                  }}
                  className="w-3 h-3 rounded"
                ></div>
                {entry.name}
              </div>
              <span className="font-medium mr-[10px] justify-end items-end">
                {income
                  ? dollarFormatter.format(entry.value)
                  : `${entry.value * 100}%`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
