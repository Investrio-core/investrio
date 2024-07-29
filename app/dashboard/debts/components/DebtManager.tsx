"use client";
import DebtsForm from "@/app/components/strategy/DebtsForm";
import DebtsTable from "@/app/components/strategy/DebtsTable";
import { Fragment, useEffect, useState } from "react";
import { DebtFormType } from "@/types/debtFormType";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";

import { Button, LightButton, SimpleButton } from "@/app/components/ui/buttons";
import Select from "@/app/components/ui/Select";
import Input from "@/app/components/ui/Input";
import Form from "@/app/components/ui/Form";
import { DeleteDebtModal } from "@/app/components/strategy/add-strategy/DeleteDebtModal";
import { EditDebtModal } from "@/app/components/strategy/add-strategy/EditDebtModal";

import { useMutation } from "@tanstack/react-query";
import { formatDebtsForApi } from "@/lib/formatDebtsForApi";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { Loading } from "@/app/components/ui/Loading";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useRouter } from "next/navigation";
import AdditionalPaymentModal from "@/app/components/AdditionalPaymentModal";
import EmptyIcon from "@/public/icons/emptystate.svg";
import { StrategyFormTooltip } from "@/app/components/strategy/add-strategy/FormTooltip";
import Mixpanel from "@/services/mixpanel";
import useDebtQueries from "@/app/hooks/useDebtQueries";
import { COLORS } from "@/app/components/ui/charts/CustomPieChart";

type Props = {
  debts: any[];
  setDebts: Function;
};

export default function DebtManager({ debts, setDebts }: Props) {
  const axiosAuth = useAxiosAuth();
  let [isOpen, setIsOpen] = useState(false);
  const [isDebtUpdated, setIsDebtUpdated] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: "" });
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [editModal, setEditModal] = useState({ open: false, id: "" });
  const [totalMinPayment, setTotalMinPayment] = useState("");
  const [extraPayAmount, setExtraPayAmount] = useState("");
  const [editFormHasError, setEditFormHasError] = useState<boolean>(false);
  const [editMinPaymentHasError, setEditMinPaymentHasError] =
    useState<string>("");
  const [editOutstandingBalance, setEditOutstandingBalance] = useState(0);
  const [editMinimumPayment, setEditMinimumPayment] = useState(0);

  const closeModal = () => {
    setIsOpen(false);
  };

  const {
    createDebt,
    isSuccess,
    isPending,
    updateDebt,
    updateIsSuccess,
    updateIsPending,
    deleteRecords,
    deleteIsSuccess,
  } = useDebtQueries();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Debt created successfully");
      // onChangeStatus("payment-config");
    }

    if (updateIsSuccess) {
      toast.success("Debts updated successfully");
      // onChangeStatus("payment-config");
    }
  }, [isSuccess || updateIsSuccess]);

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.warning("Debts deleted successfully");
    }
  }, [deleteIsSuccess]);

  const selectedDebt = debts[parseInt(editModal.id)];

  return (
    <div className="">
      <div className="">
        <div className="rounded-xl overflow:auto">
          <DebtsTable
            onDeleteDebt={(index) => setDeleteModal({ id: index, open: true })}
            onEditDebt={(index) => {
              setEditModal({ id: index, open: true });
              // setEditOutstandingBalance(debts[index])
            }}
            data={debts}
            colors={COLORS}
            showSummary={true}
          />
        </div>
        {/* <div className="my-12 border-b-2 border-[#F2F4FA]" /> */}

        {/* <AdditionalPaymentModal
          open={isOpen}
          onChange={setExtraPayAmount}
          onClose={closeModal}
          onSubmit={handleSubmit}
        /> */}

        <EditDebtModal
          setEditModal={setEditModal}
          setEditMinPaymentHasError={setEditMinPaymentHasError}
          setDebts={setDebts}
          updateDebt={updateDebt}
          setIsDebtUpdated={setIsDebtUpdated}
          setEditFormHasError={setEditFormHasError}
          setEditOutstandingBalance={setEditOutstandingBalance}
          setEditMinimumPayment={setEditMinimumPayment}
          editMinPaymentHasError={editMinPaymentHasError}
          editFormHasError={editFormHasError}
          selectedDebt={selectedDebt}
          editOutstandingBalance={editOutstandingBalance}
          editModal={editModal}
          show={editModal.open}
        />

        <DeleteDebtModal
          onCloseModal={() =>
            setDeleteModal((prev) => ({ ...prev, open: false }))
          }
          show={deleteModal.open}
          onConfirm={() => {
            const indexToDelete = parseInt(deleteModal.id);
            // setDeletedIds((prev) => {
            //   if (debts[indexToDelete]?.id) {
            //     const id = debts[indexToDelete]?.id as string;
            //     return [...prev, id];
            //   }
            //   return [...prev];
            // });

            deleteRecords([debts[indexToDelete]?.id]);

            // setDebts((prev) => [
            //   ...prev.slice(0, indexToDelete),
            //   ...prev.slice(indexToDelete + 1),
            // ]);
            setDeleteModal({ id: "", open: false });
          }}
        />
      </div>
    </div>
  );
}
