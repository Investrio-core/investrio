import { forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./monthpicker.css";

import CalendarIcon from "@/public/icons/calendar.svg";

interface MonthPickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
}

interface CustomDatePickerInputProps {
  value: string;
  onClick: () => void;
}

export type Ref = HTMLDivElement;

const CustomDatePickerInput = forwardRef<Ref, CustomDatePickerInputProps>(
  ({ value, onClick }, ref) => {
    return (
      <div
        className="text-md relative w-fit flex gap-[6px] items-center cursor-pointer z-25 font-medium mr-[8px]"
        ref={ref}
        onClick={onClick}
        style={{ zIndex: "25 !important" }}
      >
        {value}
        <CalendarIcon className="hover:text-purple-3 focus:text-purple-3" />
      </div>
    );
  }
);

const MonthPicker = ({ date, setDate }: MonthPickerProps) => {
  return (
    <DatePicker
      // @ts-ignore
      customInput={<CustomDatePickerInput />}
      popperClassName="!left-[-75px]"
      onChange={(date) => setDate(date)}
      calendarClassName="datepicker z-25"
      showMonthYearPicker
      selected={date}
      dateFormat={"MMMM"} //, yyyy"}
    />
  );
};

export default MonthPicker;
