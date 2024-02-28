import { useEffect, useState } from "react";
import clsx from "clsx";
import { formatCurrency } from "@/app/utils/formatters";

type Info = {
  id: number;
  label: string;
  subLabel: string;
  value1: number;
  value2: number;
  paid: boolean;
};

export type CheckboxTableProps = {
  infos: Info[];
};

export const CheckboxTable = ({ infos }: CheckboxTableProps) => {
  const [list, setList] = useState<Info[]>(infos);

  const handleCheckBoxChange = (id: number) => {
    const newList = list.map((info) => {
      if (info.id === id) {
        return { ...info, paid: !info.paid };
      }

      return info;
    });

    setList(newList);
  };

  useEffect(() => {
    setList(infos)
  }, [infos])

  return (
    <div className="rounded-lg w-full border border-[#EDF2F6] display flex flex-col justify-start p-8 py-4 overflow-y-auto h-full">
      <div className="flex justify-between mb-6 font-semibold">
        <p>Actual Payments</p>
        <p className="text-gray-400">
          {list.filter((l) => l.paid).length}/{list.length} done
        </p>
      </div>
      {list?.map((info, index) => {
        return (
          <div
            key={info.label + info.value2}
            className={clsx({
              "line-through text-gray-400": info.paid,
            })}
          >
            <hr className="bg-grey-400" />
            <div className="flex justify-between my-4">
              <div className="flex items-center">
                <input
                  className="checkbox checkbox-primary"
                  type="checkbox"
                  onChange={() => handleCheckBoxChange(index)}
                />
                <div className="ml-4 flex flex-col justify-start items-start whitespace-nowrap">
                  <span className="text-lg font-semibold leading-7">
                    {info.label}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex flex-col justify-start items-start">
                <span className="text-lg font-semibold leading-7">
                  {formatCurrency(info.value1)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
