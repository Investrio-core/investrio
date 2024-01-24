import React, { useState } from "react";
import Select from "@/app/components/forms/Select";
import Input from "@/app/components/forms/Input";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Form from "@/app/components/forms/Form";
import { Dispatch, SetStateAction } from "react";
import { DebtFormType } from "@/types/debtFormType";
import { toast } from "react-toastify";
import { ToastComponent } from "@/app/components/toast";
import { ButtonWithIcon } from "@/app/components/ui/buttons";

type DebtsFormProps = {
  debts: DebtFormType[];
  setDebts: Dispatch<SetStateAction<DebtFormType[]>>;
};

export default function DebtsForm({ setDebts, debts }: DebtsFormProps) {
  const [debtValue, setDebtValue] = useState<number>(0);
  const [formHasError, setFormHasError] = useState<boolean>(false);

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
    const isDuplicate = debts.some(debt => debt.debtName === values.debtName);

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
              inline
              required
              setFormHasError={setFormHasError}
            />
          </div>
          <div className="col-span-4 md:col-span-3">
            <Select
              label="Debt Type"
              name="debtType"
              options={[
                // {
                //   label: "Debit Card",
                //   value: "DebitCard",
                // },
                {
                  label: "Credit Card",
                  value: "CreditCArd",
                },
                {
                  label: "Student Loan",
                  value: "StudentLoan",
                },
              ]}
              inline
              required
              defaultValue="CreditCArd"
            />

          </div>
          <div className="col-span-4 md:col-span-4">
            <Input
              label="Interest Rate"
              name="rate"
              type="percentage"
              placeholder="00.00%"
              maxNumberValue={100}
              inline
              required
              setFormHasError={setFormHasError}
            />
          </div>
          <div className="col-span-4 md:col-span-3">
            <Input
              label="Outstanding Balance"
              name="balance"
              type="currency"
              placeholder="$00.00"
              inline
              required
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
              inline
              required
              minNumberValue={Number(Math.round(debtValue * 0.03).toFixed(0))} // Minimum payment is at least 3% of the balance
              setFormHasError={setFormHasError}
            />

          </div>
          <div className="col-span-4 md:col-span-3">
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

          </div>
          <div className="col-span-4 md:col-span-3">
            <Input
              defaultValue={new Date().toISOString().split("T")[0]}
              label="Payment Due Date"
              name="dueDate"
              type="date"
              inline
              required
            />

          </div>
          <div className="col-span-4 md:col-span-12">
            <div className="mt-5 flex justify-end">
              <ButtonWithIcon
                icon={<AiOutlinePlusCircle className="text-2xl"/>}
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
