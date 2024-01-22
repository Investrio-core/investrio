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
        <div className="lg:w-1/3 xl:w-3/12 rounded-lg">
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
              <h2 className="title">Investrio Method</h2>
              <p className="text-sm text-[#242A3E]">
                The quickest way to become debt-free.
              </p>
            </div>
            <ul className="list-disc flex-col text-left text-[#242A3E]">
              <li>Discover your debt-free date and accelerate your progress with the Investrio method.</li>
              <li className="py-5">Based on snowball debt elimination calculation.</li>
              <li>First and best of many to come strategies for paying off debt.</li>
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
