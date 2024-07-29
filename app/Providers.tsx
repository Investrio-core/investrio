"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { TabContextProvider } from "./context/TabContext/context";
interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers = (props: Props) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TabContextProvider>
          <ToastContainer />
          {props.children}
        </TabContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
