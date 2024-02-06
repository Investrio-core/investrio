"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useSession } from "next-auth/react"
import "react-toastify/dist/ReactToastify.css";
interface Props {
  children: ReactNode;
}

const queryClient = new QueryClient();

const Providers = (props: Props) => {
  return (
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
            <ToastContainer />
            {props.children}
        </QueryClientProvider>
      </SessionProvider>
  );
};

export default Providers;
