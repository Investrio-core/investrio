import React, { useCallback, useState } from "react";

import {
  usePlaidLink,
  PlaidLinkOnSuccess,
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOptions,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useQueryClient } from "@tanstack/react-query";
import useBudgetData from "../useData/useBudgetData";
import useDebtData from "../useData/useDebtData";

type KeyQuery = "getTransactions" | "getAccounts" | "getDebts";

const usePlaidItem = (itemId?: string) => {
  const queryClient = useQueryClient();
  const { refetch: refetchBudget } = useBudgetData();
  const { refetch: refetchDebt } = useDebtData();
  const axiosAuth = useAxiosAuth();
  const [accounts, setAccounts] = useState<object[]>();
  const [transactions, setTransactions] = useState<object[]>();
  const [debts, setDebts] = useState<object[]>();

  const session = useSession();
  const userId = session.data?.user?.id; // .email

  // get a link_token from your API when component mounts
  const getAccounts = async () => {
    //   const response = await fetch("/api/plaid/generateToken", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       userId,
    //       itemId: itemId ?? null,
    //     }),
    //   });
    console.log("making request");

    const response = await axiosAuth.post(`/plaid/getAccountsData`, {
      key: "getAccounts" as KeyQuery,
    });
    console.log("got accounts");
    console.log(response);
    console.log(response?.data);
    setAccounts(response?.data);
    refetchBudget();
    return response;
  };

  const getTransactions = async () => {
    //   const response = await fetch("/api/plaid/generateToken", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       userId,
    //       itemId: itemId ?? null,
    //     }),
    //   });
    console.log("making request");

    const response = await axiosAuth.post(`/plaid/getAccountsData`, {
      key: "getTransactions" as KeyQuery,
    });
    console.log("got accounts");
    console.log(response);
    console.log(response?.data);
    setTransactions(response?.data);
    return response;
  };

  const getDebts = async () => {
    //   const response = await fetch("/api/plaid/generateToken", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       userId,
    //       itemId: itemId ?? null,
    //     }),
    //   });
    console.log("making request");

    const response = await axiosAuth.post(`/plaid/getAccountsData`, {
      key: "getDebts" as KeyQuery,
    });
    console.log("got accounts");
    console.log(response);
    console.log(response?.data);
    setDebts(response?.data);
    refetchDebt();
    return response;
  };

  return {
    getAccounts,
    accounts,
    getTransactions,
    transactions,
    getDebts,
    debts,
  };
};

export default usePlaidItem;
