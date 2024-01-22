"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  recentTransactionsMock,
  recentTransactionsTableColumns,
} from "@/app/components/dashboard/RecentTransactionsTable/recentTransactionsTableColumns";

export default function RecentTransactionsTable() {
  const table = useReactTable({
    data: recentTransactionsMock,
    columns: recentTransactionsTableColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="card bg-white p-3">
      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <h1 className="text-sm font-semibold text-slate-600">
          Recent Transactions on your Amex 11111 and Chase Saphire 111111
        </h1>
        <div className="flex flex-col gap-2 md:flex-row">
          <button className="btn btn-outline btn-sm btn-primary">
            Reports
          </button>
          <button className="btn btn-outline btn-sm btn-primary">
            View All
          </button>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="table ">
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="font-semibold text-black" key={cell.id}>
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
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
}
