import { useState } from "react";
import { Button } from "../../ui/buttons";

type Props = {
  onChangeStatus: (status: string) => void;
}

export const ChooseMethods = ({ onChangeStatus }: Props) => {
  const [selected, setSelected] = useState("snowball");

  return (
    <>
      <div className="my-12 flex flex-col md:flex-row w-full justify-center gap-9">
        <div className="lg:w-2/3 xl:w-7/12 rounded-lg">
          <div
            onClick={() => setSelected("snowball")}
            className={`relative flex h-full flex-col gap-5
            rounded-lg border-l-8 border-[#9248F8] bg-white px-10 pb-10
            pt-6 shadow-lg transition-all hover:border hover:border-l-8 hover:shadow-[#9248F8]
            ${
              selected === "snowball" ? "border shadow-lg shadow-[#9248F8]" : ""
            }`}
          >
            <div className="text-left">
              <h2 className="title">Investrio Method Monitor</h2>
            </div>
            <ul className="list-disc flex-col text-left text-[#242A3E]">
              <li><strong className="text-[#502FF5]"> Your Progress:</strong> Track your progress and speed up the journey towards financial freedom.</li>
              <li className="py-5"><strong className="text-[#502FF5]">Save Time and Money:</strong> We're here to offer you the guidance and motivation you need to achieve your goal.</li>
              <li><strong className="text-[#502FF5]">Set Your Debt-Free Date:</strong> Discover when you'll be debt-free and start seeing your savings grow.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mb-5 border-b-2 border-gray-100 p-3"/>

      <div className="flex justify-center gap-7">
        {/*<Link*/}
        {/*  href={"/dashboard/debts/add"}*/}
        {/*  className="flex w-full items-center justify-center rounded-lg border*/}
        {/*  border-[#8833FF] p-3 font-medium text-[#8833FF] md:w-80"*/}
        {/*>*/}
        {/*  Learn more about methods*/}
        {/*</Link>*/}
        <Button
          onClick={() => onChangeStatus('add-debts')}
          disabled={selected != "snowball"}
          text="Proceed"
        />
      </div>
    </>
  );
};
