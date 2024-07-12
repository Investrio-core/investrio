import { useSession } from "next-auth/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import MonthPicker from "../../components/budget/MonthPicker";

interface Props {
  sectionHeader: string;
  sectionSubheader: string;
  date: Date | null;
  setDate: (date: Date | null) => void;
}

export default function PageHeader({
  sectionHeader,
  sectionSubheader,
  date,
  setDate,
}: Props) {
  const { data } = useSession();
  const { user } = data!;
  const { name } = user;
  const firstName = name?.split(" ")[0];

  return (
    <div className="px-[16px] py-[8px] flex flex-col gap-[16px]">
      <div className="block lg:hidden flex-col justify-start items-start inline-flex">
        <div className="text-slate-950 text-base font-normal']">
          {Greeter()}
        </div>
        <div className="text-slate-950 text-[32px] font-semibold']">
          {firstName}
        </div>
      </div>
      {/* w-[343px] h-[60px] */}
      <div className="h-[60px] px-4 py-[27px] bg-white rounded-xl border border-zinc-200 justify-start items-center gap-2.5 inline-flex">
        <div className="grow shrink basis-0 h-10 justify-between items-center flex">
          <input
            placeholder="Type a question, talk to us!"
            className="w-[207px] h-[21px] text-zinc-500 text-sm font-normal'] leading-[21px] focus:outline-none"
          ></input>
          <div
            className="p-3 bg-indigo-50 rounded-lg justify-center items-center flex"
            style={{ zIndex: "-2 !important" }}
          >
            <div className="w-4 h-4">
              <FaMagnifyingGlass />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-[100%]">
        <div className="w-[135px] h-[53px] flex-col justify-start items-start gap-0.5 inline-flex">
          <div
            className="text-slate-400 text-sm font-semibold uppercase tracking-tight"
            style={{ color: "#8E8ECC" }}
          >
            {sectionHeader}
          </div>
          <div className="text-slate-950 text-xl font-semibold">
            {sectionSubheader}
          </div>
        </div>
        <div className="self-center self-justify-center">
          {/* <div className="w-[200px] flex justify-end items-center"> */}
          <MonthPicker date={date} setDate={setDate} />
        </div>
      </div>
    </div>
  );
}

export const Greeter = () => {
  let myDate = new Date();
  let hours = myDate.getHours();
  let greet;

  if (hours < 12) greet = "Morning";
  else if (hours >= 12 && hours <= 17) greet = "Afternoon";
  else if (hours >= 17 && hours <= 24) greet = "Evening";

  return `Good ${greet},`;
};
