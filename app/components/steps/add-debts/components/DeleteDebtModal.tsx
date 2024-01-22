import { LightButton, SimpleButton } from "@/app/components/ui/buttons";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { TbAlertHexagon } from "react-icons/tb";

type DeleteModalProps = {
  show: boolean;
  onCloseModal: () => void;
  onConfirm: () => void;
};

export const DeleteDebtModal = ({
  show,
  onCloseModal,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCloseModal}>
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
                  className="flex flex-col justify-center items-center first-letter:text-center text-3xl font-normal leading-6 text-gray-900"
                >
                  <TbAlertHexagon
                    style={{ width: "32px", height: "32px" }}
                    color="#DC26267F"
                  />
                  <span className="mt-4 text-bold">Are you sure?</span>
                </Dialog.Title>
                <div className="flex text-center justify-center mt-4">
                  <span className="text-base">
                    This action cannot be undone. All values associated to this
                    field will be lost.
                  </span>
                </div>
                <div className="mt-4">
                  <SimpleButton
                    className="bg-red-600"
                    onClick={onConfirm}
                    text="Delete"
                  />
                  <LightButton onClick={onCloseModal} text="Cancel" />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
