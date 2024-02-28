'use client'
import { Dialog, Transition } from "@headlessui/react";
import Input from "../ui/Input";
import { LightButton, SimpleButton } from "../ui/buttons";
import { Fragment, useEffect, useState } from "react";
import PercentIcon from '@/public/icons/percent.svg'

type AdditionalPaymentModalProps = {
  onClose: () => void;
  open: boolean,
  value?: number,
  onSubmit: (value: number) => void 
  onChange?: (value: string) => void
}


const AdditionalPaymentModal = ({onClose, open = false, value, onSubmit, onChange}: AdditionalPaymentModalProps) => {
  const [currentValue, setCurrentValue] = useState(value || '')

  const handleSubmit = () => {
    onSubmit(Number(currentValue))
  }

  const handleChange = (data: string) => {
    setCurrentValue(data)

    if (onChange) {
      onChange(data)
    }
  }

  useEffect(() => {
    if (value && Number(value) !== Number(currentValue)) {
      setCurrentValue(value)
    }
  }, [value, open])

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
                  className="text-center text-3xl font-normal leading-6 text-gray-900"
                >
                  Additional Payment
                </Dialog.Title>
                <div className="my-5 flex justify-center">
                  <PercentIcon className="w-26" />
                </div>

                <div className="mt-5 text-base font-bold text-center">
                  This is where the magic happens!
                </div>

                <div className="py-4 text-base font-normal text-gray-500 text-center">
                  To move faster towards your next financial goals, and pay less
                  interest to the banks, our experts recommend adding at least
                  $100 extra per month
                </div>

                <Input
                  label=""
                  name="extraPayAmount"
                  type="currency"
                  placeholder="$00.00"
                  inline
                  defaultValue={currentValue}
                  required
                  onChange={handleChange}
                />

                <div className="mt-9 flex flex-col gap-2">
                  <SimpleButton
                    onClick={handleSubmit}
                    text="Calculate"
                  />
                  <LightButton onClick={onClose} text="Cancel" />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AdditionalPaymentModal
