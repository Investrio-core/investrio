"use client";
import React, {
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { TbAlertHexagon } from "react-icons/tb";
import { formatCurrency, formatPercent } from "@/app/utils/formatters";

type InputProps = {
  label?: string;
  labelStyles?: string;
  containerStyles?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?:
    | "text"
    | "number"
    | "date"
    | "email"
    | "password"
    | "percentage"
    | "currency";
  inline?: boolean;
  defaultValue?: string | number;
  onBlur?: Function;
  onChange?: Function;
  maxNumberValue?: number;
  minNumberValue?: number;
  setFormHasError?: (value: boolean) => void;
  error?: string;
  style?: object;
};

const inputClass = (inline?: boolean, error?: boolean): string =>
  twMerge(
    "focus:border-primary-700 input border-[#EDF2F6] bg-[#F8F8F8] placeholder-[#656565] transition focus:outline-none",
    inline ? "col-span-4" : "",
    error ? "border-red-500" : ""
  );

const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    labelStyles,
    containerStyles,
    required,
    type,
    inline,
    onChange,
    maxNumberValue,
    setFormHasError,
    minNumberValue,
    error: validationError,
    style = {},
  } = props;
  const [error, setError] = useState<string | null>(null);
  const isNumericField =
    type === "currency" || type === "percentage" || type === "number";
  const ref = useRef(null);

  const validateInput = (value: string, maxNumberValue?: number) => {
    if (required && !value.trim()) {
      setError("You need to fill this field!");
      return false;
    }

    if (isNumericField) {
      if (maxNumberValue && Number.parseFloat(value) > maxNumberValue) {
        setError(`Max value is ${maxNumberValue}.`);
        return false;
      }

      if (Number.parseFloat(value) < 0) {
        setError(`Negative values not allowed.`);
        return false;
      }

      if (minNumberValue && Number.parseFloat(value) < minNumberValue) {
        setError(`The minimum value for this field is ${minNumberValue}`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const inputType = useMemo(() => {
    // Types currency or percentage get inputType text to show the mask correctly.
    if (type === "currency" || type === "percentage") {
      return "text";
    }
    return type || "text";
  }, [type]);

  const onChangeInput = (
    event: React.ChangeEventHandler<HTMLInputElement> & {
      target: HTMLInputElement;
    }
  ) => {
    cleanNumber(event);
    const validated = validateInput(event.target.value, maxNumberValue);
    setFormHasError?.(!validated);
    onChange?.(event.target.value); // pass the clean number (without masks, etc)
  };

  const onBlur = (
    event: React.FocusEventHandler & { target: HTMLInputElement }
  ) => {
    if (event.target.value.length > 0) {
      const validated = validateInput(event.target.value, maxNumberValue);
      setFormHasError?.(!validated);
    }
    if (type === "percentage") {
      event.target.value = formatPercent(event.target.value);
    } else if (type === "currency") {
      event.target.value = formatCurrency(event.target.value);
    }
  };

  const cleanNumber = (event: any) => {
    if (isNumericField) {
      event.target.value = event.target.value.replaceAll("$", "");
      event.target.value = event.target.value.replaceAll("%", "");
      event.target.value = event.target.value.replaceAll("-", "");
      event.target.value = event.target.value.replace(/[^\d.-]/g, ""); // Remove all
    }
  };

  useEffect(() => {
    if (validationError) {
      setError(validationError);
      setFormHasError?.(true);
    } else {
      setFormHasError?.(false);
      setError(null);
    }
  }, [validationError]);

  return (
    <div
      className={twMerge(
        "form-control relative w-full",
        inline ? "flex flex-col" : "",
        containerStyles ?? ""
      )}
    >
      {label && (
        <label className="text-left">
          <span
            className={`label-text text-md font-light text-[#747682] ${
              labelStyles ?? ""
            }`}
            style={{ ...style }}
          >
            {label}
          </span>
        </label>
      )}

      <input
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
        ref={ref}
        className={inputClass(props.inline, error !== null)}
        type={inputType}
        onChange={onChangeInput as any}
        onFocus={cleanNumber}
        onBlur={onBlur as any}
      />

      {error && (
        <small className="ml-2 mt-2 flex items-center text-left text-xs font-semibold text-red-500">
          <TbAlertHexagon className="text-md" />・{error}
        </small>
      )}
    </div>
  );
};

export default Input;
