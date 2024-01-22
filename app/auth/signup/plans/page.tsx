'use client';

import { twMerge } from "tailwind-merge";
import Link from "next/link";
import Form from "@/app/components/forms/Form";

const features = [
  {
    title: 'Unlock customized financial plans ',
  },
  {
    title: 'Instructional videos and content',
    extra: '(a $550 value)'
  },
  {
    title: 'Live support and exclusive webinars'
  },
  {
    title: 'Get access first to the budgeting and investing features',
    extra: '(Coming Soon)'
  }
]

export default function PlansPage() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((option) => (
          <div
            key={option.title}
            className={
              twMerge(
                "flex flex-col items-center text-center justify-center",
                "shadow-md transition duration-200 border rounded border-white bg-primary/50 p-2"
              )
            }>
            <span className="font-semibold text-sm text-white mb-2">
              {option.title} <br/>
              <span className="text-xs">{option.extra}</span>
            </span>
          </div>
        ))}
      </div>

      <Form onSubmit={console.log}>
        <div className="flex flex-col gap-10 mt-10">
          <label className="cursor-pointer w-full">
            <input type="radio" className="peer sr-only" name="pricing"/>
            <div
              className="mx-auto shadow-xl max-w-md px-20 rounded-md bg-white p-5 text-gray-600 ring-2 ring-transparent transition-all peer-checked:text-white peer-checked:border-white peer-checked:bg-primary/50">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between font-bold ">
                  <p className="text-md">12 months</p>
                  <div>
                    $99.99
                  </div>
                </div>
                <div className="flex items-end justify-between italic text-sm">
                  <p>Billed once, 35% savings</p>
                  <p className="textsm font-bold">$0.27/day</p>
                </div>
              </div>
            </div>
          </label>

          <label className="cursor-pointer w-full">
            <input type="radio" className="peer sr-only" name="pricing"/>
            <div
              className="mx-auto shadow-xl max-w-md px-20 rounded-md border border-primary bg-white p-5 text-gray-600 ring-2 ring-transparent transition-all peer-checked:text-white peer-checked:border-white peer-checked:bg-primary/50">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between font-bold ">
                  <p className="text-md">1 month</p>
                  <div>
                    $12.99
                  </div>
                </div>
                <div className="flex items-end justify-between italic text-sm">
                  <p>Billed monthly</p>
                  <p className="textsm font-bold">$0.43/day</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </Form>

      <Link href={"/auth/signup/checkout"} className="btn btn-primary mt-4 w-full" type="submit">Save & Continue</Link>
    </>
  )
}