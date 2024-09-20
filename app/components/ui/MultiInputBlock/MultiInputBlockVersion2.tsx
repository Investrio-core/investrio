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
  sectionTitle?: string;
  sectionTitleStyles: string;
  sectionTitleStyle?: object;
  step: number;
  onSubmit?: Function;
  isLoading?: boolean;
  min?: number;
  max?: number;
  addPadding?: boolean;
  inputFieldName?: string;
  optionalValues?: number[];
  selectedOption?: number;
  setSelectedOption?: Function;
  skippable?: Boolean;
  onSkip?: Function;
  aboveInput?: JSX.Element;
  submitButtonText?: string;
}

export default function MultiInputBlock({
  number,
  lastSavedNumber,
  setNumber,
  sectionTitle,
  sectionTitleStyles,
  sectionTitleStyle = {},
  step,
  onSubmit,
  isLoading,
  min,
  max,
  addPadding = true,
  inputFieldName = undefined,
  optionalValues,
  selectedOption,
  setSelectedOption,
  skippable = false,
  onSkip,
  aboveInput = undefined,
  submitButtonText = "Save",
}: Props) {
  useEffect(() => {
    if (number !== lastSavedNumber) setNumber(lastSavedNumber);
  }, [lastSavedNumber]);

  return (
    <div className={"mx-[8px]"}>
      <div className={`flex justify-between items-center`}>
        {sectionTitle ? (
          <div className="h-5 text-black text-sm font-medium ">
            {sectionTitle}
          </div>
        ) : null}
        <div className="max-w-[35%]">
          <BoundInput
            // label="Amount"
            name={inputFieldName ?? "extraPayAmount"}
            type="currency"
            placeholder="$00.00"
            inline
            required
            onChange={(value: string) => setNumber(Number(value))}
            // onBlur={(value: string) => setIncome(Number(value))}
            value={number ?? 0}
            inputStyles={{
              fontSize: "12px",
              //   height: "14px",
              maxHeight: "15px",
              // backgroundColor: "white",
              border: "none",
            }}
          />
        </div>
      </div>
      {/* border border-violet-200 */}

      <RangeSlider
        valueSetter={setNumber}
        value={number}
        step={step}
        min={min}
        max={max}
      />

      {optionalValues ? (
        <div className="flex flex-row mx-[8px] gap-[8px]">
          {optionalValues.map((value: number) => {
            return (
              <div
                onClick={() => setSelectedOption && setSelectedOption(value)}
                className={`w-[98.33px] h-10 flex justify-center items-center ${
                  selectedOption === value ? "bg-indigo-950" : "bg-neutral-50"
                } rounded-md shadow-md`}
                key={value}
              >
                <div
                  className={`text-center ${
                    selectedOption === value ? "text-white" : "text-indigo-950"
                  } text-base font-medium leading-tight`}
                >
                  {formatCurrency(value)}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {number !== lastSavedNumber && onSubmit ? (
        <div className="mt-[4px] ml-[-25px] mr-[-50px] flex flex-col gap-2">
          <SimpleButton
            type="submit"
            text={submitButtonText}
            onClick={() => onSubmit()}
            disabled={isLoading}
          />
        </div>
      ) : null}
      {skippable && number === lastSavedNumber ? (
        <div className="mt-4 flex flex-col gap-2">
          <SimpleButton
            type="submit"
            text="Skip"
            onClick={() => onSkip && onSkip()}
            disabled={isLoading}
          />
        </div>
      ) : null}
    </div>
  );
}
