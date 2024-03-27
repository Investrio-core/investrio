"use client";
import { Dialog, Transition } from "@headlessui/react";
import Input from "../../ui/Input";
import { LightButton, SimpleButton } from "../../ui/buttons";
import { Fragment, useEffect, useState } from "react";
import PercentIcon from "@/public/icons/percent.svg";
import Form from "../../ui/Form";
import mixpanel from "mixpanel-browser";
import Mixpanel from "@/services/mixpanel";

type IncomeModalProps = {
  onClose: () => void;
  open: boolean;
  value?: number;
  onSubmit: (value: number) => void;
  onChange?: (value: string) => void;
};

const IncomeModal = ({
  onClose,
  open = false,
  value,
  onSubmit,
  onChange,
}: IncomeModalProps) => {
  const [currentValue, setCurrentValue] = useState(value || "");

  const handleSubmit = () => {
    onSubmit(Number(currentValue));
    Mixpanel.getInstance().track('add_income')
  };

  const handleChange = (data: string) => {
    setCurrentValue(data);

    if (onChange) {
      onChange(data);
    }
  };

  useEffect(() => {
    if (value && Number(value) !== Number(currentValue)) {
      setCurrentValue(value);
    } else if (!value) {
      setCurrentValue("")
    }
  }, [value, open]);

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
                  Enter Your Monthly Budget
                </Dialog.Title>

                <Form onSubmit={handleSubmit}>
                  <Input
                    label="Amount"
                    name="extraPayAmount"
                    type="currency"
                    placeholder="$00.00"
                    inline
                    defaultValue={currentValue}
                    required
                    onChange={handleChange}
                  />

                  <div className="mt-9 flex flex-col gap-2">
                    <SimpleButton type="submit" text="Save" />
                  </div>
                </Form>
                <LightButton onClick={onClose} text="Cancel" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default IncomeModal;
