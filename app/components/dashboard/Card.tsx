import Calendar from "@/public/icons/calendar-styled.svg";
import DebtFree from "@/public/icons/debt-free.svg";
import TotalSaved from "@/public/icons/total-saved.svg";
import EditIcon from "@/public/icons/edit.svg";
import IconButton from "@/app/components/ui/IconButton";
import { DebtSvg } from "../Layout/MobileNavigator";
import ExtraPayment from "@/public/icons/extra-payment.svg";

type CardProps = {
  icon:
    | "calendar"
    | "extra-payment"
    | "debt-free"
    | "total-saved"
    | "total-debt";
  value?: number | string;
  label: string;
  date?: { month: string; year: string };
  withEdit?: boolean;
  onEditClick?: () => void;
  sublabel?: string;
};
/**
 * Card component displays information with an icon, value, label, and optional date and sublabel.
 * @param {CardProps} props - The properties of the Card component.
 * @returns {JSX.Element} - The rendered Card component.
 */
export const Card = ({
  icon,
  value,
  label,
  date,
  sublabel,
  withEdit = false,
  onEditClick,
}: CardProps): JSX.Element => {
  /**
   * Renders the correct icon based on the provided icon type.
   * @returns {JSX.Element} - The rendered icon.
   */
  const renderCorrectIcon = () => {
    if (icon === "calendar") return <Calendar />;
    if (icon === "extra-payment") return <ExtraPayment />;
    if (icon === "debt-free") return <DebtFree />;
    if (icon === "total-saved") return <TotalSaved />;
    if (icon === "total-debt") return <DebtSvg />;
  };

  return (
    // <div className="relative max-w-fit-content lg:max-w-fit-content max-h-fit-content flex justify-between items-center gap-0 lg:gap-4 rounded-xl bg-white w-full ">
    <div>
      <div className="py-0 my-0 rounded-[18px] border border-[#b1b2ff]/80 py-[4px] px-[12px]">
        <div className="flex flex-col lg:flex-row justify-center items-center min-w-fit-content py-0 my-0 lg:mb-4">
          <div>{renderCorrectIcon()}</div>
          <span className="text-gray-500 font-normal text-xs lg:text-normal text-base leading-6 ml-2 whitespace-nowrap lg:whitespace-normal text-center">
            {label}
          </span>
        </div>
        <div className="flex justify-center lg:justify-start items-center max-w-32 py-0 my-0 text-center">
          <h1 className="font-bold text-black text-xs lg:text-4xl lg:leading-10">
            {typeof value === "number"
              ? value?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              : value}
          </h1>
        </div>
        {date && (
          <div>
            <div className="flex justify-center lg:justify-start items-center">
              <h1 className="font-bold text-black text-xs lg:text-4xl lg:leading-10">
                {date.month}
              </h1>
              <span className="font-bold text-gray-600 text-xs lg:text-lg lg:leading-7 ml-[4px] lg:ml-3">
                {date.year}
              </span>
            </div>
            <div className="flex justify-center lg:justify-start">
              <span className="text-gray-500 font-normal text-base leading-6">
                {/* Now debts are accrued */}
              </span>
            </div>
          </div>
        )}
        {sublabel && (
          <div className="flex justify-center lg:justify-start">
            <span className="text-gray-500 font-normal text-base leading-6">
              {/* {sublabel} */}
            </span>
          </div>
        )}
      </div>
      {withEdit && (
        <IconButton
          onClick={onEditClick}
          Icon={EditIcon}
          className="self-end max-[1210px]:self-start absolute right-1 top-1"
        />
      )}
    </div>
  );
};
