import Link from "next/link";
import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Loading } from "../../loading/Loading";

type ButtonPattern = ButtonHTMLAttributes<HTMLButtonElement>;

interface ButtonProps extends ButtonPattern {
  classProp?: string;
  classIconProp?: string;
  text: string;
  icon?: React.ReactNode;
  href?: string;
  loading?: boolean;
}

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
          : "bg-[#8833FF] hover:bg-[#9248F8]"
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
  loading,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      className={clsx(
        "flex w-full items-center justify-center gap-2 rounded-lg bg-[#8833FF] p-3 text-[#EDF2F6]",
        className
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
