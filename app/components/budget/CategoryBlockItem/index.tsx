import { formatCurrency, toFixed } from "@/app/utils/formatters";
import { FaCirclePlus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import CreateCategoryItemModal from "../CreateCategoryItemModal";
import { useEffect, useState } from "react";
import EditCategoryItemModal from "../EditCategoryItemModal";
import DeleteCategoryItemModal from "../DeleteCategoryItemModal";
import { toast } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { expenseEmojiMapping } from "./emoji-mapper";
import RenderEmoji from "@/app/components/ui/RenderEmoji";
import { BudgetItem } from "@/app/budget/components/BudgetTool";
import { FiRepeat } from "react-icons/fi";

type Locale = "wants" | "savings" | "needs" | "debts";

interface CategoryBlockItemProps {
  name: string;
  items: BudgetItem[];
  percent: number;
  income: number;
  onSubmit: (data: Record<Locale, { name: string; value: number }[]>) => void;
}

const CategoryBlockItem = ({
  name,
  items = [],
  percent,
  income,
  onSubmit,
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

  const [parent] = useAutoAnimate();

  const handleChangeCategoryModalOpen = () => {
    setIsCategoryModalOpen(!isCategoryModalOpen);
  };

  const handleChangeEditCategoryModalOpen = () => {
    setIsEditCategoryModalOpen(!isEditCategoryModalOpen);
  };

  const handleChangeDeleteCategoryItemModalOpen = () => {
    setIsDeleteCategoryItemModalOpen(!isDeleteCategoryItemModalOpen);
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

  const onModalSubmit = async (data: {
    value: number;
    name: string | undefined;
    recurringExpense: string | undefined;
  }) => {
    const newCategory = [...items, data];
    const dataToUpdate = { [name]: newCategory } as Record<
      Locale,
      { name: string; value: number; recurringExpense?: string }[]
    >;
    await onSubmit(dataToUpdate);
    toast.success("Expense added");
    setIsCategoryModalOpen(false);
  };

  const onItemClick = (item: {
    value: number;
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
  }) => {
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
      toast.success("Expense updated");
      setIsEditCategoryModalOpen(false);
    }
  };

  const onDeleteSubmit = async (item: { name: string }) => {
    const newCategory = [...items].filter(({ name }) => name !== item.name);
    const dataToUpdate = { [name]: newCategory } as Record<
      Locale,
      { name: string; value: number }[]
    >;
    setIsDeleteCategoryItemModalOpen(false);
    setIsCategoryModalOpen(false);
    setIsEditCategoryModalOpen(false);
    await onSubmit(dataToUpdate);
    toast.success("Expense deleted");
  };

  return (
    <div className="flex text-base font-medium flex-col">
      {/* <div className="text-slate-950 text-[28px] font-medium capitalize px-[12px] py-4">
        {name}
      </div> */}

      <div className="w-[100%] h-[0px] border border-zinc-200"></div>
      <div className="flex justify-between lg:justify-start text-base font-medium text-gray-1 px-[12px] py-[8px]">
        <div className="lg:w-4/6">CATEGORY</div>
        <div className="lg:w-1/6 lg:text-right">RECOMMENDED</div>
        <div className="lg:w-1/6 text-right">ACTUAL</div>
      </div>
      <div className="justify-between lg:justify-start bg-indigo-50 flex w-full h-[69px] px-[12px] rounded-[4px] relative">
        <div className="lg:w-4/6 font-semibold text-[20px] flex items-start capitalize relative top-[10px]">
          {name}
        </div>
        <div className="lg:w-1/6 text-right flex flex-col justify-center">
          <div className="text-lg">{calculateRecommended()}</div>
          <div className="text-base text-[#8E8ECC]">{percent}%</div>
        </div>
        <div className="lg:w-1/6 text-right flex flex-col justify-center">
          <div className="text-lg">
            {totalItemsValue !== 0 ? formatCurrency(totalItemsValue) : "-"}
          </div>
          <div className="text-base text-[#8E8ECC]">
            {calculateActualPercentage()}
          </div>
        </div>
      </div>
      <div ref={parent}>
        {items.map((item, idx) => (
          <div
            key={`${item.name + idx}`}
            onClick={() => onItemClick(item)}
            className="flex w-full h-[50px] px-[12px] border-b cursor-pointer hover:bg-slate-50"
          >
            <div className="w-1/3 lg:w-5/6 font-normal text-lg flex items-center">
              <RenderEmoji
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                symbol={expenseEmojiMapping[item.name?.toLowerCase()]}
                label={item.name}
                fallback={expenseEmojiMapping["default"]}
                className={"mr-[8px]"}
              />
              {item.name}
              {/* 0x1F502 */}
              {item?.recurringExpense === "true" ? (
                <FiRepeat className="text-green-700 pl-[6px]" />
              ) : (
                <RenderEmoji
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  symbol={"0x1F502"}
                  label={item.name}
                  fallback={expenseEmojiMapping["default"]}
                  className={"ml-[6px]"}
                />
              )}
            </div>
            <div className="w-2/3 lg:w-1/6 font-medium text-right flex flex-col justify-center">
              <div>{formatCurrency(item.value)}</div>
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={handleChangeCategoryModalOpen}
        className="flex gap-2 text-xl text-purple-3 bg-purple-100 w-[100%] h-12 px-4 py-3 items-center justify-center self-center mb-[40px] hover:underline cursor-pointer gap-2 inline-flex"
      >
        {/* <FaCirclePlus color="#8740E2" /> */}
        <FaPlus color="#8740E2" />
        <div>Add Item</div>
      </div>
      <CreateCategoryItemModal
        onClose={handleChangeCategoryModalOpen}
        onSubmit={onModalSubmit}
        open={isCategoryModalOpen}
      />
      <EditCategoryItemModal
        onDeleteClick={handleChangeDeleteCategoryItemModalOpen}
        isDeleteCategoryItemModalOpen={isDeleteCategoryItemModalOpen}
        name={selectedItem.name}
        value={selectedItem.value}
        recurringExpense={selectedItem.recurringExpense}
        onClose={handleChangeEditCategoryModalOpen}
        onSubmit={(data) =>
          onEditSubmit({
            name: data?.name,
            value: data?.value,
            oldName: data?.oldName,
            recurringExpense: data?.recurringExpense,
          })
        }
        open={isEditCategoryModalOpen}
      />
      <DeleteCategoryItemModal
        onConfirm={() => onDeleteSubmit(selectedItem)}
        show={isDeleteCategoryItemModalOpen}
        onCloseModal={handleChangeDeleteCategoryItemModalOpen}
      />
    </div>
  );
};

export default CategoryBlockItem;
