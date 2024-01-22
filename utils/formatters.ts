export function formatCurrency(value?: number | string | null) {
  if (!value) {
    return "";
  }

  const valueAsNumber = typeof value === "string" ? parseFloat(value.replaceAll(",", "")) : value;

  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valueAsNumber);
}

export function formatPercent(value?: number | string | null) {
  if (!value) {
    return "";
  }

  const valueAsNumber = typeof value === "string" ? parseFloat(value) : value;
  return (
    Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valueAsNumber) + "%"
  );
}

export const formatMonthName = (monthNumber: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (monthNumber >= 1 && monthNumber <= 12) {
    return months[monthNumber - 1];
  }
  if (monthNumber === 0) return "December";
  return "Invalid month number";
};

export const formatNumberToKFormat = (value: number): string => {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
};