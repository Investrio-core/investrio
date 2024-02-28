import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DebtFormType } from "@/types/debtFormType";
import { formatCurrency, formatPercent } from "@/app/utils/formatters";
import dayjs from "dayjs";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { TbEdit } from "react-icons/tb";
import { GoTrash } from "react-icons/go";

import { PiDotsThreeCircleLight } from "react-icons/pi";

type DebtsTableProps = {
  data: DebtFormType[];
  onEditDebt: (index: string) => void;
  onDeleteDebt: (index: string) => void;
};

const debtTypesMapper = {
  DebitCard: "/images/card.png",
  CreditCard: "/images/card.png",
  StudentLoan: "/images/student.png",
};

const columnHelper = createColumnHelper<DebtFormType>();

export default function DebtsTable({
  data,
  onEditDebt,
  onDeleteDebt,
}: DebtsTableProps) {
  const columns = [
    columnHelper.accessor("debtType", {
      header: "Debts",
      cell: (info) => (
        <div className="flex h-7 w-8 items-center justify-center rounded-full border-2">
          <Image
            src={(debtTypesMapper as any)[info.getValue()]}
            alt={info.getValue()}
            width={20}
            height={20}
          />
        </div>
      ),
    }),
    columnHelper.accessor("debtName", {
      cell: (info) => info.getValue(),
      header: "",
      footer: "Total Debt",
    }),
    columnHelper.accessor("balance", {
      header: "Outstanding Balance",
      cell: (info) => formatCurrency(info.renderValue()),
      footer: () => {
        const totalBalance = data.reduce((previous, current) => {
          const balanceValue = Number(current.balance.replace(/[^\d.-]/g, ""));
          return isNaN(balanceValue) ? previous : previous + balanceValue;
        }, 0);
        return formatCurrency(totalBalance);
      },
    }),
    columnHelper.accessor("rate", {
      header: "Interest Rate",
      cell: (info) => formatPercent(info.renderValue()),
      footer: () => {
        const validRates = data
          .map((current) => Number(current.rate.replace("%", "")))
          .filter((rate) => !isNaN(rate));

        if (validRates.length > 0) {
          const averageRate =
            validRates.reduce((total, rate) => total + rate, 0) /
            validRates.length;
          return formatPercent(averageRate.toFixed(2));
        }

        return formatPercent(0);
      },
    }),
    columnHelper.accessor("minPayment", {
      header: "Minimum Payment",
      cell: (info) => formatCurrency(info.renderValue()),
      footer: () => {
        const totalMinPayment = data.reduce((previous, current) => {
          const minPaymentValue = Number(
            current.minPayment.replace(/[^\d.-]/g, "")
          );
          return isNaN(minPaymentValue) ? previous : previous + minPaymentValue;
        }, 0);
        return formatCurrency(totalMinPayment);
      },
    }),
    columnHelper.accessor("dueDate", {
      header: "Start Month",
      cell: (info) => (
        <div className="flex items-center justify-between">
          <span>{dayjs().format("MMM")}</span>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                <PiDotsThreeCircleLight
                  className="text-2xl"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onEditDebt(info.cell.id)}
                        className={`${
                          active
                            ? "bg-[#8833FF1A] text-[#8833FF]"
                            : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <TbEdit className="mr-2 cursor-pointer text-2xl" />
                        <span className="font-bold">Edit</span>
                      </button>
                    )}
                  </Menu.Item>
                  <div className="my-2 h-[1px] bg-[#D9D9D9]"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => onDeleteDebt(info.cell.id)}
                        className={`${
                          active
                            ? "bg-[#8833FF1A] text-[#8833FF]"
                            : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <GoTrash className="mr-2 cursor-pointer text-2xl" />
                        <span className="font-bold">Remove</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data.length) {
    return <></>;
  }

  return (
    <div className="w-full max-md:overflow-auto">
      <table className="table border-2 border-[#F6FAFD]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="text-md bg-[#F6FAFD] font-light" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className="text-black" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th className="font-bold text-black" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
