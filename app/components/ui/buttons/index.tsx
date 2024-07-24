import Link from "next/link";
import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Loading } from "../Loading";

type ButtonPattern = ButtonHTMLAttributes<HTMLButtonElement>;

interface ButtonProps extends ButtonPattern {
  classProp?: string;
  classIconProp?: string;
  text: string;
  iconText?: string;
  icon?: React.ReactNode;
  Icon?: () => JSX.Element;
  href?: string;
  loading?: boolean;
  type?: "submit" | "reset" | "button";
}

export const ToolTipButton = ({
  Icon,
  iconText,
  text,
  classProp,
}: ButtonProps) => {
  return (
    <div
      className={`w-[206px] h-[35px] bg-slate-400 rounded-[10px] shadow flex gap-[5px] justify-center items-center ${classProp}`}
    >
      {Icon ? (
        <div className="w-[19px] h-5 bg-violet-600 rounded-full">
          <Icon />
        </div>
      ) : null}
      {iconText ? (
        <div className="w-[19px] h-5 bg-violet-600 rounded-full relative">
          <div className="w-3.5 h-[13px] text-white text-sm font-normal leading-[21px] relative left-[6px]">
            {iconText}
          </div>
        </div>
      ) : null}
      <div className="text-white text-sm font-normal leading-[21px]">
        {text}
      </div>
    </div>
  );
};

export const StandardButton = ({
  text,
  onClick,
  type,
  disabled,
  classProp,
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-primary mt-4 w-full capitalize text-base/[16px] ${classProp}`}
      type={type}
      disabled={disabled}
      style={{
        borderRadius: "12px",
      }}
      onClick={onClick}
    >
      {disabled ? "Loading..." : text}
    </button>
  );
};

export const Button = ({ classProp, text, onClick, disabled }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="submit"
      className={`flex w-full items-center justify-center gap-2 rounded-lg
      p-3 text-[#EDF2F6]
      md:w-80 ${classProp} ${
        disabled
          ? "cursor-not-allowed bg-[#747682] opacity-50"
          : "bg-purple-3 hover:bg-[#9248F8]"
      }`}
    >
      {text}
    </button>
  );
};

export const SimpleButton = ({
  text,
  onClick,
  className,
  disabled = false,
  loading,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      disabled={disabled}
      className={clsx(
        "flex w-full items-center justify-center gap-2 rounded-lg p-3 text-[#EDF2F6]",
        className,
        disabled
          ? "cursor-not-allowed bg-[#747682]"
          : "bg-[#8833FF] hover:bg-[#9248F8]"
      )}
    >
      {loading && (
        <Loading border="border-white" isHeightScreen={false} size="sm" />
      )}
      {text}
    </button>
  );
};

export const LightButton = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-lg p-3 text-[#747682]"
    >
      {text}
    </button>
  );
};

export const ButtonWithIcon = ({
  classProp,
  text,
  icon,
  onClick,
  disabled,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="submit"
      className={`flex w-full items-center justify-center gap-2 rounded-lg
      px-4 py-2 text-[#EDF2F6]
      md:w-96 ${classProp} ${
        disabled
          ? "cursor-not-allowed bg-[#747682] opacity-50"
          : "bg-[#8833FF] hover:bg-[#9248F8]"
      }`}
    >
      {icon}
      {text}
    </button>
  );
};

export const ButtonLernMore = () => {
  <Link
    href={"/dashboard/debts/add"}
    className="flex w-full items-center justify-center rounded-lg border
    border-[#8833FF] p-4 font-medium text-[#8833FF] md:w-80"
  >
    Learn more about methods
  </Link>;
};

export const ButtonReturn = ({ text, href }: ButtonProps) => {
  return (
    <>
      {href ? (
        <Link href={href}>
          <a className="flex w-full items-center justify-center rounded-lg border border-[#8833FF] p-3 font-medium text-[#8833FF] md:w-80">
            {text}
          </a>
        </Link>
      ) : (
        <button className="flex w-full items-center justify-center rounded-lg border border-[#8833FF] p-3 font-medium text-[#8833FF] md:w-80">
          {text}
        </button>
      )}
    </>
  );
};
