import { forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './monthpicker.css'

import CalendarIcon from "@/public/icons/calendar.svg";

interface MontPickerProps {
    date: Date | null
    setDate: (date: Date | null) => void
}

interface CustomDatePickerInputProps {
    value: string
    onClick: () => void
}

export type Ref = HTMLDivElement;


const CustomDatePickerInput = forwardRef<Ref, CustomDatePickerInputProps>(({ value, onClick }, ref) => {
  return (
    <div className="text-xl relative w-fit flex gap-4 items-center cursor-pointer" ref={ref} onClick={onClick}>
      {value}
      <CalendarIcon className="hover:text-purple-3 focus:text-purple-3"/>
    </div>
  );
});

const MonthPicker = ({ date, setDate }: MontPickerProps) => {
  return (
    <DatePicker
      // @ts-ignore
      customInput={<CustomDatePickerInput />}
      popperClassName="!left-[-50px]"
      onChange={(date) => setDate(date)}
      calendarClassName="datepicker"
      showMonthYearPicker
      selected={date}
      dateFormat={"MMMM, yyyy"}
    />
  );
};

export default MonthPicker;
