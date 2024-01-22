"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers = (props: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ToastContainer />
        {props.children}
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
