"use client";
import { formatCurrency } from "@/app/utils/formatters";
import EditIcon from "@/public/icons/edit.svg";
import IconButton from "../../ui/IconButton";
import { useEffect, useState } from "react";
import IncomeModal from "../IncomeModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";

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
}

const IncomeBlock = ({
  budgetInfo,
  date,
  setLoading,
  sumCategories,
}: IncomeBlockProps) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [income, setIncome] = useState(budgetInfo.income || 0);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  const { year, month } = date;

  const handleChangeIncomeModalOpenOpen = () => {
    setIsIncomeModalOpen(!isIncomeModalOpen);
    setIncome(budgetInfo.income);
  };

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
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    if (budgetInfo?.id) {
      await update();
      setIsIncomeModalOpen(false);
      setLoading(false);
      return;
    }

    await create();
    setLoading(false);
    setIsIncomeModalOpen(false);
  };

  useEffect(() => {
    if (updateIsPending === true || createIsPending === true) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [updateIsPending, createIsPending]);

  const incomeAfterExpenses = budgetInfo.income - sumCategories;
  const formattedIncome = formatCurrency(incomeAfterExpenses);

  return (
    <div className="w-[50%] bg-white p-[24px] border rounded-[12px]">
      <div className="flex justify-between mb-[35px]">
        <h3 className="text-2xl font-medium capitalize">
          Monthly after tax income
        </h3>
        <IconButton
          onClick={handleChangeIncomeModalOpenOpen}
          Icon={EditIcon}
          className="self-end max-[1210px]:self-start"
        />
      </div>
      <div>{budgetInfo?.income ? formattedIncome : "$0"}</div>
      {budgetInfo.income ? (
        <div className="text-lg">

          left to spend
        </div>
      ) : (
        <div>Please assign your budget</div>
      )}
      <IncomeModal
        onClose={handleChangeIncomeModalOpenOpen}
        open={isIncomeModalOpen}
        value={income}
        onChange={(val) => setIncome(Number(val))}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default IncomeBlock;
