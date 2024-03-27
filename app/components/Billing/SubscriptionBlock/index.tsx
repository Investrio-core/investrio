'use client'
import React, { useState, useEffect } from "react";
import CheckMarkIcon from "@/public/icons/checkmark.svg";
import dayjs from "dayjs";
import { Button } from "../../ui/buttons";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";

interface TrialBlockProps {
  data: any;
}

const STATUSES_COLOR = {
  active: {
    text: "text-purple-3",
    bg: "bg-gray-2",
  },
  cancelled: {
    text: "text-red-500",
    bg: "bg-red-200",
  },
  failed: {
    text: "text-red-500",
    bg: "bg-red-200",
  },
};

const SubscriptionBlock = ({ data }: TrialBlockProps) => {
  const axios = useAxiosAuth();

  const handleActivateClick = async () => {
    const link = await axios.get("/subscription/manage/");

    window.location = link.data.url;
  };

  const handleManageClick = async () => {
    const link = await axios.get("/subscription/manage");

    window.location = link.data.url;
  };

  const status = data.subscriptionStatus as "active" | "cancelled" | "failed";
  const badgeColor = STATUSES_COLOR[status!];

  return (
    <div className="w-[50%] p-8 border rounded-xl bg-white">
      {/* header */}
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">Basic</div>
        {!data?.isTrial && data.isActive && (
          <div
            className={`${badgeColor.bg} ${badgeColor.text} rounded-lg font-medium px-2 capitalize`}
          >
            {data?.subscriptionStatus}
          </div>
        )}
      </div>

      <div className="text-5xl font-bold mt-6">$ 9.99</div>

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

      {data?.isActive ? (
        <div className="flex justify-between text-base font-normal">
          {data.subscriptionStatus === "cancelled" &&
          data.subscriptionCancelAt ? (
            <>
              <div>Cancel Date:</div>
              <div className="font-medium">
                {dayjs(data.subscriptionCancelAt)
                  .add(1, "M")
                  .format("DD.MM.YY")}
              </div>
            </>
          ) : (
            <>
              <div>Next Charge Date:</div>
              <div className="font-medium">
                {dayjs(data.subscriptionStartedOn)
                  .add(1, "M")
                  .format("DD.MM.YY")}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex justify-between text-base font-normal">
          <div>Payment:</div>
          <div className="font-medium">monthly</div>
        </div>
      )}

      <div className="text-base font-medium text-purple-3 flex items-center justify-center gap-3 mt-8">
        {data.isTrial || !data.isActive ? (
          <Button
            classProp="!w-full"
            text="Activate Subscription"
            onClick={handleActivateClick}
          />
        ) : (
          <Button
            text="Manage Subscription"
            classProp="!w-full bg-white text-purple-3 border border-purple-3 hover:bg-slate-200"
            onClick={handleManageClick}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionBlock;
