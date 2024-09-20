import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import CategoryBlockItem from "../CategoryBlockItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CategoryType = "needs" | "savings" | "debts" | "wants" | "assets";

export interface CategoryTypeItem {
  category: {
    [key in CategoryType]: {
      name: string;
      value: number;
      recurringExpense?: string;
    }[];
  };
}

export interface CategoryBlockProps {
  renderAfterInput?: JSX.Element;
  budgetInfo: {
    needs: { value: number; name: string }[];
    wants: { value: number; name: string }[];
    savings: { value: number; name: string }[];
    debts: { value: number; name: string }[];
    income: number;
    id?: string;
  };
  date: {
    year: number | undefined;
    month: number | undefined;
  };
  setLoading: (value: boolean) => void;
  useCategories?: { name: CategoryType; percent: number }[];
  useLabels?: string[];
  showRecommended?: boolean;
  useValueKey?: { [key: string]: CategoryType };
}

const defaultCategories = [
  { name: "needs", percent: 50 },
  { name: "wants", percent: 30 },
  { name: "savings", percent: 10 },
  { name: "debts", percent: 10 },
];

const CategoryBlock = ({
  budgetInfo,
  date,
  setLoading,
  renderAfterInput,
  useCategories,
  useLabels,
  showRecommended = true,
  useValueKey = undefined,
}: CategoryBlockProps) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const { income } = budgetInfo;

  const { year, month } = date;

  const { mutateAsync: create } = useMutation({
    mutationKey: ["category"],
    mutationFn: async (category: any) => {
      setLoading(true);

      const data = await axiosAuth.post(`/budget/create`, {
        ...category,
        year,
        month,
      });
      setLoading(false);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool", year, month] });
    },
    onError: (e) => {
      console.log("something went wrong creating a budget item");
      console.error(e);
    },
  });

  const { mutateAsync: update } = useMutation({
    mutationKey: ["category"],
    mutationFn: async (category: any) => {
      queryClient.setQueryData(["budget-tool", year, month], (oldData: any) => {
        if (oldData?.data === undefined) return oldData;

        const categoryKey = Object.keys(category)?.[0];
        if (categoryKey) {
          const newData = {
            ...oldData,
            data: { ...oldData.data, [categoryKey]: category[categoryKey] },
          };
          return newData;
        }
        return oldData;
      });

      setLoading(true);

      const data = await axiosAuth.put(
        `/budget/update-category/${budgetInfo?.id}`,
        { ...category }
      );

      setLoading(false);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool", year, month] });
    },
  });

  const onSubmit = async (category: CategoryTypeItem) => {
    setLoading(true);
    if (budgetInfo?.id) {
      await update(category);
      setLoading(false);
      return;
    }

    await create(category);
    setLoading(false);
  };

  const categories = useCategories ?? defaultCategories;

  return (
    <div className="w-[100vw] lg:w-[100%] lg:w-full bg-white mt-[12px] rounded-[12px] border lg:p-[24px] mb-[20px]">
      {renderAfterInput ? (
        <div className="rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px]">
          {renderAfterInput}
        </div>
      ) : null}
      {categories.map((category, idx) => {
        const name = category.name as "needs" | "savings" | "debts" | "wants";
        const items = budgetInfo[name];
        const alternativeLabel = useLabels ? useLabels?.[idx] : undefined;
        const _useValueKey =
          useValueKey !== undefined &&
          useValueKey[name as CategoryType] !== undefined
            ? (useValueKey[name] as CategoryType)
            : "value";

        return (
          <CategoryBlockItem
            onSubmit={onSubmit}
            category={name}
            key={category.name}
            name={category.name}
            income={income}
            percent={category.percent}
            items={items}
            alternativeLabel={alternativeLabel}
            showRecommended={showRecommended}
            useValueKey={_useValueKey}
            useCategories={useCategories}
          />
        );
      })}
    </div>
  );
};

export default CategoryBlock;
