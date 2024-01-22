'use client';

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

const options = [
  {
    label: 'Pay off credit cards',
    value: 'pay-off-credit-cards'
  },
  {
    label: "Wipe out loans",
    value: "wipe-out-loans"
  },
  {
    label: "Save for emergencies",
    value: "save-for-emergencies"
  },
  {
    "label": "Save for retirement",
    "value": "save-for-retirement"
  },
  {
    "label": "Buy a home",
    "value": "buy-a-home"
  },
  {
    "label": "Buy a car",
    "value": "buy-a-car"
  },
  {
    "label": "Improve my credit score",
    "value": "improve-my-credit-score"
  },
  {
    "label": "Lower tax",
    "value": "lower-tax"
  },
  {
    "label": "Build wealth",
    "value": "build-wealth"
  },
  {
    "label": "Understand my financial habits",
    "value": "understand-my-financial-habits"
  },
  {
    "label": "Learn new financial topics",
    "value": "learn-new-financial-topics"
  },
]

export default function GoalsPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const setSelectedItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item))
    } else {
      setSelectedItems([...selectedItems, item])
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option) => (
          <button
            onClick={() => setSelectedItem(option.value)}
            key={option.value}
            className={
              twMerge(
                "h-[82px] shadow-md transition duration-200 border rounded border-primary bg-primary text-sm p-2",
                "hover:bg-primary/30",
                selectedItems.includes(option.value) ? "bg-primary/30" : "bg-white")
            }>
            <h1 className="font-semibold text-slate-600 mb-2">{option.label}</h1>
          </button>
        ))}
      </div>

      <Link href={"/auth/signup/plans"} className="btn btn-primary mt-4 w-full" type="submit">Save & Continue</Link>
    </>
  )
}