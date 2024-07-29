import React, { useEffect, useState } from "react";
import Select from "@/app/components/ui/Select";
import Input from "@/app/components/ui/Input";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Form from "@/app/components/ui/Form";
import { Dispatch, SetStateAction } from "react";
import { DebtFormType } from "@/types/debtFormType";
import { toast } from "react-toastify";
import ToastComponent from "@/app/components/toast";
import { ButtonWithIcon } from "@/app/components/ui/buttons";
import MultiInputBlock from "@/app/components/ui/MultiInputBlock";

const DEFAULT_PERIODICITY = "MONTH";

type DebtsFormProps = {
  debts: DebtFormType[];
  setDebts: Dispatch<SetStateAction<DebtFormType[]>>;
  submitDebt: Function;
};

export default function DebtsForm({
  setDebts,
  debts,
  submitDebt,
}: DebtsFormProps) {
  const [debtValue, setDebtValue] = useState<number>(0);
  const [minimumPayment, setMinimumPayment] = useState<number>(0);
  const [suggestedMinimum, setSuggestedMinimum] = useState<number>(0);
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
    console.log(values);

    values.periodicity = DEFAULT_PERIODICITY;
    const isDuplicate = debts.some((debt) => debt.debtName === values.debtName);

    // if (minimumPayment < Number((debtValue * 0.03).toFixed(2))) {
    //   setMinPaymentError(
    //     `The minimum value for this field is ${Number(
    //       (debtValue * 0.03).toFixed(2)
    //     )}`
    //   );
    //   return;
    // }

    if (isDuplicate) {
      toast.error("A debt with this name is already registered.");
      return;
    }

    // setDebts((debts) => [...debts, values]);
    submitDebt(values);

    showToast(
      "Debt added",
      "You can keep adding as many as you want",
      "success"
    );

    (document.getElementById("debt-form") as HTMLFormElement).reset();
  };

  useEffect(() => {
    const suggestedMinimum = Number((debtValue * 0.03).toFixed(2));
    // if (minimumPayment < suggestedMinimum) {
    //   setMinPaymentError(
    //     `The minimum value for this field is ${suggestedMinimum}`
    //   );
    //   return;
    // }
    setSuggestedMinimum(suggestedMinimum);
    // setMinPaymentError("");
  }, [debtValue]);

  return (
    <>
      {customToast}
      <Form id="debt-form" onSubmit={submit}>
        <div className="grid grid-cols-4 md:grid-cols-12 gap-3 gap-y-2">
          <div className="col-span-4 md:col-span-12">
            <Input
              label="Name Your Debt"
              labelStyles="text-slate-400 text-sm font-semibold uppercase tracking-tight"
              style={{ color: "#8E8ECC" }}
              name="debtName"
              placeholder="Ex. Visa, Chase, Amex"
              inline={true}
              required={true}
              setFormHasError={setFormHasError}
            />
          </div>
          <div className="col-span-4 md:col-span-6">
            <Select
              label="Debt Type"
              labelStyles="text-slate-400 text-sm font-semibold uppercase tracking-tight"
              style={{ color: "#8E8ECC" }}
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
          <div className="col-span-4 md:col-span-12">
            <MultiInputBlock
              number={debtValue}
              lastSavedNumber={debtValue}
              setNumber={setDebtValue}
              sectionTitle={"DEBT BALANCE"}
              step={100}
              min={0}
              max={30000}
              sectionTitleStyles="text-slate-400 text-sm font-semibold uppercase tracking-tight justify-self-start self-start"
              sectionTitleStyle={{ color: "#8E8ECC" }}
              addPadding={false}
              inputFieldName={"balance"}
            />
          </div>
          <div className="col-span-4 md:col-span-12 flex gap-[12px] max-[375px]:flex-col w-[100%]">
            <Input
              label="Interest Rate"
              labelStyles="text-slate-400 text-sm font-semibold uppercase tracking-tight"
              containerStyles="max-w-[48%] max-[375px]:max-w-[100%]"
              style={{ color: "#8E8ECC" }}
              name="rate"
              type="percentage"
              placeholder="00.00%"
              maxNumberValue={100}
              minNumberValue={0.01}
              inline={true}
              required={true}
              setFormHasError={setFormHasError}
            />
            <div>
              <Input
                label="Minimum Payment"
                labelStyles="text-slate-400 text-sm font-semibold uppercase tracking-tight"
                containerStyles="max-w-[48%] max-[375px]:max-w-[100%]"
                style={{ color: "#8E8ECC" }}
                name="minPayment"
                type="currency"
                placeholder="$00.00"
                error={minPayAmountError}
                onChange={setMinimumPayment}
                inline={true}
                defaultValue="0"
                // required={true}
                // minNumberValue={
                //   debtValue > 0.01 ? Number((debtValue * 0.03).toFixed(2)) : 0.01
                // } // Minimum payment is at least 3% of the balance
                setFormHasError={setFormHasError}
              />
              {minimumPayment === undefined ||
              suggestedMinimum > minimumPayment ? (
                <span className="text-xs text-red-500">
                  {`The minimum recommended value for this field is ${suggestedMinimum}`}
                </span>
              ) : null}
            </div>
          </div>
          {/* <div className="col-span-4 md:col-span-3">
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
          </div> */}
          {/* <div className="col-span-3 md:col-span-3"></div> */}
          <div className="col-span-4 md:col-span-12">
            <div className="mt-[8px] flex justify-end">
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
