import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/formatters";
import { BiDotsVerticalRounded } from "react-icons/bi";

type TransactionType = {
  date: string;
  status: StatusEnum;
  amount: number;
  description: string;
};

enum StatusEnum {
  IN_PROGRESS = "In Progress",
  COMPLETE = "Complete",
  CANCELLED = "Cancelled",
}

const statusMap: {
  [key in string]: { color: string; label: string; textColor: string };
} = {
  [StatusEnum.IN_PROGRESS]: {
    color: "#FFF3D0",
    textColor: "#FFA500",
    label: "In Progress",
  },
  [StatusEnum.COMPLETE]: {
    color: "#DCF8DC",
    textColor: "#008000",
    label: "Complete",
  },
  [StatusEnum.CANCELLED]: {
    color: "#F8DDDD",
    textColor: "#FF0000",
    label: "Cancelled",
  },
};

const columnHelper = createColumnHelper<TransactionType>();

export const recentTransactionsTableColumns = [
  columnHelper.accessor("date", {
    cell: (info) => <span>{dayjs(info.getValue()).format("MMM DD")}</span>,
  }),
  columnHelper.accessor("status", {
    cell: (info) => (
      <div
        style={{
          backgroundColor: statusMap[info.getValue()].color,
          color: statusMap[info.getValue()].textColor,
        }}
        className="w-[150px] rounded-md p-2 py-1 text-center font-semibold"
      >
        <span>{statusMap[info.getValue()]?.label}</span>
      </div>
    ),
  }),
  columnHelper.accessor("description", {
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    cell: (info) => formatCurrency(info.getValue()),
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => (
      <div className="dropdown dropdown-left">
        <label tabIndex={0} className="btn btn-ghost btn-xs m-1">
          <BiDotsVerticalRounded />
        </label>
        <ul
          tabIndex={0}
          className="menu dropdown-content rounded-box z-[999] w-52 bg-slate-100 p-2 shadow"
        >
          <li>
            <a>Edit</a>
          </li>
          <li>
            <a>Delete</a>
          </li>
        </ul>
      </div>
    ),
  }),
];

export const recentTransactionsMock: TransactionType[] = [
  {
    date: "2023-06-13",
    status: StatusEnum.IN_PROGRESS,
    amount: 11000,
    description: "Investrio LLC",
  },
  {
    date: "2022-06-10",
    status: StatusEnum.COMPLETE,
    amount: -1000,
    description: "Payment",
  },
  {
    date: "2022-06-08",
    status: StatusEnum.CANCELLED,
    amount: 2000,
    description: "Transfer 12312321312",
  },
  {
    date: "2022-06-06",
    status: StatusEnum.COMPLETE,
    amount: 1000,
    description: "Payment 12312321",
  },
];
