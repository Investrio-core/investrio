import { useState } from "react";
import CategoryBlockItem from "../CategoryBlockItem";
import { FaPlus, FaCircleMinus, FaCirclePlus, FaMinus } from "react-icons/fa6";
import { formatCurrency, toFixed } from "@/app/utils/formatters";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetItem } from "@/app/dashboard/budget/components/BudgetTool";

export type CategoryType = "needs" | "savings" | "debts" | "wants" | "assets";

interface CategoryBlockProps {
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
  useValueKey?: object;
  combinedCategories: {
    [category: string]: {
      [categoryName: string]: {
        items: BudgetItem[];
        categoryName: string;
        total: number;
        percent: number;
      };
    };
  };
  collapseCategories?: string[];
}

const defaultCategories = [
  { name: "needs", percent: 50 },
  { name: "wants", percent: 30 },
  { name: "savings", percent: 10 },
  { name: "debts", percent: 10 },
];

const CategoryBlockCollapsible = ({
  budgetInfo,
  date,
  setLoading,
  renderAfterInput,
  useCategories,
  useLabels,
  showRecommended = true,
  useValueKey = {},
  combinedCategories,
  collapseCategories,
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
      console.log("-- successfully made request --");
      console.log(data);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool", year, month] });
    },
  });

  const onSubmit = async (category: {
    [key in "needs" | "savings" | "debts" | "wants" | "assets"]: {
      name: string;
      value: number;
      recurringExpense?: string;
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

  const categories = useCategories ?? defaultCategories;
  const collapsableCategories = categories.filter((category) =>
    collapseCategories?.includes(category.name)
  );
  console.log("-- collapsable categories --");
  console.log(collapseCategories);
  console.log("-- combined categories ");
  console.log(combinedCategories);

  const normalCategories = categories.filter(
    (category) => !collapseCategories?.includes(category.name)
  );
  const [isOpen, setIsOpen] = useState({});

  return (
    <div className="w-[100vw] lg:w-[100%] lg:w-full bg-white mt-[12px] rounded-[12px] border lg:p-[24px] mb-[20px]">
      {normalCategories.map((category, idx) => {
        const name = category.name as CategoryType;
        const items = budgetInfo[name];
        const alternativeLabel = useLabels ? useLabels?.[idx] : undefined;
        const _useValueKey =
          useValueKey[name] !== undefined ? useValueKey[name] : "value";

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

      {collapsableCategories.map((category, idx) => {
        console.log(category);
        console.log(combinedCategories);
        console.log(combinedCategories[category.name]);
        const items = budgetInfo[category.name];
        const totalItemsValue = items.reduce((p, c) => {
          if (c["initialBalance"]) {
            return p + c["initialBalance"];
          }
          return p;
        }, 0);

        const actualPercentage = `${category.percent ?? 0}%`;

        return (
          <div
            key={category.name}
            className="flex text-base font-medium flex-col rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px] p-[12px]"
          >
            <div className="text-slate-950 text-[28px] font-medium capitalize px-[12px] py-4">
              {category.name}
            </div>
            <div className="flex justify-between lg:justify-start text-base font-medium text-gray-1 px-[12px] py-[8px]">
              <div className="w-3/6 lg:w-4/6 text-[#4c5f7f] text-md font-semibold uppercase tracking-tight">
                ACTUAL
              </div>
              <div className="w-1/6 mr-[9%] lg:w-1/6 text-left text-[#8e8ecc] font-semibold text-md">
                {actualPercentage}
              </div>
              <div className="w-2/6 lg:w-1/6 lg:text-right text-[#03091d] font-medium text-md">
                {totalItemsValue !== 0 ? formatCurrency(totalItemsValue) : "-"}
              </div>
            </div>

            {Object.keys(combinedCategories[category.name]).map((key) => {
              console.log(key);
              const currentCategory = combinedCategories[category.name][key];
              const name = currentCategory.categoryName;
              const categoryTotal = currentCategory.total;
              const items = currentCategory.items;
              const percent = currentCategory.percent;

              //  {isOpen[key]}
              return (
                <>
                  <div
                    className="flex text-base font-medium flex-col p-[12px] w-[100%]"
                    style={{
                      borderTop: "1px solid #b1b2ff",
                      borderBottom: "1px solid #b1b2ff",
                      // margin: "-10px",
                    }}
                    onClick={() =>
                      setIsOpen((prevState) => {
                        return { ...prevState, [key]: !prevState[key] };
                      })
                    }
                  >
                    <div className="w-[100%] font-normal text-md flex items-center gap-[8px] relative ">
                      {!isOpen[key] ? (
                        <FaPlus color="#8740E2" />
                      ) : (
                        <FaMinus color="#8740E2" />
                      )}
                      <div>{name}</div>
                      <div
                        className="w-1/3 lg:w-1/6 font-medium text-right flex flex-col text-slate-950"
                        style={{
                          justifySelf: "flex-end",
                          alignSelf: "flex-end",
                          position: "absolute",
                          right: 0,
                        }}
                      >
                        <div>{formatCurrency(categoryTotal)}</div>
                      </div>
                    </div>
                  </div>
                  {isOpen[key] ? (
                    <CategoryBlockItem
                      onSubmit={onSubmit}
                      category={category.name}
                      key={category.name}
                      name={category.name}
                      income={income}
                      percent={percent}
                      items={items}
                      alternativeLabel={name}
                      showRecommended={false}
                      useValueKey={"initialBalance"}
                      // useNameKey={"title"}
                      useCategories={useCategories}
                    />
                  ) : null}
                </>
              );
            })}

            {/* {isOpen ? <FaCirclePlus color="#8740E2" /> : <FaCircleMinus color="#8740E2" /> } */}
            {/* <div className="flex text-base font-medium flex-col rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px]">
        <div
          className="flex w-full h-[50px] px-[12px] border-b cursor-pointer hover:bg-slate-50"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <div className="w-2/3 lg:w-5/6 font-normal text-lg flex items-center">
            {isOpen ? <FaPlus color="#8740E2" /> : <FaMinus color="#8740E2" />}
            {category}
          </div>
          <div className="w-1/3 lg:w-1/6 font-medium text-right flex flex-col justify-center">
            <div>{categoryTotal}</div>
          </div>
        </div>
      </div>  */}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBlockCollapsible;
