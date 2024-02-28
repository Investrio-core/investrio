import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  children: React.ReactNode;
  text?: string;
  Icon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  iconClassName?: string;
}

export const Tooltip = ({
  children,
  text,
  Icon,
  containerClassName,
  className,
  iconClassName,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={twMerge(["relative w-fit z-[9999]", containerClassName])}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {Icon && <div className={iconClassName}>{Icon}</div>}
      {text && (
        <div
          className={twMerge([
            "text-purple-1 text-base cursor-help hover:underline",
            className,
          ])}
        >
          {text}
        </div>
      )}
      {visible && (
        <div className="absolute left-[-150%] rounded-[16px] h-fit w-fit bg-white shadow-lg max-w-[500px] z-[9999] px-[37px] py-[29px] overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};
