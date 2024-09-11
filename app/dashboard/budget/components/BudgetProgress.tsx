import { formatCurrency } from "@/app/utils/formatters";
import LinearProgress from "@mui/material/LinearProgress";

export default function BudgetProgress({
  hasBudgetData,
  totalExpenses,
  income,
  incomeAfterExpenses,
  extraPayment,
  oldExtraPayment,
}: {
  hasBudgetData: boolean;
  totalExpenses: number;
  income: number;
  incomeAfterExpenses: number;
  extraPayment: number;
  oldExtraPayment: number;
}) {
  const available =
    incomeAfterExpenses -
    (extraPayment === 0
      ? oldExtraPayment ?? 0
      : extraPayment + oldExtraPayment ?? 0);

  return (
    <div className="relative w-[100%]">
      <div className="px-[11px] py-[8px] mt-[11px] bg-white rounded-[18px] border border-[#b1b2ff]/80 w-[100%] ">
        <div className="flex justify-between items-center w-[100%]">
          <div className="h-5 text-center text-black text-sm font-medium text-nowrap">
            💰 Available Disposable Income
          </div>
          <div className="w-12 h-5 text-center text-[#40405c] text-sm font-normal mr-[11px]">
            {formatCurrency(available)}
          </div>
        </div>
        <LinearProgress
          sx={{
            borderRadius: "25px",
            height: "6px",
            marginTop: "10px",
            // maxWidth: "89%",
            position: "relative",
            // top: "18px",
            // left: "6%",
            backgroundColor: "darkred",
            "& .MuiLinearProgress-bar": {
              backgroundColor: hasBudgetData ? "#8833ff" : "darkgrey",
            },
          }}
          variant="determinate"
          value={(1 - totalExpenses / income) * 100}
        />
        <div className="flex justify-between">
          <div
            className="#40405c text-[10px] font-bold"
            style={
              {
                // position: "absolute",
                // color: "darkgreen",
                // top: "8px",
                // left: "13%",
                // transform: "translateX(-50%)",
              }
            }
          >
            Income
          </div>
          <div
            className="#40405c text-[10px] font-bold"
            style={
              {
                // position: "absolute",
                // color: "darkred",
                // top: "8px",
                // left: "87%",
                // transform: "translateX(-50%)",
              }
            }
          >
            Expenses
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="h-10 w-[100%] relative mt-[38px] mb-[0px] bg-white rounded-[18px] border border-2 border-violet-200">
  //     <div className="font-md text-violet-500 font-bold mx-[4px] relative top-[-30px] left-[3%]">
  //       {hasBudgetData
  //         ? "Monthly Disposable Income"
  //         : "Set a budget to plan better"}
  //     </div>
  //     <LinearProgress
  //       sx={{
  //         borderRadius: "15%",
  //         marginTop: "3px",
  //         maxWidth: "89%",
  //         position: "relative",
  //         top: "-24px",
  //         left: "6%",
  //         backgroundColor: "darkred",
  //         "& .MuiLinearProgress-bar": {
  //           backgroundColor: hasBudgetData ? "darkgreen" : "darkgrey",
  //         },
  //       }}
  //       variant="determinate"
  //       value={(1 - totalExpenses / income) * 100}
  //     />
  //     <div
  //       style={{
  //         position: "absolute",
  //         color: "darkgreen",
  //         top: "8px",
  //         left: "13%",
  //         transform: "translateX(-50%)",
  //       }}
  //     >
  //       Income
  //     </div>
  //     <div
  //       style={{
  //         position: "absolute",
  //         color: "black",
  //         top: "8px",
  //         left: "50%",
  //         transform: "translateX(-50%)",
  //       }}
  //     >
  //       {/* {((totalExpenses / income) * 100).toFixed(2)}% */}
  //       {formatCurrency(available)}
  //     </div>
  //     <div
  //       style={{
  //         position: "absolute",
  //         color: "darkred",
  //         top: "8px",
  //         left: "87%",
  //         transform: "translateX(-50%)",
  //       }}
  //     >
  //       Expenses
  //     </div>
  //   </div>
  // );
}
