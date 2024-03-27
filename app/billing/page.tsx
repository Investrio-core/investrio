"use client";
import { useSession } from "next-auth/react";

import { Loading } from "../components/ui/Loading";
import TrialBlock from "../components/Billing/TrialBlock";
import SubscriptionBlock from "../components/Billing/SubscriptionBlock";
import LinkOutline from "../components/ui/LinkOutline";

import PlusOutlineIcon from "@/public/icons/plus-outline.svg";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import mixpanel from "mixpanel-browser";
import Mixpanel from "@/services/mixpanel";

const CALENDLY_URL = "https://calendly.com/investrio-joyce";

export default function BudgetTool() {
  const { data } = useSession();
  const mixpanelCalled = useRef<boolean>(false)

  
  if (!data?.user) {
    return <Loading />;
  }
  
  useEffect(() => {
    if (mixpanelCalled.current) return;
    Mixpanel.getInstance().track('view_billing')
    
    mixpanelCalled.current = true;
  }, [])

  return (
    <div className="px-[32px] py-[32px]">
      <div className="flex justify-between">
        <h2 className="text-[32px] font-bold">Billing</h2>
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
        {data.user.isTrial && (
          <>
            <TrialBlock trialEndsAt={data.user.trialEndsAt!} />
          </>
        )}
        <SubscriptionBlock data={data.user} />
      </div>
    </div>
  );
}
