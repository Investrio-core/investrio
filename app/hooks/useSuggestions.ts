import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useSession } from "next-auth/react";
import { PageType } from "../components/Suggestions/Suggestions";
import { useEffect, useState } from "react";
// const API_BASE_URL = process.env.API_BASE_URL + "/suggestions";

const API_BASE_URL = "/suggestions";

export const DEBT_SUGGESTIONS = ["balance-transfer", "debt-reduction"];
export const BUDGET_SUGGESTIONS = ["budgeting-prompt", "expense-management"];
// savings-debt

export default function useSuggestions(page: PageType) {
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // DEBT: total debt is then used to determine the appropriate financial advice to return
  const {
    data: debtBalanceSuggestion,
    isLoading: debtBalanceSuggestionLoading,
  } = useQuery({
    queryKey: ["balance-transfer"],
    queryFn: async () =>
      await axiosAuth.get(`${API_BASE_URL}/balance-transfer`),
    enabled: !!session?.user?.id,
  });

  const { data: budgetingPromptSuggestion, isLoading: budgetingPromptLoading } =
    useQuery({
      queryKey: ["budgeting-prompt"],
      queryFn: async () =>
        await axiosAuth.get(`${API_BASE_URL}/budgeting-prompt`),
      enabled: !!session?.user?.id,
    });

  const { data: debtReductionSuggestion, isLoading: debtReductionLoading } =
    useQuery({
      queryKey: ["debt-reduction"],
      queryFn: async () =>
        await axiosAuth.get(`${API_BASE_URL}/debt-reduction`),
      enabled: !!session?.user?.id,
    });

  const {
    data: expenseManagementSuggestion,
    isLoading: expenseManagementLoading,
  } = useQuery({
    queryKey: ["expense-management"],
    queryFn: async () =>
      await axiosAuth.get(`${API_BASE_URL}/expense-management`),
    enabled: !!session?.user?.id,
  });

  const { data: savingsDebtSuggestion, isLoading: savingsDebtLoading } =
    useQuery({
      queryKey: ["savings-debt"],
      queryFn: async () => await axiosAuth.get(`${API_BASE_URL}/savings-debt`),
      enabled: !!session?.user?.id,
    });

  console.log(API_BASE_URL);

  useEffect(() => {
    const _suggestions = [
      debtBalanceSuggestion?.data?.suggestion,
      debtReductionSuggestion?.data?.suggestion,
      budgetingPromptSuggestion?.data?.suggestion,
      expenseManagementSuggestion?.data?.suggestion,
      savingsDebtSuggestion?.data?.suggestion,
    ].filter((suggestion) => suggestion !== "");

    setSuggestions(_suggestions);

    console.log("-- suggestions changed --");
    console.log(_suggestions);
  }, [
    debtBalanceSuggestion,
    budgetingPromptSuggestion,
    debtReductionSuggestion,
    expenseManagementSuggestion,
    savingsDebtSuggestion,
  ]);

  const getSuggestions = () => {
    switch (page) {
      case "dashboard":
        return suggestions;
      case "debt":
        return suggestions?.slice(0, 2);
      case "budget":
        return suggestions?.slice(2);
      case "wealth":
        return [];
      default:
        return [];
    }
  };

  return { getSuggestions, suggestions };
}
