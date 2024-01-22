import Image from "next/image";
import calendar from "../icons/calendar-styled.svg";
import extraPayment from "../icons/extra-payment.svg";
import debtFree from "../icons/debt-free.svg";
import totalSaved from "../icons/total-saved.svg";

type CardProps = {
  icon: "calendar" | "extra-payment" | "debt-free" | "total-saved";
  value?: number;
  label: string;
  date?: { month: string; year: string };
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
                     }: CardProps): JSX.Element => {
  /**
   * Renders the correct icon based on the provided icon type.
   * @returns {JSX.Element} - The rendered icon.
   */
  const renderCorrectIcon = () => {
    if (icon === "calendar") return <Image src={calendar} alt="calendar"/>;
    if (icon === "extra-payment")
      return <Image src={extraPayment} alt="extra payment"/>;
    if (icon === "debt-free") return <Image src={debtFree} alt="debt free"/>;
    if (icon === "total-saved")
      return <Image src={totalSaved} alt="totalSaved"/>;
  };

  return (
    <div className="gap-4 rounded-xl border-b-2 border-r-2 border border-[#EDF2F6] bg-white py-4 px-5 w-full">
      <div className="flex items-center mb-4">
        {renderCorrectIcon()}
        <span className="text-gray-500 font-normal text-base leading-6 ml-2">
          {label}
        </span>
      </div>
      <div className="flex justify-start items-center">
        <h1 className="font-bold text-black text-4xl leading-10">
          {value?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </h1>
      </div>
      {date && (
        <div>
          <div className="flex justify-start items-center">
            <h1 className=" font-bold text-black text-4xl leading-10">
              {date.month}
            </h1>
            <span className=" font-bold text-gray-600 text-lg leading-7 ml-3">
              {date.year}
            </span>
          </div>
          <div className="flex justify-start">
            <span className="text-gray-500 font-normal text-base leading-6">
              {/* Now debts are accrued */}
            </span>
          </div>
        </div>
      )}
      {sublabel && (
        <div className="flex justify-start">
          <span className="text-gray-500 font-normal text-base leading-6">
            {/* {sublabel} */}
          </span>
        </div>
      )}
    </div>
  );
};
