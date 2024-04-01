"use client";
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
};

const subscriptionItems = [
  "Debt killer tool",
  "Monthly budgeting tool",
  "Book calls with your money coach",
  "Plaid Integration (coming soon)",
  "Personalized Money suggestions (coming soon)",
  "Investment Tools (coming soon)",
  "Money community and exclusive content (coming soon)",
  "Mobile app (coming soon)",
];

const PaywallSubscription = ({ data }: TrialBlockProps) => {
  const axios = useAxiosAuth();

  const handleActivateClick = async () => {
    const link = await axios.get("/subscription/link/");

    window.location = link.data.url;
  };

  const badgeColor = STATUSES_COLOR["active"];

  return (
    <div className="p-8 border  rounded-xl bg-white">
      {/* header */}
      <div
        className={`${badgeColor.bg} ${badgeColor.text} text-base w-fit rounded-lg font-medium px-2 capitalize`}
      >
        LIMITED TIME PRICING
      </div>

      <div className="my-6">
        <div className="text-[15px]">
          The only subscription that saves you hundreds of dollars per year.
          <br />
          Join Investrio platform early and receive a discount!
        </div>
        <div className="text-2xl font-semibold mt-6">Early Access Only</div>
      </div>

      <div className="text-5xl font-bold">
        $59.99 <span className="text-base font-normal">/ year</span>
      </div>

      <hr className="my-6" />
      <ul>
        {!data.trialEndsAt && (
          <li className="flex items-center gap-2 text-base font-normal">
            <CheckMarkIcon className="bg-purple-3 rounded-full" />7 days FREE
            trial
          </li>
        )}
        {subscriptionItems.map((item) => (
          <li className="flex items-center gap-2 text-base font-normal">
            <CheckMarkIcon className="bg-purple-3 rounded-full" />
            {item}
          </li>
        ))}
      </ul>

      <div className="text-sm mt-6">
        Cancellation policy:  If you choose to cancel the service after your
        card has been billed for the year, there will be no refund. Your
        subscription will continue to be active until the end of your current
        billing cycle. Your subscription will not renew following the end of
        your current billing cycle.
      </div>

      <div className="text-base font-medium text-purple-3 flex items-center justify-center gap-3 mt-8">
        {!data.trialEndsAt ? (
          <Button
            classProp="!w-full"
            text="Subscribe (7 days FREE trial)"
            onClick={handleActivateClick}
          />
        ) : (
          <Button
            text="Subscribe"
            classProp="!w-full"
            onClick={handleActivateClick}
          />
        )}
      </div>
    </div>
  );
};

export default PaywallSubscription;
