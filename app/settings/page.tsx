"use client";
import { useSession } from "next-auth/react";

import { Loading } from "../components/ui/Loading";
import SubscriptionBlock from "../components/Settings/SubscriptionBlock";
import LinkOutline from "../components/ui/LinkOutline";

import PlusOutlineIcon from "@/public/icons/plus-outline.svg";
import { useEffect, useRef } from "react";
import Mixpanel from "@/services/mixpanel";
import { redirect, useParams, useSearchParams } from "next/navigation";

const CALENDLY_URL = "https://calendly.com/investrio-joyce";

export default function BudgetTool() {
  const { data } = useSession();
  const params = useSearchParams();
  const mixpanelCalled = useRef<boolean>(false);
  const mixpanelPageCalled = useRef<boolean>(false);

  if (!data?.user) {
    return <Loading />;
  }

  useEffect(() => {
    if (mixpanelCalled.current) return;

    if (params.has("trial") && params.has("success")) {
      Mixpanel.getInstance().track("subscribed_to_trial");
      mixpanelCalled.current = true;

      redirect("/settings");
    }

    if (mixpanelPageCalled.current) return;

    Mixpanel.getInstance().track("view_settings");

    mixpanelPageCalled.current = true;
  }, []);

  return (
    <div className="px-[32px] py-[32px]">
      <div className="flex justify-between">
        <h2 className="text-[32px] font-bold">Settings</h2>
        <LinkOutline
          text="Book Your Consultation"
          Icon={PlusOutlineIcon}
          url={CALENDLY_URL}
        />
      </div>
      <div className="text-base font-normal mt-2 mb-10">
        Please review your plan. You can cancel your subscription at any time.
      </div>
      <div className="flex justify-between gap-6">
        <SubscriptionBlock
          subscriptionStatus={data.user.subscriptionStatus!}
          isTrial={data.user.isTrial!}
        />
      </div>
    </div>
  );
}
