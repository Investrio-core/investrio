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

type Props = {
  extraPayment: number;
  setExtraPayment: Dispatch<SetStateAction<number | undefined>>;
  submitAdditionalPayment: Function;
};

export default function AddAdditionalPayment({
  extraPayment,
  setExtraPayment,
  submitAdditionalPayment,
}: Props) {
  const [extraPaymentAmount, setExtraPaymentAmount] =
    useState<number>(extraPayment);
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

  const submit = () => {
    setExtraPayment(extraPaymentAmount);
    showToast("Extra Repayment Added", "", "success");
    submitAdditionalPayment(extraPaymentAmount);
  };

  return (
    <>
      {customToast}
      {/* <Form id="debt-form" onSubmit={submit}> */}
      <div className="grid grid-cols-4 md:grid-cols-12 gap-3 gap-y-2">
        <div className="col-span-4 md:col-span-3">
          <MultiInputBlock
            number={extraPaymentAmount}
            lastSavedNumber={extraPayment}
            setNumber={setExtraPaymentAmount}
            sectionTitle={"We suggest an additional monthly payment"}
            step={50}
            min={0}
            max={10000}
            sectionTitleStyles="text-slate-400 text-center text-md font-semibold tracking-tight mx-[6px] my-[6px]"
            addPadding={false}
            inputFieldName={"extraPayAmount"}
            optionalValues={[50, 100, 150]}
            selectedOption={extraPaymentAmount}
            setSelectedOption={(value: number) => setExtraPaymentAmount(value)}
            //   isLoading={isLoading}
            onSubmit={submit}
            skippable={true}
            onSkip={submit}
          />
        </div>
      </div>
      {/* </Form> */}
    </>
  );
}
