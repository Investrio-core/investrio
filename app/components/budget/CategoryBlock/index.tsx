import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import CategoryBlockItem from "../CategoryBlockItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateCategoryItemModal from "../CreateCategoryItemModal";

interface CategoryBlockProps {
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
}

const categories = [
  { name: "needs", percent: 50 },
  { name: "wants", percent: 30 },
  { name: "savings", percent: 10 },
  { name: "debts", percent: 10 },
];

const CategoryBlock = ({
  budgetInfo,
  date,
  setLoading,
}: CategoryBlockProps) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const { income, needs, wants, savings, debts } = budgetInfo;

  const { year, month } = date;

  const { mutateAsync: create, isPending: createIsPending } = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["budget-tool"] });
    },
  });

  const { mutateAsync: update, isPending: updateIsPending } = useMutation({
    mutationKey: ["category"],
    mutationFn: async (category: any) => {
      setLoading(true);
      const data = await axiosAuth.put(
        `/budget/update-category/${budgetInfo?.id}`,
        { ...category }
      );
      setLoading(false);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool"] });
    },
  });

  const onSubmit = async (category: {
    [key in "needs" | "savings" | "debts" | "wants"]: {
      name: string;
      value: number;
    }[];
  }) => {
    setLoading(true);
    if (budgetInfo?.id) {
      await update(category);
      setLoading(false);
      return;
    }

    await create(category);
    setLoading(false);
  };

  return (
    <div className="w-full bg-white mt-[24px] rounded-[12px] border p-[24px]">
      <div className="flex text-base font-medium text-gray-1 px-[12px]">
        <div className="w-4/6">CATEGORY</div>
        <div className="w-1/6 text-right">RECOMMENDED</div>
        <div className="w-1/6 text-right">ACTUAL</div>
      </div>
      {categories.map((category) => {
        const name = category.name as "needs" | "savings" | "debts" | "wants";
        const items = budgetInfo[name];
        return (
          <CategoryBlockItem
            onSubmit={onSubmit}
            key={category.name}
            name={category.name}
            income={income}
            percent={category.percent}
            items={items}
          />
        );
      })}
    </div>
  );
};

export default CategoryBlock;
