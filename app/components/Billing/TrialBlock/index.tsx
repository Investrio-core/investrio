'use client'
import React, { useState, useEffect } from "react";
import CheckMarkIcon from "@/public/icons/checkmark.svg";
import dayjs from "dayjs";

interface TrialBlockProps {
  trialEndsAt: string;
}

const TrialBlock = ({ trialEndsAt }: TrialBlockProps) => {
  return (
    <div className="w-[50%] p-8 border rounded-xl bg-white">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">Trial</div>
        <div className="bg-gray-2 rounded-lg text-purple-3 font-medium px-2">
          Active
        </div>
      </div>

      <div className="text-5xl font-bold mt-6">$ 0.00</div>

      <hr className="my-6" />

      <ul>
        <li className="flex items-center gap-2 text-base font-normal">
          <CheckMarkIcon className="bg-purple-3 rounded-full" />
          All basic services
        </li>
        <li className="flex items-center gap-2 text-base font-normal">
          <CheckMarkIcon className="bg-purple-3 rounded-full" />
          Scheduling & budgeting
        </li>
        <li className="flex items-center gap-2 text-base font-normal">
          <CheckMarkIcon className="bg-purple-3 rounded-full" /> Unlimited
          invitations
        </li>
      </ul>

      <hr className="my-6" />

      <div className="flex justify-between text-base font-normal">
        <div>Trial End Date: </div>
        <div className="font-medium">
          {dayjs(trialEndsAt).format("DD.MM.YY")}
        </div>
      </div>

      <div className="text-base font-semibold text-purple-3 flex items-center justify-center gap-3 mt-8 h-12">
        <CheckMarkIcon className="bg-purple-3 rounded-full" />
        Current Plan
      </div>
    </div>
  );
};

export default TrialBlock;
