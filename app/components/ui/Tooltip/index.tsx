import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { IoMdClose } from "react-icons/io";

interface TooltipProps {
  children: React.ReactNode;
  text?: string;
  Icon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  iconClassName?: string;
  showCloseIcon?: boolean;
}

export const Tooltip = ({
  children,
  text,
  Icon,
  containerClassName,
  className,
  iconClassName,
  showCloseIcon = false,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={twMerge(["w-fit z-[9999]", containerClassName])}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {Icon && <div className={iconClassName}>{Icon}</div>}
      {text && !Icon && (
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
        // <div className="absolute left-[-150%] rounded-[16px] h-fit w-fit bg-white shadow-lg max-w-[500px] z-[9999] px-[37px] py-[29px] overflow-hidden">
        <div className="absolute left-0 md:left-[-150%] rounded-[16px] h-fit w-fit bg-white shadow-lg min-w-[80vw] z-[9999] px-[37px] py-[29px] overflow-hidden">
          {showCloseIcon ? (
            <IoMdClose
              className="mask mask-pentagon group-hover:bg-primary p-4 shadow transition text-slate-500 z-[9999]"
              size={60}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                cursor: "pointer",
              }}
              onClick={() => setVisible(false)}
            />
          ) : null}
          {children}
        </div>
      )}
    </div>
  );
};
