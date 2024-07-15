"use client";
import { Dialog, Transition } from "@headlessui/react";
import Input from "../../ui/Input";
import { LightButton, SimpleButton } from "../../ui/buttons";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../ui/Form";
import mixpanel from "mixpanel-browser";
import Mixpanel from "@/services/mixpanel";
import Select from "@/app/components/ui/Select";
import { CategoryType } from "../CategoryBlock";

type CreateCategoryItemModalProps = {
  onClose: () => void;
  open: boolean;
  category: CategoryType;
  value?: number;
  name?: string;
  onSubmit: ({
    value,
    name,
    recurringExpense,
  }: {
    value: number;
    name: string | undefined;
    recurringExpense: string | undefined;
  }) => void;
  onChange?: (value: string) => void;
};

const getPlaceholderFromCategory = (category: CategoryType) => {
  switch (category) {
    case "needs":
      return "Rent, Electricity, Utilities, Food, etc.";
    case "debts":
      return "Mortgage, Car Loan, Student Loan, etc.";
    case "savings":
      return "Savings Account, Shares, Investment Property, etc.";
    case "wants":
      return "Vacation, Jewelry, Luxury items, etc.";
  }
};

const CreateCategoryItemModal = ({
  onClose,
  open = false,
  category,
  value,
  name,
  onSubmit,
  onChange,
}: CreateCategoryItemModalProps) => {
  const [currentValue, setCurrentValue] = useState(value || "");
  const [currentName, setCurrentName] = useState(name || "");
  const [formHasError, setFormHasError] = useState(true);
  const [recurringExpense, setRecurringExpense] = useState<string | undefined>(
    "true"
  );

  const handleSubmit = () => {
    onSubmit({
      name: currentName,
      value: Number(currentValue),
      recurringExpense: recurringExpense,
    });
    onClose();
    Mixpanel.getInstance().track("add_item");
  };

  const handleChange = (data: string) => {
    setCurrentValue(data);
  };

  const handleNameChange = (data: string) => {
    setCurrentName(data);
  };

  useEffect(() => {
    setCurrentName("");
    setCurrentValue("");
    if (value && Number(value) !== Number(currentValue)) {
      setCurrentValue(value);
    }
    if (name && name !== currentName) {
      setCurrentName(name);
    }
  }, [value, name, open]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                <Dialog.Title
                  as="h3"
                  className="text-center text-[30px] font-normal leading-6 text-gray-900 mb-[24px]"
                >
                  Create {category.slice(0, 1).toUpperCase()}
                  {category.slice(1, -1)}
                </Dialog.Title>

                <Form onSubmit={handleSubmit}>
                  <Input
                    label="Description"
                    name="name"
                    type="text"
                    placeholder={`Ex. ${getPlaceholderFromCategory(category)}`}
                    inline
                    setFormHasError={setFormHasError}
                    defaultValue={currentName}
                    required
                    onChange={handleNameChange}
                  />

                  <Input
                    label="Amount"
                    name="extraPayAmount"
                    type="currency"
                    placeholder="$00.00"
                    inline
                    setFormHasError={setFormHasError}
                    defaultValue={currentValue}
                    required
                    onChange={handleChange}
                  />

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
                    value={recurringExpense}
                    onChange={(e) => {
                      if (e?.target?.value !== undefined) {
                        setRecurringExpense(e?.target?.value);
                      }
                    }}
                  />

                  <div className="mt-9 flex flex-col gap-2">
                    <SimpleButton
                      type="submit"
                      disabled={formHasError}
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

export default CreateCategoryItemModal;
