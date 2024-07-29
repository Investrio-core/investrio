import { LightButton, SimpleButton } from "@/app/components/ui/buttons";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { TbAlertHexagon } from "react-icons/tb";
import Select from "@/app/components/ui/Select";
import Input from "@/app/components/ui/Input";
import Form from "@/app/components/ui/Form";
import { DebtFormType } from "@/types/debtFormType";

type Props = {
  show: boolean;
  // onCloseModal: () => void;
  // onConfirm: () => void;
  setEditModal: Function;
  setEditMinPaymentHasError: Function;
  setDebts: Function;
  setIsDebtUpdated: Function;
  setEditFormHasError: (arg0: boolean) => void;
  setEditOutstandingBalance: Function;
  setEditMinimumPayment: Function;
  selectedDebt: DebtFormType;
  updateDebt: Function;
  editMinPaymentHasError: string;
  editFormHasError: boolean;
  editOutstandingBalance: number;
  editModal: { id: string; open: boolean };
};

export const EditDebtModal = ({
  show,
  // onCloseModal,
  // onConfirm,
  setEditModal,
  setEditMinPaymentHasError,
  setDebts,
  setIsDebtUpdated,
  setEditFormHasError,
  setEditOutstandingBalance,
  setEditMinimumPayment,
  editMinPaymentHasError,
  editFormHasError,
  selectedDebt,
  editOutstandingBalance,
  editModal,
  updateDebt,
}: Props) => {
  const [apiCallOngoing, setApiCallOngoing] = useState(false);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() =>
          setEditModal((prev: { id: string; open: boolean }) => ({
            ...prev,
            open: false,
          }))
        }
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
                <Dialog.Title
                  as="h3"
                  className="text-center text-3xl font-normal leading-6 text-gray-900"
                >
                  Edit your debt
                </Dialog.Title>
                <Form
                  onSubmit={async (data) => {
                    const minPayment = parseFloat(
                      data.minPayment.replace("$", "").replace(",", "")
                    );
                    let balance = data.balance;
                    balance = parseFloat(
                      data.balance.replace("$", "").replace(",", "")
                    );
                    if (minPayment < 0) {
                      //Number((balance * 0.03).toFixed(2))) {
                      setEditMinPaymentHasError(
                        `The minimum value for this field is ${Number(
                          // (balance * 0.03).toFixed(2)
                          0
                        )}`
                      );
                      return;
                    } else {
                      setEditMinPaymentHasError("");
                    }
                    // setEditModal({ id: "", open: false });

                    // setDebts((prev) => {
                    //   const updatedDebts = [...prev];
                    //   updatedDebts[parseInt(editModal.id)] = {
                    //     ...updatedDebts[parseInt(editModal.id)],
                    //     ...data,
                    //   };
                    //   return updatedDebts;
                    // });
                    setApiCallOngoing(true);

                    await updateDebt({ updatedDebt: data });
                    setApiCallOngoing(false);
                    setIsDebtUpdated(true);
                    setEditModal({ open: false, id: "" });
                  }}
                  className="grid grid-cols-12 p-4 gap-4"
                >
                  <div className="hidden">
                    <Input
                      label="id"
                      name="id"
                      // placeholder="Ex. Visa, Chase, Amex"
                      inline
                      required
                      defaultValue={selectedDebt?.id}
                      // setFormHasError={setEditFormHasError}
                    />
                  </div>
                  <div className="col-span-12">
                    <Input
                      label="Name Your Debt"
                      name="debtName"
                      placeholder="Ex. Visa, Chase, Amex"
                      inline
                      required
                      defaultValue={selectedDebt?.debtName}
                      setFormHasError={setEditFormHasError}
                    />
                  </div>
                  <div className="col-span-12">
                    <Select
                      label="Debt Type"
                      name="debtType"
                      options={[
                        {
                          label: "Credit Card",
                          value: "CreditCard",
                        },
                      ]}
                      inline
                      required
                      defaultValue={selectedDebt?.debtType}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      label="Interest Rate"
                      name="rate"
                      type="percentage"
                      placeholder="00.00%"
                      minNumberValue={0.01}
                      maxNumberValue={100}
                      inline
                      required
                      defaultValue={selectedDebt?.rate}
                      setFormHasError={setEditFormHasError}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <Input
                      label="Outstanding Balance"
                      name="balance"
                      type="currency"
                      placeholder="$00.00"
                      inline
                      required
                      defaultValue={selectedDebt?.balance}
                      onChange={setEditOutstandingBalance}
                      minNumberValue={0.01}
                      setFormHasError={setEditFormHasError}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <Input
                      label="Minimum Payment"
                      name="minPayment"
                      type="currency"
                      placeholder="$00.00"
                      inline
                      required
                      defaultValue={selectedDebt?.minPayment || 0}
                      error={editMinPaymentHasError}
                      onChange={setEditMinimumPayment}
                      // minNumberValue={
                      //   Number((editOutstandingBalance * 0.03).toFixed(2)) ||
                      //   0.01
                      // }
                      // setFormHasError={setEditFormHasError}
                    />
                    <span className="text-md text-red-500">
                      {`The minimum recommended value for this field is ${Number(
                        (editOutstandingBalance * 0.03).toFixed(2)
                      )}`}
                    </span>
                  </div>
                  <div className="col-span-12 mt-3">
                    <SimpleButton
                      type="submit"
                      text="Save"
                      disabled={editFormHasError || apiCallOngoing}
                    />
                    <LightButton
                      className="col-span-12"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setEditFormHasError(false);
                        setEditMinPaymentHasError("");
                        setEditModal((prev: { id: string; open: boolean }) => ({
                          ...prev,
                          open: false,
                        }));
                      }}
                      text="Cancel"
                    />
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
