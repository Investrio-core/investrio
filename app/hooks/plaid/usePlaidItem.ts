import { useState } from "react";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useQueryClient } from "@tanstack/react-query";
import useBudgetData from "../useData/useBudgetData";
import useDebtData from "../useData/useDebtData";

export type ValidLoadSteps = "accounts" | "debts" | "transactions" | undefined;

type KeyQuery =
  | "getTransactions"
  | "getAccounts"
  | "getDebts"
  | "loadAllDataFromLinkId";

const usePlaidItem = (itemId?: string) => {
  const queryClient = useQueryClient();
  const { refetch: refetchBudget } = useBudgetData();
  const { refetch: refetchDebt } = useDebtData();
  const axiosAuth = useAxiosAuth();
  const [accounts, setAccounts] = useState<object[]>();
  const [transactions, setTransactions] = useState<object[]>();
  const [debts, setDebts] = useState<object[]>();
  const [loadStepInProgress, setLoadStepInProgress] =
    useState<ValidLoadSteps>();
  const [loadingData, setLoadingData] = useState(false);
  const [loadedAccounts, setLoadedAccounts] = useState<Set<string>>(new Set());

  const session = useSession();
  // const userId = session.data?.user?.id; // .email

  // Get the accounts and finish with the classification process before moving on to
  // transactions and debts
  const getAccounts = async (linkId: string) => {
    setLoadingData(true);
    setLoadStepInProgress("accounts");

    const response = await axiosAuth.post(`/plaid/getAccountsData`, {
      key: "getAccounts" as KeyQuery,
      linkId,
    });
    console.log("got accounts");
    console.log(response);
    console.log(response?.data);
    setAccounts(response?.data);
    refetchBudget();
    setLoadingData(false);
    return response;
  };

  const getTransactions = async (linkId: string) => {
    const response = await axiosAuth.post(`/plaid/getAccountsData`, {
      key: "getTransactions" as KeyQuery,
      linkId,
    });
    console.log("got transactions");
    console.log(response);
    console.log(response?.data);
    setTransactions(response?.data);
    return response;
  };

  const getDebts = async (linkId: string) => {
    const response = await axiosAuth.post(`/plaid/getAccountsData`, {
      key: "getDebts" as KeyQuery,
      linkId,
    });
    console.log("got debts");
    console.log(response);
    console.log(response?.data);
    setDebts(response?.data);
    refetchDebt();
    return response;
  };

  const loadAllDataFromLinkId = async (linkId: string) => {
    // const response = await axiosAuth.post("/plaid/getAccountsData", {
    //   key: "loadAllDataFromLinkId" as KeyQuery,
    //   itemId,
    // });

    if (linkId === undefined) {
      return {};
    }

    setLoadingData(true);

    setLoadStepInProgress("accounts");
    const accResp = await getAccounts(linkId);

    // setLoadStepInProgress("debts");
    // const debtResp = await getDebts(linkId);

    // setLoadStepInProgress("transactions");
    // const transResp = await getTransactions(linkId);
    // setLoadingData(false);

    setLoadedAccounts((prevState) => {
      const newSet = new Set(prevState);
      newSet.add(linkId);
      return newSet;
    });
    // return { accounts: accResp, debts: debtResp, transactions: transResp };
    // return { debts: debtResp, transactions: transResp };
    return {};
  };

  const isAccountLoaded = (itemId: string) => {
    console.log("TESTING IF ACCOUNT WAS LOADED");
    console.log(loadedAccounts.has(itemId));
    return loadedAccounts.has(itemId);
  };

  return {
    getAccounts,
    accounts,
    getTransactions,
    transactions,
    getDebts,
    debts,
    loadAllDataFromLinkId,
    loadStepInProgress,
    loadingData,
    isAccountLoaded,
  };
};

export default usePlaidItem;
