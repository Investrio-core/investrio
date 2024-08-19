"use client";

import Mixpanel from "@/services/mixpanel";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import DashboardTool from "./components/DashboardTool";

export default function Dashboard() {
  const { data } = useSession();
  const params = useSearchParams();
  const mixpanelCalled = useRef<boolean>(false);

  useEffect(() => {
    if (params.get("success")) {
      if (mixpanelCalled.current) return;
      Mixpanel.getInstance().identify(
        data?.user.id!,
        data?.user.email!,
        data?.user.name!
      );
      Mixpanel.getInstance().track("google_authorization");

      mixpanelCalled.current = true;
    }
    // redirect("/dashboard/debts");
  }, []);

  return <DashboardTool />;
}
