import { post } from "@/utils/httpClient";
import { Debt, formatDebtsForApi } from "../formatDebtsForApi";
import { Session } from "next-auth";
import { toast } from "react-toastify";

/**
 * @deprecated
 * @param debts
 * @param extraPayAmount
 */
export const createDebts = async (debts: Debt[], extraPayAmount: string) => {
  try {
    const data = {
      debts: formatDebtsForApi(debts, extraPayAmount),
    };

    // console.log(data.debts, "data");

    const response = await post("/api/user/financials", data.debts);

    // console.log(response);

    if (response.status === 200) {
      console.log("Debts added successfully");
      toast.success("Great! Your debt has been successfully added.");
    }
  } catch (error) {
    console.log(error);
    toast.error("Sorry, we encountered an error: " + error);
  }
};
