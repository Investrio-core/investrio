import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { ChangeEventHandler } from "react";

type SelectProps = {
  label: string;
  name: string;
  value?: string;
  options: {
    label: string;
    value: string;
  }[];
  required?: boolean;
  inline?: boolean;
  defaultValue?: string;
  className?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
};
export default function Select(
  {
    label,
    name,
    options,
    defaultValue,
    inline,
    value,
    disabled,
    onChange,
  }: SelectProps
) {
  return (
    <div className={twMerge(`form-control`, inline ? "flex flex-col" : "")}>
      <label className={"text-left font-light"}>
        <span className="label-text text-bold text-[#747682]">{label}</span>
      </label>
      <select
        disabled={disabled}
        value={value}
        className={clsx(
          "select select-bordered w-[100%] h-10 border-[#EDF2F6] bg-[#F8F8F8] text-[#747682] text-base",
        )}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
      >
        {options.map((option) => (
          <option
            className="text-[#747682] text-base w-full p-3"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
