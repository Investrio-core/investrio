import { DebtFormType } from "@/types/debtFormType";
import AddDebtForm from "./AddDebtForm";
import { DebtItem } from "./DebtTool";
import { Dispatch, SetStateAction, useState } from "react";
import { StrategyFormTooltip } from "@/app/components/strategy/add-strategy/FormTooltip";
import { ToolTipButton } from "@/app/components/ui/buttons";
import AddAdditionalPayment from "./AddAdditionalPayment";
import { GoTrash } from "react-icons/go";

interface Props {
  setDebts: Dispatch<SetStateAction<DebtFormType[]>>;
  debts: DebtFormType[];
  createDebt: Function;
  extraPaymentAmount?: number;
  setExtraPaymentAmount: Dispatch<SetStateAction<number | undefined>>;
  cancel: Function;
}

export default function AddDebt({
  debts,
  setDebts,
  createDebt,
  extraPaymentAmount,
  setExtraPaymentAmount,
  cancel,
}: Props) {
  const [newDebt, setNewDebt] = useState<DebtFormType | undefined>();
  // const [showAdditionalPaymentForm, setShowAdditionalPaymentForm] =
  //   useState(false);

  const submitNewDebt = (values: DebtFormType) => {
    createDebt({ newDebt: values });
    // cancel();
  };

  return (
    <div className="flex flex-col mt-[12px] px-[16px] py-[16px] xl:px-10 bg-indigo-50 rounded-[18px] border border-violet-200 lg:max-w-[500px] lg:mx-[28px]">
      <StrategyFormTooltip
        Icon={
          <ToolTipButton
            text="Where do I find this info?"
            classProp="mb-[12px]"
            iconText="?"
          />
        }
      />
      <div
        className="flex-row self-end justify-self-end"
        onClick={() => cancel()}
      >
        <GoTrash className="mr-2 cursor-pointer text-2xl" />
      </div>
      <AddDebtForm
        debts={debts}
        setDebts={setDebts}
        submitDebt={submitNewDebt}
      />

      {/* {!showAdditionalPaymentForm ? (
        <>
          <StrategyFormTooltip
            Icon={
              <ToolTipButton
                text="Where do I find this info?"
                classProp="mb-[12px]"
                iconText="?"
              />
            }
          />
          <div
            className="flex-row self-end justify-self-end"
            onClick={() => cancel()}
          >
            <GoTrash className="mr-2 cursor-pointer text-2xl" />
          </div>
          <AddDebtForm
            debts={debts}
            setDebts={setDebts}
            submitDebt={submitNewDebt}
          />
        </>
      ) : (
        <AddAdditionalPayment
          extraPayment={extraPaymentAmount ?? 0}
          setExtraPayment={setExtraPaymentAmount}
          submitAdditionalPayment={submitWithAdditionalPayment}
        />
      )} */}
    </div>
  );
}
