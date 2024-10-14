"use client";

import React from "react";
import { backgroundColor } from "@/app/utils/constants";
import ChatWindow from "@/app/components/Chatbot/ChatWindow";
import { BotProvider } from "@/app/context/BotContext/context";

export default function DebtsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //  h-screen
    // <div className="flex min-h-[91vh] justify-center items-center overflow-auto bg-violet-50"></div>
    <BotProvider>
      <div className={`flex min-h-[91vh] overflow-auto ${backgroundColor}`}>
        <div className="w-full flex">
          <div className="w-full flex">{children}</div>
        </div>
      </div>
      <ChatWindow />
    </BotProvider>
  );
}
