"use client";
import React, { useState, useEffect } from "react";
import CheckMarkIcon from "@/public/icons/checkmark.svg";
import dayjs from "dayjs";
import { Button } from "../../ui/buttons";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";

interface TrialBlockProps {
  subscriptionStatus: "active" | "cancelled" | "failed";
  isTrial: boolean
}

const STATUSES_COLOR = {
  active: {
    text: "text-purple-3",
    bg: "bg-gray-2",
  },
  trial: {
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

const SubscriptionBlock = ({ subscriptionStatus, isTrial }: TrialBlockProps) => {
  const axios = useAxiosAuth();

  const handleManageClick = async () => {
    const link = await axios.get("/subscription/manage");

    window.location = link.data.url;
  };

  const status = isTrial ? 'trial' : subscriptionStatus as "active" | "cancelled" | "failed";
  const badgeColor = STATUSES_COLOR[status!];

  return (
    <div className="w-[50%] p-8 border rounded-xl bg-white">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">Subscription Status:</div>
        <div className={`${badgeColor.bg} ${badgeColor.text} rounded-lg font-medium px-2 text-base capitalize`}>
          {status}
        </div>
      </div>

      <Button
        text="Manage Subscription"
        classProp="!w-full bg-white text-purple-3 border border-purple-3 hover:bg-slate-200 mt-8"
        onClick={handleManageClick}
      />
    </div>
  );
};

export default SubscriptionBlock;
