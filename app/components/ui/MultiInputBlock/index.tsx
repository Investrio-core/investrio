import { formatCurrency } from "@/app/utils/formatters";
import IconButton from "@/app/components/ui/IconButton";
import RangeSlider from "@/app/components/ui/RangeSlider";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import BoundInput from "@/app/components/ui/BoundInput";
import { SimpleButton } from "@/app/components/ui/buttons";
import { useEffect } from "react";

interface Props {
  number: number;
  lastSavedNumber: number;
  setNumber: Function;
  sectionTitle: string;
  sectionTitleStyles: string;
  step: number;
  onSubmit: Function;
  isLoading: boolean;
  min?: number;
  max?: number;
}

export default function MultiInputBlock({
  number,
  lastSavedNumber,
  setNumber,
  sectionTitle,
  sectionTitleStyles,
  step,
  onSubmit,
  isLoading,
  min,
  max,
}: Props) {
  useEffect(() => {
    if (number !== lastSavedNumber) setNumber(lastSavedNumber);
  }, [lastSavedNumber]);

  return (
    <>
      <div className="flex justify-between mb-[24px]">
        <h3
          className={`text-center text-xl font-medium text-indigo-800 leading-7 w-[100%] justify-self-center align-self-center ${sectionTitleStyles}`}
        >
          {sectionTitle}
        </h3>
      </div>
      <div className="bg-white rounded-[18px] border border-violet-200 px-[16px] py-[16px] max-w-[100%]">
        <div className="flex w-[98%] justify-between content-center items-center text-[32px] font-bold">
          <IconButton
            onClick={() =>
              setNumber((prevValue: number) => {
                if (prevValue - step < 0) return 0;
                return prevValue - step;
              })
            }
            Icon={FaCircleMinus}
            className="text-slate-400"
            disabled={number === 0}
          />

          <div className="max-w-[50%] align-self-center justify-self-center">
            <BoundInput
              // label="Amount"
              name="extraPayAmount"
              type="currency"
              placeholder="$00.00"
              // inline
              required
              onChange={(value: string) => setNumber(Number(value))}
              // onBlur={(value: string) => setIncome(Number(value))}
              value={number ?? 0}
            />
          </div>

          <IconButton
            onClick={() => setNumber((prevValue: number) => prevValue + step)}
            Icon={FaCirclePlus}
            className="text-cyan-950"
          />
        </div>
        <div className={"mx-[8px]"}>
          <RangeSlider
            valueSetter={setNumber}
            value={number}
            step={step}
            min={min}
            max={max}
          />
        </div>
        {number !== lastSavedNumber ? (
          <div className="mt-4 flex flex-col gap-2">
            <SimpleButton
              type="submit"
              text="Save"
              onClick={() => onSubmit()}
              disabled={isLoading}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
