import { Results } from "@/app/hooks/calculatorsSnowball";

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
    };
  } else if (
    snowballResultsWithExtra &&
    snowballResultsWithExtra?.totalInterestPaid &&
    avalancheResultsWithExtra &&
    avalancheResultsWithExtra?.totalInterestPaid
  ) {
    // console.log("-- avalanche pays more interest than snowball");
    // console.log(
    //   avalancheResultsWithExtra?.totalInterestPaid >
    //     snowballResultsWithExtra?.totalInterestPaid
    // );
    // console.log(avalancheResultsWithExtra?.totalInterestPaid);
    // console.log(snowballResultsWithExtra?.totalInterestPaid);

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
      selectedMethod?.totalInterestPaid -
      snowballResultsWithExtra?.totalInterestPaid;
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

  return {
    betterMethod,
    endDate,
    selectedMethod,
    totalInterestPaid,
    minPayment,
    totalInterestSaved,
    endBalance,
  };
}
