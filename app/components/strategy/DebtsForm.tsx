import React, { useEffect, useState } from "react";
import Select from "@/app/components/ui/Select";
import Input from "@/app/components/ui/Input";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Form from "@/app/components/ui/Form";
import { Dispatch, SetStateAction } from "react";
import { DebtFormType } from "@/types/debtFormType";
import { toast } from "react-toastify";
import ToastComponent from "../Toast";
import { ButtonWithIcon } from "@/app/components/ui/buttons";

const DEFAULT_PERIODICITY = "MONTH";

type DebtsFormProps = {
  debts: DebtFormType[];
  setDebts: Dispatch<SetStateAction<DebtFormType[]>>;
};

export default function DebtsForm({ setDebts, debts }: DebtsFormProps) {
  const [debtValue, setDebtValue] = useState<number>(0);
  const [minimumPayment, setMinimumPayment] = useState<number>(0);
  const [formHasError, setFormHasError] = useState<boolean>(false);
  const [minPayAmountError, setMinPaymentError] = useState("");

  const [customToast, setCustomToast] = useState<React.ReactNode | null>(null);

  const showToast = (message: string, description: string, type: string) => {
    setCustomToast(
      <ToastComponent
        message={message}
        description={description}
        type={type}
        onClose={() => setCustomToast(null)}
      />
    );
  };

  const submit = (values: DebtFormType) => {
    values.periodicity = DEFAULT_PERIODICITY;
    const isDuplicate = debts.some((debt) => debt.debtName === values.debtName);

    if (minimumPayment < Number((debtValue * 0.03).toFixed(2))) {
      setMinPaymentError(
        `The minimum value for this field is ${Number(
          (debtValue * 0.03).toFixed(2)
        )}`
      );
      return;
    }

    if (isDuplicate) {
      toast.error("A debt with this name is already registered.");
      return;
    }

    setDebts((debts) => [...debts, values]);

    showToast(
      "Debt added",
      "You can keep adding as many as you want",
      "success"
    );

    (document.getElementById("debt-form") as HTMLFormElement).reset();
  };

  useEffect(() => {
    if (minimumPayment < Number((debtValue * 0.03).toFixed(2))) {
      setMinPaymentError(
        `The minimum value for this field is ${Number(
          (debtValue * 0.03).toFixed(2)
        )}`
      );
      return;
    }
    setMinPaymentError("");
  }, [minimumPayment]);

  return (
    <>
      {customToast}
      <Form id="debt-form" onSubmit={submit}>
        <div className="grid grid-cols-4 md:grid-cols-12 gap-3 gap-y-8">
          <div className="col-span-4 md:col-span-5">
            <Input
              label="Name Your Debt"
              name="debtName"
              placeholder="Ex. Visa, Chase, Amex"
              inline={true}
              required={true}
              setFormHasError={setFormHasError}
            />
          </div>
          <div className="col-span-4 md:col-span-3">
            <Select
              label="Debt Type"
              name="debtType"
              options={[
                {
                  label: "Credit Card",
                  value: "CreditCard",
                },
              ]}
              inline={true}
              required={true}
              defaultValue="CreditCard"
            />
          </div>
          <div className="col-span-4 md:col-span-4">
            <Input
              label="Interest Rate"
              name="rate"
              type="percentage"
              placeholder="00.00%"
              maxNumberValue={100}
              minNumberValue={0.01}
              inline={true}
              required={true}
              setFormHasError={setFormHasError}
            />
          </div>
          <div className="col-span-4 md:col-span-3">
            <Input
              label="Outstanding Balance"
              name="balance"
              type="currency"
              placeholder="$00.00"
              minNumberValue={0.01}
              inline={true}
              required={true}
              onChange={setDebtValue}
              setFormHasError={setFormHasError}
            />
          </div>
          <div className="col-span-4 md:col-span-3">
            <Input
              label="Minimum Payment"
              name="minPayment"
              type="currency"
              placeholder="$00.00"
              error={minPayAmountError}
              onChange={setMinimumPayment}
              inline={true}
              required={true}
              minNumberValue={
                debtValue > 0.01 ? Number((debtValue * 0.03).toFixed(2)) : 0.01
              } // Minimum payment is at least 3% of the balance
              setFormHasError={setFormHasError}
            />
          </div>
          <div className="col-span-4 md:col-span-12">
            <div className="mt-5 flex justify-end">
              <ButtonWithIcon
                icon={<AiOutlinePlusCircle className="text-2xl" />}
                classProp="font-semibold"
                disabled={formHasError}
                text="Add Debt"
              />
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}
