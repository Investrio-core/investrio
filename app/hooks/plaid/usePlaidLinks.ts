import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMemo } from "react";
import { MdDataArray } from "react-icons/md";

const categories = ["needs", "wants", "savings", "debts"];

export enum AccountCategory {
  PERSONAL = 0,
  BUSINESS,
  MIXED,
}

export default function usePlaidLinks(date?: Date | null) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  // const year = date?.getFullYear() ?? new Date().getFullYear();
  // const month = date?.getMonth() ?? new Date().getMonth();

  const resetItemAccountsCategories = async (itemId: string) => {
    console.log("resetting accounts");
    console.log(itemId);

    const updatedAccountsResult = await axiosAuth.post(
      "/plaid/updateAccounts",
      {
        itemId,
        updatedAccount: { accountCategory: null },
      }
    );
    console.log("updated accounts result");
    console.log(updatedAccountsResult);
    queryClient.invalidateQueries({ queryKey: ["plaidLinks"] });
    return updatedAccountsResult;
  };

  const resetAccountCategory = async (id: string, itemId: string) => {
    console.log("-- resetting account --");
    console.log(id);
    console.log(itemId);
    const updatedAccountResult = await axiosAuth.post("/plaid/updateAccount", {
      updatedAccount: { id, itemId, accountCategory: null },
    });
    queryClient.invalidateQueries({ queryKey: ["plaidLinks"] });
    return updatedAccountResult;
  };

  // Partial<PlaidAccount> & { id: string; itemId: string };
  const updateAccount = async (updatedAccount: {
    id: string;
    itemId: string;
    accountCategory: "Personal" | "Business" | "Mixed";
  }) => {
    const updatedAccountResult = await axiosAuth.post("/plaid/updateAccount", {
      updatedAccount: { ...updatedAccount },
    });
    queryClient.invalidateQueries({ queryKey: ["plaidLinks"] });
    return updatedAccountResult;
  };

  const isClassifiedPredicate = (acc: any) =>
    acc.accountCategory === "Personal" ||
    acc.accountCategory === "Business" ||
    acc.accountCategory === "Mixed";

  const getUnclassifiedAccounts = () => {
    console.log("accounts");
    console.log(data);
    console.log(data?.data?.success);
    console.log(
      data?.data?.success
        // ?.map((dataArr) => dataArr.accounts)
        ?.flatMap((dataArr) => dataArr.accounts)
        ?.filter((acc) => !isClassifiedPredicate(acc))
    );

    return (
      data?.data?.success
        // ?.map((dataArr) => dataArr.accounts))
        ?.flatMap((dataArr) => dataArr.accounts)
        ?.filter((acc) => !isClassifiedPredicate(acc))
    );
  };

  const allAccountsClassifiedNoId = () => {
    const allAccounts = data?.data?.success
      ?.map((dataArr) => dataArr.accounts)
      .flatMap();
    console.log(allAccounts);

    const allAccountsClassified = allAccounts?.every(isClassifiedPredicate);

    console.log("Classifying all accounts");
    console.log(allAccounts);
    console.log(allAccountsClassified);

    return allAccountsClassified;
  };

  const allAccountsClassified = (itemId?: string) => {
    if (!itemId) {
      return allAccountsClassifiedNoId();
    }

    if (itemId) {
      console.log(
        "are all accounts with this itemId classified, itemId: ",
        itemId
      );
      const currentItemAccounts = data?.data?.success?.accounts?.filter(
        (acc: any) => acc.itemId === itemId
      );
      console.log(currentItemAccounts);
      const allAccountsClassified = currentItemAccounts?.every(
        isClassifiedPredicate
      );
      console.log(allAccountsClassified);

      return allAccountsClassified;
    }
  };

  const { data, isLoading, isFetched, refetch } = useQuery({
    queryKey: ["plaidLinks"],
    queryFn: async () => {
      const plaidLinks = await axiosAuth.get(`/plaid/getPlaidLinks`);
      return plaidLinks;
    },
    staleTime: 45 * (60 * 1000), // 45 mins
    refetchOnWindowFocus: false, // default: true
    refetchOnMount: false,
    // refetchOnWindowFocus: true,
    // enabled: !!(year && month), // !!date,
  });

  return {
    plaidLinks: data,
    refetch,
    updateAccount,
    allAccountsClassified,
    getUnclassifiedAccounts,
    resetAccountCategory,
    resetItemAccountsCategories,
  };
}
