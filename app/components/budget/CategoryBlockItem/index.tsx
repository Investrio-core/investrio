import { formatCurrency, toFixed } from "@/app/utils/formatters";
import { FaCirclePlus } from "react-icons/fa6";
import CreateCategoryItemModal from "../CreateCategoryItemModal";
import { useState } from "react";
import EditCategoryItemModal from "../EditCategoryItemModal";
import DeleteCategoryItemModal from "../DeleteCategoryItemModal";

type Locale = "wants" | "savings" | "needs" | "debts";

interface CategoryBlockItemProps {
  name: string;
  items: {
    name: string;
    value: number;
  }[];
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

  const [selectedItem, setSelectedItem] = useState<{
    value: number;
    name: string;
  }>({ name: "", value: 0 });

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
  }) => {
    const newCategory = [...items, data];
    const dataToUpdate = { [name]: newCategory } as Record<
      Locale,
      { name: string; value: number }[]
    >;
    await onSubmit(dataToUpdate);
    setIsCategoryModalOpen(false);
  };

  const onItemClick = (item: { value: number; name: string }) => {
    handleChangeEditCategoryModalOpen();
    setSelectedItem(item);
  };

  const onEditSubmit = async (data: {
    name: string;
    value: number;
    oldName: string;
  }) => {
    const index = items.map((i) => i.name).indexOf(data.oldName);
    if (index !== -1) {
      const newCategory = [...items];
      newCategory[index] = { name: data.name, value: data.value };
      const dataToUpdate = { [name]: newCategory } as Record<
        Locale,
        { name: string; value: number }[]
      >;
      await onSubmit(dataToUpdate);
      setIsEditCategoryModalOpen(false);
    }
  };

  const onDeleteSubmit = async (item: { name: string }) => {
    const newCategory = [...items].filter(({ name }) => name !== item.name);
    const dataToUpdate = { [name]: newCategory } as Record<
      Locale,
      { name: string; value: number }[]
    >;
    await onSubmit(dataToUpdate);
    setIsDeleteCategoryItemModalOpen(false)
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="flex text-base font-medium flex-col">
      <div className="bg-gray-2 flex w-full h-[69px] px-[12px] rounded-[4px]">
        <div className="w-4/6 font-semibold text-[20px] flex items-center capitalize">
          {name}
        </div>
        <div className="w-1/6 text-right flex flex-col justify-center">
          <div className="text-lg">{calculateRecommended()}</div>
          <div className="text-gray-1 text-base">{percent}%</div>
        </div>
        <div className="w-1/6 text-right flex flex-col justify-center">
          <div className="text-lg">
            {totalItemsValue !== 0 ? formatCurrency(totalItemsValue) : "-"}
          </div>
          <div className="text-gray-1 text-base">
            {calculateActualPercentage()}
          </div>
        </div>
      </div>
      <div>
        {items.map((item) => (
          <div
            onClick={() => onItemClick(item)}
            className="flex w-full h-[50px] px-[12px] border-b cursor-pointer hover:bg-slate-50"
          >
            <div className="w-5/6 font-normal text-lg flex items-center">
              {item.name}
            </div>
            <div className="w-1/6 text-right flex flex-col justify-center">
              <div>{formatCurrency(item.value)}</div>
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={handleChangeCategoryModalOpen}
        className="flex gap-2 text-lg text-purple-3 items-center self-end pr-[12px] mt-[12px] mb-[40px] hover:underline cursor-pointer"
      >
        <FaCirclePlus color="#8740E2" />
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
        onClose={handleChangeEditCategoryModalOpen}
        onSubmit={onEditSubmit}
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
