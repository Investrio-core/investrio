"use client";
import DebtsForm from "@/app/components/debts/DebtsForm";
import DebtsTable from "@/app/components/debts/DebtsTable";
import { Fragment, useEffect, useState } from "react";
import { DebtFormType } from "@/types/debtFormType";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";

import { Button, LightButton, SimpleButton } from "../../ui/buttons";
import Select from "../../forms/Select";
import Input from "../../forms/Input";
import Form from "../../forms/Form";
import { DeleteDebtModal } from "./components/DeleteDebtModal";
import { useMutation } from "@tanstack/react-query";
import { formatDebtsForApi } from "@/app/lib/formatDebtsForApi";
import { post } from "@/utils/httpClient";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { Loading } from "../../loading/Loading";
import useAxiosAuth from "@/app/lib/hooks/useAxiosAuth";
import { redirect, useRouter } from "next/navigation";

type Props = {
  onChangeStatus: (status: string) => void;
  records: any[];
};

export default function AddDebts({ onChangeStatus, records = [] }: Props) {
  const { data: sessionData } = useSession();
  const router = useRouter();

  if (!sessionData?.user) {
    return <Loading />;
  }

  const axiosAuth = useAxiosAuth();
  const [debts, setDebts] = useState<DebtFormType[]>([]);
  let [isOpen, setIsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: "" });
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [editModal, setEditModal] = useState({ open: false, id: "" });
  const [totalMinPayment, setTotalMinPayment] = useState("");
  const [extraPayAmount, setExtraPayAmount] = useState("");
  const [editFormHasError, setEditFormHasError] = useState<boolean>(false);
  const [editMinPaymentHasError, setEditMinPaymentHasError] = useState<string>('');

  const closeModal = () => {
    setIsOpen(false);
  };

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["financials"],
    mutationFn: async () => {
      const data = {
        debts: formatDebtsForApi(sessionData.user.id, debts, extraPayAmount),
      };
      return await axiosAuth.post(
        `/user/strategy/create/${sessionData.user.id}`,
        data.debts
      );
    },
  });

  const {
    mutate: update,
    isSuccess: updateIsSuccess,
    isPending: updateIsPending,
  } = useMutation({
    mutationKey: ["financials"],
    mutationFn: async () => {
      const data = {
        debts: formatDebtsForApi(sessionData.user.id, debts, extraPayAmount),
      };
      return await axiosAuth.post(
        `/user/strategy/update/${sessionData.user.id}`,
        data.debts
      );
    },
  });

  const { mutate: deleteRecords, isSuccess: deleteIsSuccess } = useMutation({
    mutationKey: ["financials"],
    mutationFn: async () => {
      return await axiosAuth.post(`/user/strategy/delete`, deletedIds);
    },
  });

  const handleUpdate = async () => {
    if (deletedIds.length) {
      await deleteRecords();
    }
    if (debts.length > 0) {
      update();
    }
  };

  const handleProceedClick = async () => {
    const hasExistedDebts = !!debts.find((e) => e.id)

    if (hasExistedDebts) {
      handleUpdate();
    } else if (!debts.length) {
      await deleteRecords()
    } else {
      setIsOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (deletedIds.length) {
      await deleteRecords();
    }
    
    if (records.length) {
      console.log("THIS");
      update()
    } else {
      console.log("NOT THIS");
      mutate();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Debt created successfully");
      onChangeStatus("payment-config");
    }

    if (updateIsSuccess) {
      toast.success("Debts updated successfully");
      onChangeStatus("payment-config");
    }
  }, [isSuccess || updateIsSuccess]);

  useEffect(() => {
    if (deleteIsSuccess) {
      if (debts.length === 0) {
        toast.warning("Debts deleted successfully");
        router.push("/dashboard/debts");
        router.refresh();
      }
    }
  }, [deleteIsSuccess]);

  const calculateMinimumPayment = () => {
    return debts
      .reduce((total, debt) => {
        const minPaymentValue = parseFloat(debt.minPayment.replace("$", ""));
        return total + minPaymentValue;
      }, 0)
      .toFixed(2);
  };

  useEffect(() => {
    setTotalMinPayment(calculateMinimumPayment());
  }, [debts]);

  useEffect(() => {
    if (Array.isArray(records)) {
      const defaultExtraPayAmount = records[0]?.extraPayAmount;

      if (defaultExtraPayAmount) {
        setExtraPayAmount(defaultExtraPayAmount);
      }

      setDebts(
        records.map((r) => {
          return {
            id: r.id,
            debtName: r.title,
            balance: String(r.initialBalance),
            periodicity: r.periodicity,
            debtType: r.type,
            dueDate: r.payDueDate,
            rate: String(r.interestRate * 100) + "%",
            minPayment: String(r.minPayAmount),
          };
        })
      );
    }
  }, [records]);

  const selectedDebt = debts[parseInt(editModal.id)];

  return (
    <div className="mx-auto p-6">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full items-center justify-between py-2">
              <span className="font-light text-[#747682] text-left">
                Manually enter your outstanding debts. We will ask you the
                following details for the most accurate payment plan. Note that
                the strategy for paying off debts will start from the current
                month
              </span>
              <IoIosArrowDown
                className={`${
                  open ? "-rotate-90 transform" : ""
                } text-2xl text-[#747682]`}
              />
            </Disclosure.Button>
            <Transition
              show={open}
              enter="transition duration-500 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-500 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              {(ref) => (
                <div
                  ref={ref}
                  className="origin-top transform transition-transform"
                >
                  <Disclosure.Panel>
                    <div className="border-b-2 border-[#F2F4FA] p-3" />

                    <div className="mt-12">
                      <DebtsForm debts={debts} setDebts={setDebts} />
                    </div>
                    <div className="border-b-2 border-[#F2F4FA] p-3" />
                  </Disclosure.Panel>
                </div>
              )}
            </Transition>
            {!debts.length && (
              <div className="flex h-60 flex-col items-center justify-center">
                <span className="font-light text-[#747682]">
                  <h1 className="mb-1 text-xl font-semibold text-[#03091D]">
                    You haven't added any debt yet
                  </h1>
                  add some to proceed
                </span>
                <img
                  src="/images/dashboard/emptystate.svg"
                  style={{
                    filter: "grayscale(100%)",
                  }}
                  alt="Empty icon"
                />
              </div>
            )}
            <div className="border-b-2 border-[#F2F4FA]" />

            <div className="mt-8">
              <div className="rounded-xl overflow:auto">
                <DebtsTable
                  onDeleteDebt={(index) =>
                    setDeleteModal({ id: index, open: true })
                  }
                  onEditDebt={(index) =>
                    setEditModal({ id: index, open: true })
                  }
                  data={debts}
                />
              </div>
              <div className="my-12 border-b-2 border-[#F2F4FA]" />
              <div className="mt-5 flex w-full justify-center gap-7">
                {/*<ButtonReturn text="Return"/>*/}
                <Button
                  onClick={handleProceedClick}
                  disabled={!records.length && !debts.length}
                  text="Proceed"
                />

                <Transition appear show={isOpen} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={closeModal}
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
                              Additional Payment
                            </Dialog.Title>
                            <div className="my-5 flex justify-center">
                              <img
                                className="w-26"
                                src="/images/dashboard/percent.svg"
                                alt="Percent icon"
                              />
                            </div>

                            {/* <div className="flex items-center justify-between">
                              <span className="w-8/12 text-sm">
                                Are you currently paying the minimum amount of{" "}
                                <span className="font-bold text-[#8833FF]">
                                  {`$${totalMinPayment}`}
                                </span>{" "}
                                each month?
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-light text-gray-500">
                                  No
                                </span>
                                <Switch
                                  checked={enabled}
                                  onChange={setEnabled}
                                  className={`${
                                    enabled ? "bg-[#8833FF]" : "bg-gray-500"
                                  }
                                  relative inline-flex h-[18px] w-[30px]
                                  shrink-0 cursor-pointer rounded-full border-2
                                  border-transparent transition-colors duration-200 ease-in-out
                                  focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={`${
                                      enabled
                                        ? "translate-x-3"
                                        : "translate-x-0"
                                    }
                                    pointer-events-none inline-block h-[14px] w-[14px]
                                    transform rounded-full bg-white shadow-lg ring-0 transition
                                    duration-200 ease-in-out`}
                                  />
                                </Switch>
                                <span
                                  className={`text-sm font-light ${
                                    enabled ? "text-[#8833FF]" : "text-gray-500"
                                  }`}
                                >
                                  Yes
                                </span>
                              </div>
                            </div> */}

                            <div className="mt-5 text-base font-light">
                              Pay more than the minimum payment to speed up debt
                              repayment.
                            </div>

                            <div className="py-4 text-sm font-light text-gray-500">
                              Our experts recommend adding at least $100/month.
                            </div>

                            <Input
                              label=""
                              name="extraPayAmount"
                              type="currency"
                              placeholder="$00.00"
                              inline
                              required
                              onChange={setExtraPayAmount}
                            />

                            {/*<input*/}
                            {/*  type="number"*/}
                            {/*  onChange={(e) =>*/}
                            {/*    setExtraPayAmount(e.target.value)*/}
                            {/*  }*/}
                            {/*  name="extraPayAmount"*/}
                            {/*  placeholder="$00.00"*/}
                            {/*  className="focus:border-primary-700 input w-full border-[#EDF2F6] bg-[#F8F8F8] placeholder-[#656565] transition focus:outline-none"*/}
                            {/*/>*/}

                            <div className="mt-9 flex flex-col gap-2">
                              <SimpleButton
                                loading={isPending}
                                onClick={handleSubmit}
                                text="Calculate"
                              />
                              <LightButton onClick={closeModal} text="Cancel" />
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>

                <Transition appear show={editModal.open} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() =>
                      setEditModal((prev) => ({ ...prev, open: false }))
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
                              Edit your debts
                            </Dialog.Title>
                            <Form
                              onSubmit={(data) => {
                                const minPayment = parseFloat(data.minPayment.replace('$', '').replace(',', ''))
                                let balance = data.balance
                                balance =parseFloat(data.balance.replace('$', '').replace(',', ''))
                                if (minPayment <  Number((balance * 0.03).toFixed(2))) {
                                  setEditMinPaymentHasError(`The minimum value for this field is ${Number((balance * 0.03).toFixed(2))}`)
                                  return
                                } else {
                                  setEditMinPaymentHasError('')
                                }
                                setEditModal({ id: "", open: false });
                                setDebts((prev) => {
                                  const updatedDebts = [...prev];
                                  updatedDebts[parseInt(editModal.id)] = {
                                    ...updatedDebts[parseInt(editModal.id)],
                                    ...data,
                                  };
                                  return updatedDebts;
                                });
                              }}
                              className="grid grid-cols-12 p-4 gap-4"
                            >
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
                                  disabled
                                  options={[
                                    // {
                                    //   label: "Debit Card",
                                    //   value: "DebitCard",
                                    // },
                                    {
                                      label: "Credit Card",
                                      value: "CreditCard",
                                    },
                                    // {
                                    //   label: "Student Loan",
                                    //   value: "StudentLoan",
                                    // },
                                  ]}
                                  inline
                                  required
                                  defaultValue={selectedDebt?.debtType}
                                />
                              </div>
                              {/* <div className="col-span-12">
                                <Select
                                  disabled
                                  label="Periodicity"
                                  name="periodicity"
                                  defaultValue="MONTH"
                                  options={[
                                    {
                                      label: "Monthly",
                                      value: "MONTH",
                                    },
                                    {
                                      label: "Annual",
                                      value: "YEAR",
                                    },
                                    {
                                      label: "Weekly",
                                      value: "WEEK",
                                    },
                                  ]}
                                  inline
                                  required
                                />
                              </div> */}
                              <div className="col-span-6">
                                <Input
                                  label="Interest Rate"
                                  name="rate"
                                  type="percentage"
                                  placeholder="00.00%"
                                  minNumberValue={0.01}
                                  inline
                                  required
                                  defaultValue={selectedDebt?.rate}
                                  setFormHasError={setEditFormHasError}
                                />
                              </div>
                              <div className="col-span-6">
                                <Input
                                  label="Outstanding Balance"
                                  name="balance"
                                  type="currency"
                                  placeholder="$ 00.00"
                                  inline
                                  required
                                  defaultValue={selectedDebt?.balance}
                                  minNumberValue={0.01}
                                  setFormHasError={setEditFormHasError}
                                />
                              </div>

                              <div className="col-span-6">
                                <Input
                                  label="Minimum Payment"
                                  name="minPayment"
                                  type="currency"
                                  placeholder="$ 00.00"
                                  inline
                                  required
                                  defaultValue={selectedDebt?.minPayment}
                                  error={editMinPaymentHasError}
                                  minNumberValue={0.01}
                                  setFormHasError={setEditFormHasError}
                                />
                              </div>
                              <div className="col-span-12 mt-3">
                                <SimpleButton type="submit" text="Save" disabled={editFormHasError} />
                                <LightButton
                                  className="col-span-12"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setEditModal((prev) => ({
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
              </div>
              <DeleteDebtModal
                onCloseModal={() =>
                  setDeleteModal((prev) => ({ ...prev, open: false }))
                }
                show={deleteModal.open}
                onConfirm={() => {
                  const indexToDelete = parseInt(deleteModal.id);
                  setDeletedIds((prev) => {
                    if (debts[indexToDelete]?.id) {
                      const id = debts[indexToDelete]?.id as string;
                      return [...prev, id];
                    }
                    return [...prev];
                  });

                  setDebts((prev) => [
                    ...prev.slice(0, indexToDelete),
                    ...prev.slice(indexToDelete + 1),
                  ]);
                  setDeleteModal({ id: "", open: false });
                }}
              />
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}
