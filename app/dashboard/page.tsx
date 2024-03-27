"use client";

import Mixpanel from "@/services/mixpanel";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Dashboard() {
  const { data } = useSession();
  const params = useSearchParams();
  const mixpanelCalled = useRef<boolean>(false);

  useEffect(() => {
    if (params.get("success")) {
      if (mixpanelCalled.current) return;
      Mixpanel.getInstance().identify(data?.user.id!, data?.user.email!, data?.user.name! )
      Mixpanel.getInstance().track("login");

      mixpanelCalled.current = true;
    }
    redirect("/dashboard/debts");
  }, []);
}
