import { formatCurrency, toFixed } from "@/app/utils/formatters";
import { FaCirclePlus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import CreateCategoryItemModal from "../CreateCategoryItemModal";
import { useEffect, useState } from "react";
import EditCategoryItemModal from "../EditCategoryItemModal";
import DeleteCategoryItemModal from "../DeleteCategoryItemModal";
import { toast } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { expenseEmojiMapping, emojiNames } from "./emoji-mapper";
import RenderEmoji from "@/app/components/ui/RenderEmoji";
import {
  BudgetItem,
  DEBT_REPAYMENT_STRATEGY_NAME,
} from "@/app/dashboard/budget/components/BudgetTool";
import { FiRepeat } from "react-icons/fi";
import Image from "next/image";
import { CategoryType } from "../CategoryBlock";
import useDebtQueries from "@/app/hooks/useDebtQueries";
import { DebtFormType } from "@/types/debtFormType";
import Mixpanel from "@/services/mixpanel";

type Locale = "wants" | "savings" | "needs" | "debts";

interface CategoryBlockItemProps {
  category: CategoryType;
  name: string;
  items: BudgetItem[];
  percent: number;
  income: number;
  onSubmit: (data: Record<Locale, { name: string; value: number }[]>) => void;
  alternativeLabel: string;
}

interface DebtFormCategoryItem {}

const CategoryBlockItem = ({
  category,
  name,
  items = [],
  percent,
  income,
  onSubmit,
  alternativeLabel,
}: CategoryBlockItemProps) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryItemModalOpen, setIsDeleteCategoryItemModalOpen] =
    useState(false);

  const [selectedItem, setSelectedItem] = useState<BudgetItem>({
    name: "",
    value: 0,
    recurringExpense: undefined,
  });

  const { createDebt, updateDebt, deleteRecords } = useDebtQueries();

  const [parent] = useAutoAnimate();

  const handleChangeCategoryModalOpen = () => {
    setIsCategoryModalOpen(!isCategoryModalOpen);
  };

  const handleChangeEditCategoryModalOpen = () => {
    setIsEditCategoryModalOpen(!isEditCategoryModalOpen);
  };

  const handleChangeDeleteCategoryItemModalOpen = () => {
    setIsDeleteCategoryItemModalOpen(!isDeleteCategoryItemModalOpen);
    setIsEditCategoryModalOpen(!isEditCategoryModalOpen);
  };

  const calculateRecommended = () => {
    if (!income) {
      return "-";
    }

    const recommend = income * (percent / 100);

    return formatCurrency(recommend);
  };

  const totalItemsValue = items.reduce((p, c) => p + c.value, 0);

  const calculateActualPercentage = () => {
    if (!income) {
      return "0%";
    }
    const percentage = (totalItemsValue / income) * 100;

    return `${toFixed(percentage, 2)}%`;
  };

  /*
  {
    "name": "Visaz",
    "value": null,
    "recurringExpense": "true",
    "debtCategory": "CreditCard",
    "interestRate": "25.00%",
    "initialBalance": "$20,000.00"
}*/
  // debt: BudgetItem
  /*
  export type DebtFormType = {
    id?: string;
    debtType: string;
    debtName: string;
    balance: string;
    rate: string;
    minPayment: string;
    dueDate: string;
    periodicity: string;
    extraPayAmount?: string | number;
};

{
    "name": "Test Debt",
    "value": "$100.00",
    "recurringExpense": "true",
    "debtType": "AutoLoan",
    "rate": "25.00%",
    "balance": "$500.00",
    "debtName": "Test Debt",
    "minPayment": "$100.00"
}
  */

  const formatDebtForSubmission = (debt): DebtFormType => {
    return {
      // ...debt,
      id: selectedItem.id,
      debtType: debt.debtType,
      debtName: debt.name,
      balance: debt.balance,
      rate: debt.rate,
      minPayment: debt.value,
    } as DebtFormType;
  };

  const onSuccess = () => {
    toast.success("Expense added");
    setIsCategoryModalOpen(false);
  };

  const onModalSubmit = async (data: {
    value: number | string;
    name: string | undefined;
    recurringExpense: string | undefined;
    rate?: string;
    debtType?: string;
    balance?: string;
  }) => {
    if (name === "debts") {
      const reshapedDebt = formatDebtForSubmission(data);
      await createDebt({ newDebt: reshapedDebt });
      Mixpanel.getInstance().track("added_debt_using_budget_tool");
    } else {
      const newCategory = [...items, data];
      const dataToUpdate = { [name]: newCategory } as Record<
        Locale,
        { name: string; value: number; recurringExpense?: string }[]
      >;
      await onSubmit(dataToUpdate);
    }
    onSuccess();
  };

  const onItemClick = (item: {
    value: number | string;
    name: string;
    recurringExpense?: string;
  }) => {
    setSelectedItem(item);
    handleChangeEditCategoryModalOpen();
  };

  const onEditSubmit = async (data: {
    name: string;
    value: number;
    oldName: string;
    recurringExpense: string | undefined;
    id?: string;
  }) => {
    if (name === "debts" && data?.id) {
      const formattedDebt = formatDebtForSubmission(data);
      await updateDebt({ updatedDebt: formattedDebt });
      Mixpanel.getInstance().track("edited_debt_using_budget_tool");
    } else {
      const index = items.map((i) => i.name).indexOf(data.oldName);
      if (index !== -1) {
        const newCategory: BudgetItem[] = [...items];
        newCategory[index] = {
          name: data.name,
          value: data.value,
          recurringExpense: data?.recurringExpense,
        };
        const dataToUpdate = { [name]: newCategory } as Record<
          Locale,
          { name: string; value: number; recurringExpense?: string }[]
        >;

        await onSubmit(dataToUpdate);
      }
      toast.success("Expense updated");
      setIsEditCategoryModalOpen(false);
    }
  };

  const onDeleteSubmit = async (item: { name: string; id?: string }) => {
    if (name === "debts" && item?.id) {
      await deleteRecords([item.id]);
      Mixpanel.getInstance().track("deleted_debt_using_budget_tool");
    } else {
      const newCategory = [...items].filter(({ name }) => name !== item.name);
      const dataToUpdate = { [name]: newCategory } as Record<
        Locale,
        { name: string; value: number }[]
      >;
      await onSubmit(dataToUpdate);
    }
    setIsDeleteCategoryItemModalOpen(false);
    setIsCategoryModalOpen(false);
    setIsEditCategoryModalOpen(false);
    toast.success("Expense deleted");
  };

  const getEmojiFromWord = (word: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const emoji = expenseEmojiMapping[word];
    if (emoji) return emoji;
    emojiNames.forEach((name) => {
      if (word.includes(name)) {
      }
    });
  };

  return (
    <div className="flex text-base font-medium flex-col rounded-[18px] border border-[#b1b2ff]/80 my-[12px] mx-[14px]">
      <div className="text-slate-950 text-[28px] font-medium capitalize px-[12px] py-4">
        {alternativeLabel ?? name}
      </div>

      {/* <div className="w-[100%] h-[0px] border border-zinc-200"></div> */}
      {/* <div className="flex justify-between lg:justify-start text-base font-medium text-gray-1 px-[12px] py-[8px]">
        <div className="lg:w-4/6">CATEGORY</div>
        <div className="lg:w-1/6 lg:text-right">RECOMMENDED</div>
        <div className="lg:w-1/6 text-right">ACTUAL</div>
      </div>
      <div className="justify-between lg:justify-start bg-indigo-50 flex w-full h-[69px] px-[12px] rounded-[4px] relative">
        <div className="lg:w-4/6 font-semibold text-[20px] flex items-start capitalize relative top-[10px]">
          {name}
        </div>
        <div className="lg:w-1/6 text-right flex flex-col justify-center relative">
          <div className="text-lg text-right">{calculateRecommended()}</div>
          <div className="text-base text-[#8E8ECC] text-right">{percent}%</div>
        </div>
        <div className="lg:w-1/6 text-right flex flex-col justify-center">
          <div className="text-lg">
            {totalItemsValue !== 0 ? formatCurrency(totalItemsValue) : "-"}
          </div>
          <div className="text-base text-[#8E8ECC]">
            {calculateActualPercentage()}
          </div>
        </div>
      </div> */}

      <div className="flex justify-between lg:justify-start text-base font-medium text-gray-1 px-[12px] py-[8px]">
        <div className="w-3/6 lg:w-4/6 text-[#4c5f7f] text-md font-semibold uppercase tracking-tight">
          ACTUAL
        </div>
        <div className="w-1/6 mr-[9%] lg:w-1/6 text-left text-[#8e8ecc] font-semibold text-md">
          {calculateActualPercentage()}
        </div>
        <div className="w-2/6 lg:w-1/6 lg:text-right text-[#03091d] font-medium text-md">
          {totalItemsValue !== 0 ? formatCurrency(totalItemsValue) : "-"}
        </div>
      </div>
      <div className="flex justify-between lg:justify-start text-base font-medium text-gray-1 px-[12px] py-[8px]">
        <div className="w-3/6 lg:w-4/6 text-[#9ca4ab] text-md font-semibold uppercase tracking-tight">
          RECOMMENDED
        </div>
        <div className="w-1/6 mr-[9%] lg:w-1/6 text-left text-[#9ca4ab] font-semibold text-md">
          {percent}%
        </div>
        <div className="w-2/6 lg:w-1/6 lg:text-right text-[#03091d] font-medium text-md">
          {calculateRecommended()}
        </div>

        {/* <div className="lg:w-1/6 text-right flex flex-col justify-center">
          <div className="text-lg">
            {totalItemsValue !== 0 ? formatCurrency(totalItemsValue) : "-"}
          </div>
          <div className="text-base text-[#8E8ECC]">
            {calculateActualPercentage()}
          </div>
        </div> */}
      </div>
      <div className="w-[100%] h-[0px] border border-zinc-200"></div>

      <div ref={parent}>
        {items.map((item, idx) => (
          <div
            key={`${item.name + idx}`}
            onClick={() => onItemClick(item)}
            className="flex w-full h-[50px] px-[12px] border-b cursor-pointer hover:bg-slate-50"
          >
            <div className="w-2/3 lg:w-5/6 font-normal text-lg flex items-center">
              <RenderEmoji
                symbol={
                  item.type
                    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      getEmojiFromWord(expenseEmojiMapping[item.type])
                    : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      expenseEmojiMapping[item.name?.toLowerCase()]
                }
                label={item.name}
                fallback={expenseEmojiMapping["default"]}
                className={"mr-[8px]"}
              />
              {item.name}
              {/* 0x1F502 */}
              {item?.recurringExpense === "true" ? (
                // <FiRepeat className="text-green-700 pl-[6px]" />
                <RenderEmoji
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  symbol={"0x1F501"}
                  label={item.name}
                  fallback={expenseEmojiMapping["default"]}
                  className={"ml-[6px]"}
                />
              ) : (
                // <div
                //   className="min-w-[12px] min-h-[12px] ml-[12px] bg-blue-200 rounded-full flex
                //  justify-center items-center"
                // >
                //   <p className="text-base/[10px] px-[20px] py-[8px]">1</p>
                // </div>
                // <RenderEmoji
                //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //   // @ts-ignore
                //   // symbol={"0x1F502"}
                //   symbol={"0x1F947"}
                //   label={item.name}
                //   fallback={expenseEmojiMapping["default"]}
                //   className={"ml-[6px]"}
                // />
                <Image
                  src="/icons/repeat-once.svg"
                  alt="Once"
                  width={34}
                  height={34}
                  className="ml-[6px]"
                />
              )}
            </div>
            <div className="w-1/3 lg:w-1/6 font-medium text-right flex flex-col justify-center">
              <div>{formatCurrency(item.value)}</div>
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={handleChangeCategoryModalOpen}
        className="flex gap-2 text-xl text-purple-3 bg-purple-100 w-[100%] h-12 px-4 py-3 items-center justify-center self-center hover:underline cursor-pointer gap-2 inline-flex mt-[4px] mb-[16px]"
      >
        {/* <FaCirclePlus color="#8740E2" /> */}
        <FaPlus color="#8740E2" />
        <div>Add Item</div>
      </div>
      <CreateCategoryItemModal
        onClose={handleChangeCategoryModalOpen}
        onSubmit={onModalSubmit}
        open={isCategoryModalOpen}
        category={category}
      />
      <EditCategoryItemModal
        category={category}
        onDeleteClick={handleChangeDeleteCategoryItemModalOpen}
        isDeleteCategoryItemModalOpen={isDeleteCategoryItemModalOpen}
        name={selectedItem.name}
        value={selectedItem.value}
        recurringExpense={selectedItem.recurringExpense}
        balance={selectedItem?.initialBalance}
        rate={String(selectedItem?.interestRate)}
        debtType={selectedItem?.type}
        // {...selectedItem}
        onClose={handleChangeEditCategoryModalOpen}
        onSubmit={async (data) => {
          if (
            category === "debts" &&
            data?.name !== DEBT_REPAYMENT_STRATEGY_NAME
          ) {
            const reshapedDebt = formatDebtForSubmission(data);
            await updateDebt({ updatedDebt: reshapedDebt });
          } else {
            onEditSubmit({
              name: data?.name,
              value: data?.value,
              oldName: data?.oldName,
              recurringExpense: data?.recurringExpense,
            });
          }
        }}
        open={isEditCategoryModalOpen}
      />
      <DeleteCategoryItemModal
        onConfirm={() => onDeleteSubmit(selectedItem)}
        show={isDeleteCategoryItemModalOpen}
        onCloseModal={handleChangeDeleteCategoryItemModalOpen}
        name={selectedItem.name}
        category={category}
      />
    </div>
  );
};

export default CategoryBlockItem;
