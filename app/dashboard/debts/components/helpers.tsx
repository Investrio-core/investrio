import { Results } from "@/app/hooks/calculatorsSnowball";
import { formatCurrency } from "@/app/utils/formatters";
import dayjs from "dayjs";

export function getDebtFreeDate(neverDebtFree?: boolean, results?: Results) {
  const lastPayment = results?.["payments"]?.[results?.["payments"].length - 1];

  const endDate = lastPayment
    ? dayjs(lastPayment["accounts"][0].paymentDate).format("MMMM YYYY")
    : "";

  const endBalance = lastPayment?.balance ?? 0;

  if (lastPayment === undefined) {
    return (
      <span className="text-nowrap text-sm">
        Add Debts to calculate debt free date
      </span>
    );
  } else if (neverDebtFree) {
    return (
      <span className="text-nowrap text-sm">
        Debt at {endDate}:{" "}
        <span className="text-red-500 font-bold">
          {formatCurrency(endBalance)}
        </span>
      </span>
    );
  }
  return (
    <span className="text-nowrap text-sm">
      Debt Free By&nbsp;
      {dayjs(endDate).format("MMMM YYYY")}
    </span>
  );
}

export function getSummaryStatistics(
  snowballResultsWithExtra: Results | undefined,
  snowballResultsWithoutExtra: Results | undefined,
  avalancheResultsWithExtra: Results | undefined
) {
  let betterMethod = "";
  let selectedMethod;
  let endDate;
  let totalInterestPaid;
  let minPayment = 0;
  let totalInterestSaved = 0;
  let endBalance = 0;

  if (snowballResultsWithoutExtra === undefined) {
    return {
      betterMethod,
      endDate,
      totalInterestPaid,
      minPayment,
      totalInterestSaved,
      // endBalance,
    };
  } else if (
    snowballResultsWithExtra &&
    snowballResultsWithExtra?.totalInterestPaid &&
    avalancheResultsWithExtra &&
    avalancheResultsWithExtra?.totalInterestPaid
  ) {
    betterMethod =
      avalancheResultsWithExtra?.totalInterestPaid >
      snowballResultsWithExtra?.totalInterestPaid
        ? "Snowball"
        : "Avalanche";

    selectedMethod =
      avalancheResultsWithExtra?.totalInterestPaid >
      snowballResultsWithExtra?.totalInterestPaid
        ? snowballResultsWithExtra
        : avalancheResultsWithExtra;

    totalInterestPaid = selectedMethod?.totalInterestPaid;
    totalInterestSaved =
      snowballResultsWithExtra?.totalInterestPaid -
      selectedMethod?.totalInterestPaid;

    minPayment = selectedMethod?.payments?.[0]?.accounts?.reduce(
      (acc, payment) => acc + payment.minPayment,
      0
    );

    const lastPayment =
      selectedMethod?.["payments"]?.[selectedMethod?.["payments"].length - 1];
    endDate = lastPayment?.["accounts"]?.[0]?.paymentDate;

    endBalance = lastPayment?.balance;
  } else {
    totalInterestPaid = snowballResultsWithoutExtra?.totalInterestPaid;
    const lastPayment =
      snowballResultsWithoutExtra?.["payments"]?.[
        snowballResultsWithoutExtra?.["payments"].length - 1
      ];

    endDate = lastPayment?.["accounts"]?.[0]?.paymentDate;
    endBalance = lastPayment?.balance;
    minPayment = snowballResultsWithoutExtra?.payments?.[0]?.accounts?.reduce(
      (acc, payment) => acc + (payment.minPayment ?? 0),
      0
    );
  }

  const lastPaymentWithout =
    selectedMethod?.["payments"]?.[
      snowballResultsWithoutExtra?.["payments"].length - 1
    ];
  const endDateWithout = dayjs(
    lastPaymentWithout?.["accounts"]?.[0]?.paymentDate
  );

  const debtFreeBy = dayjs(endDate);
  const neverBecomesDebtFree = endBalance === undefined || endBalance > 0;
  const month = neverBecomesDebtFree ? "Never" : debtFreeBy.format("MMMM");
  const year = neverBecomesDebtFree ? "" : debtFreeBy.format("YYYY");

  // console.log("-- TIME SAVED STUFF --");
  const timeSavedYears = endDateWithout.diff(debtFreeBy, "years");
  // console.log("time saved years");
  // console.log(timeSavedYears);
  // console.log("time saved months");
  // console.log(endDateWithout.diff(debtFreeBy, "months"));
  const timeSavedString = `${
    timeSavedYears * -1 > 0 ? `${timeSavedYears * -1} years, ` : ""
  }${endDateWithout.diff(debtFreeBy, "months") * -1} months`;
  // console.log(timeSavedString);

  const monthsFaster =
    endDateWithout.diff(debtFreeBy, "years") * -12 +
    endDateWithout.diff(debtFreeBy, "months") * -1;

  // const timeSavedString = `${
  //   monthsFaster > 12 ? `${(monthsFaster / 12).toFixed(0)} years, ` : ""
  // }${monthsFaster > 12 ? monthsFaster % 12 : monthsFaster} months`;
  // console.log(timeSavedString);

  return {
    betterMethod,
    endDate,
    selectedMethod,
    totalInterestPaid,
    minPayment,
    totalInterestSaved,
    endBalance,
    neverBecomesDebtFree,
    debtFreeMonthYear: `${month} ${year}`,
    timeSavedString,
    monthsFaster,
  };
}
