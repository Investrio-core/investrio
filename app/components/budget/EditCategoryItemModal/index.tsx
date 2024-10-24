"use client";
import { Dialog, Transition } from "@headlessui/react";
import Input from "../../ui/Input";
import { LightButton, SimpleButton } from "../../ui/buttons";
import { GoTrash } from "react-icons/go";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../ui/Form";
import Select from "@/app/components/ui/Select";
import { CategoryType } from "../CategoryBlock";
import DebtFormFields from "../CreateCategoryItemModal/DebtFormFields";
import { DEBT_REPAYMENT_STRATEGY_NAME } from "@/app/dashboard/budget/components/BudgetTool";

type EditCategoryItemModalProps = {
  onClose: () => void;
  open: boolean;
  category: CategoryType;
  value?: number;
  name?: string;
  onSubmit: ({
    value,
    name,
    oldName,
    recurringExpense,
  }: {
    value: number;
    name: string;
    oldName: string;
    recurringExpense?: string;
  }) => void;
  onDeleteClick: () => void;
  isDeleteCategoryItemModalOpen: boolean;
  recurringExpense?: string;

  balance?: string;
  debtType?: string;
  rate?: string;
};

const EditCategoryItemModal = ({
  onClose,
  open = false,
  category,
  value,
  name,
  onSubmit,
  onDeleteClick,
  isDeleteCategoryItemModalOpen,
  recurringExpense,
  balance,
  rate,
  debtType,
}: EditCategoryItemModalProps) => {
  const [currentValue, setCurrentValue] = useState(value || "");
  const [currentName, setCurrentName] = useState(name || "");
  const [formHasError, setFormHasError] = useState(false);
  const [currentRecurringExpense, setRecurringExpense] = useState<
    string | undefined
  >(recurringExpense);

  const handleSubmit = (formValues) => {
    console.log("submitting");
    console.log(formValues);
    console.log(name);
    if (name && category === "debts" && name !== DEBT_REPAYMENT_STRATEGY_NAME) {
      onSubmit(formValues);
      onClose();
    } else if (name) {
      const data: {
        name: string;
        value: number;
        oldName: string;
        recurringExpense?: string;
      } = {
        name: currentName,
        value: Number(currentValue),
        oldName: name,
        recurringExpense: currentRecurringExpense,
      };
      onSubmit(data);
      onClose();
    }
  };

  const handleChange = (data: string) => {
    setCurrentValue(data);
  };

  const handleNameChange = (data: string) => {
    setCurrentName(data);
  };

  useEffect(() => {
    if (value && Number(value) !== Number(currentValue)) {
      setCurrentValue(value);
    }
    if (name && name !== currentName) {
      setCurrentName(name);
    }
    if (recurringExpense !== currentRecurringExpense) {
      setRecurringExpense(recurringExpense);
    }
  }, [value, open, name, recurringExpense]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={isDeleteCategoryItemModalOpen ? () => {} : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <GoTrash
                  onClick={onDeleteClick}
                  className="absolute right-6 cursor-pointer hover:text-purple-3"
                />
                <Dialog.Title
                  as="h3"
                  className="text-left text-[30px] font-normal leading-6 text-gray-900 mb-[24px]"
                >
                  Edit {category.slice(0, 1).toUpperCase()}
                  {category.slice(1, -1)}
                </Dialog.Title>

                <Form onSubmit={handleSubmit}>
                  <Input
                    label="Description"
                    name="name"
                    type="text"
                    placeholder="Ex. Rent"
                    setFormHasError={setFormHasError}
                    inline
                    defaultValue={currentName}
                    required
                    onChange={handleNameChange}
                  />

                  <Input
                    label={
                      category === "debts"
                        ? "Minimum Monthly Payment"
                        : `Amount`
                    }
                    name="value"
                    type="currency"
                    setFormHasError={setFormHasError}
                    placeholder="$00.00"
                    inline
                    defaultValue={currentValue}
                    required
                    onChange={handleChange}
                  />

                  {category !== "assets" ? (
                    <Select
                      label={`Is this a recurring ${category.slice(0, -1)}?`}
                      name="recurringExpense"
                      options={[
                        {
                          label: "Yes",
                          value: "true",
                        },
                        {
                          label: "No",
                          value: "false",
                        },
                      ]}
                      inline
                      required
                      value={currentRecurringExpense ?? undefined}
                      // placeholder={"Yes / No"}
                      onChange={(e) => {
                        if (e?.target?.value !== undefined) {
                          setRecurringExpense(e?.target?.value);
                        }
                      }}
                    />
                  ) : null}

                  {category === "debts" &&
                  name !== DEBT_REPAYMENT_STRATEGY_NAME ? (
                    <DebtFormFields
                      balance={balance}
                      rate={rate}
                      debtType={debtType}
                    />
                  ) : null}

                  <div className="mt-9 flex flex-col gap-2">
                    <SimpleButton
                      disabled={formHasError}
                      type="submit"
                      text="Save"
                    />
                  </div>
                </Form>
                <LightButton onClick={onClose} type="button" text="Cancel" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditCategoryItemModal;
