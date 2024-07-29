"use client";
import { formatCurrency } from "@/app/utils/formatters";
import EditIcon from "@/public/icons/edit.svg";
import IconButton from "../../ui/IconButton";
import RangeSlider from "../../ui/RangeSlider";
import { useEffect, useState } from "react";
import IncomeModal from "../IncomeModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";

import { FaPlus, FaMinus, FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import BoundInput from "../../ui/BoundInput";
import { SimpleButton } from "../../ui/buttons";
import MultiInputBlock from "../../ui/MultiInputBlock";

const STEP_VALUE = 100;

interface IncomeBlockProps {
  budgetInfo: {
    income: number;
    id: string;
  };
  date: {
    year: number | undefined;
    month: number | undefined;
  };
  sumCategories: number;
  setLoading: (value: boolean) => void;
  isLoading: boolean;
  incomeAfterExpenses: number;
}

const Income = ({
  budgetInfo,
  date,
  setLoading,
  isLoading,
  sumCategories,
  incomeAfterExpenses,
}: IncomeBlockProps) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [income, setIncome] = useState(budgetInfo.income || 0);

  const { year, month } = date;

  const { mutateAsync: create, isPending: createIsPending } = useMutation({
    mutationKey: ["income"],
    mutationFn: async () => {
      return await axiosAuth.post(`/budget/create`, {
        income: income,
        year,
        month,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool", year, month] });
      setIncome(income);
    },
  });

  const { mutateAsync: update, isPending: updateIsPending } = useMutation({
    mutationKey: ["income"],
    mutationFn: async () => {
      return await axiosAuth.put(`/budget/update-income/${budgetInfo?.id}`, {
        income: income,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool", year, month] });
      toast.success("Income updated");
      setIncome(income);
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    if (budgetInfo?.id) {
      await update();
      setLoading(false);
      return;
    }

    await create();
    setLoading(false);
  };

  useEffect(() => {
    if (updateIsPending === true || createIsPending === true) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [updateIsPending, createIsPending]);

  // const incomeAfterExpenses = budgetInfo.income - sumCategories;
  const formattedIncome = formatCurrency(incomeAfterExpenses);

  return (
    <div className="relative lg:w-[50%] p-[24px] bg-indigo-50 rounded-[18px] border border-violet-200 mx-[16px] mt-[16px] mb-[10px] flex flex-col items-center justify-center">
      <MultiInputBlock
        number={income}
        lastSavedNumber={budgetInfo?.income}
        setNumber={setIncome}
        sectionTitle={"Monthly After Tax Income"}
        step={100}
        min={0}
        max={30000}
        isLoading={isLoading}
        onSubmit={onSubmit}
        sectionTitleStyles=""
      />
      {budgetInfo?.income ? (
        <div className="text-lg mt-3">
          <span
            className={`font-bold ${
              incomeAfterExpenses < 0 ? "text-red-700" : "text-green-700"
            } `}
          >
            {formattedIncome}{" "}
          </span>
          left to spend
        </div>
      ) : null}
    </div>
  );
};

export default Income;
