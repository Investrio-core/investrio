'use client';
import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Label } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#6584FF'];

const data = [
  { name: 'Needs', value: 45 },
  { name: 'Wants', value: 28 },
  { name: 'Savings', value: 10 },
  { name: 'Debt', value: 10 },
  { name: 'Other', value: 7 },
];

export default function CustomPieChart() {

  return (
    <div className="flex flex-row items-center justify-between xl:px-10">
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
            <Label value={"$1,000"} position="center" className="text-3xl font-bold" fill="#000"/>

            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div>
        <ul>
          {data.map((entry, index) => (
            <li key={index} className="flex items-center justify-between xl:gap-10">
              <div className="flex gap-2 items-center">
                <div style={{
                  backgroundColor: COLORS[index % COLORS.length]
                }} className="w-3 h-3 rounded"></div>
                {entry.name}
              </div>
              <span>{entry.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
