"use client";

import React from "react";
import { backgroundColor } from "@/app/utils/constants";
import ChatWindow from "@/app/components/Chatbot/ChatWindow";
import { BotProvider } from "@/app/context/BotContext/context";
import { useTabContext } from "../context/TabContext/context";
import PlaidOrManualSelector from "../components/PlaidOrManualSelector";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    setTabs,
    setSubTab,
    subTab,
    tab,
    state,
    isDarkMode,
    showPlaidConnect,
    setShowPlaidConnect,
  } = useTabContext();

  console.log("-- what does layout know --");
  console.log(tab);
  console.log(subTab);

  return (
    //  h-screen
    // <div className="flex min-h-[91vh] justify-center items-center overflow-auto bg-violet-50"></div>
    <BotProvider>
      <div className={`flex min-h-[91vh] overflow-auto ${backgroundColor}`}>
        <div className="w-full flex">
          <div className="w-full flex">
            {showPlaidConnect ? (
              <div
                className={`lg:px-[28px] lg:py-[26px] ${backgroundColor} max-w-[100vw] md:max-w-[75vw] flex flex-col`}
              >
                <PlaidOrManualSelector
                  title={"Let’s Build Wealth!"}
                  blurb={
                    "Build a tailored plan, fit for your current lifestyle and future goals"
                  }
                  setShow={setShowPlaidConnect}
                />
              </div>
            ) : (
              children
            )}
            {/* {children} */}
          </div>
        </div>
      </div>
      <ChatWindow />
    </BotProvider>
  );
}
