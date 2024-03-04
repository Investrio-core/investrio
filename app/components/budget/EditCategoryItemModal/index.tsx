"use client";
import { Dialog, Transition } from "@headlessui/react";
import Input from "../../ui/Input";
import { LightButton, SimpleButton } from "../../ui/buttons";
import { GoTrash } from "react-icons/go";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../ui/Form";

type EditCategoryItemModalProps = {
  onClose: () => void;
  open: boolean;
  value?: number;
  name?: string;
  onSubmit: ({
    value,
    name,
    oldName,
  }: {
    value: number;
    name: string;
    oldName: string;
  }) => void;
  onDeleteClick: () => void;
  isDeleteCategoryItemModalOpen: boolean;
};

const EditCategoryItemModal = ({
  onClose,
  open = false,
  value,
  name,
  onSubmit,
  onDeleteClick,
  isDeleteCategoryItemModalOpen,
}: EditCategoryItemModalProps) => {
  const [currentValue, setCurrentValue] = useState(value || "");
  const [currentName, setCurrentName] = useState(name || "");
  const [formHasError, setFormHasError] = useState(false);

  const handleSubmit = () => {
    if (name) {
      const data: { name: string; value: number; oldName: string } = {
        name: currentName,
        value: Number(currentValue),
        oldName: name,
      };
      onSubmit(data);
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
  }, [value, open, name]);

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
                  Edit expense
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
                    label="Amount"
                    name="extraPayAmount"
                    type="currency"
                    setFormHasError={setFormHasError}
                    placeholder="$00.00"
                    inline
                    defaultValue={currentValue}
                    required
                    onChange={handleChange}
                  />

                  <div className="mt-9 flex flex-col gap-2">
                    <SimpleButton disabled={formHasError} type="submit" text="Save" />
                    <LightButton onClick={onClose} text="Cancel" />
                  </div>
                </Form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditCategoryItemModal;
