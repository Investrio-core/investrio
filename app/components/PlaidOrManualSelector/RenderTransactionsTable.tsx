import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  styled,
  useTheme,
  ThemeProvider,
  createTheme,
  Chip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Coffee,
  Plane,
  ShoppingBag,
  Utensils,
  DollarSign,
} from "lucide-react";

interface PlaidTransaction {
  plaidTransactionId: string;
  category: string;
  subcategory: string;
  type: string;
  name: string;
  amount: number;
  isoCurrencyCode: string;
  date: string;
  year: number;
  month: number;
  pending: boolean;
  categoryUrl?: string;
}

const StyledContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  maxWidth: 800,
  margin: "0 auto",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const StyledTransaction = styled(motion.div)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(136, 51, 255, 0.1)"
      : "rgba(136, 51, 255, 0.05)",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(136, 51, 255, 0.2)"
        : "rgba(136, 51, 255, 0.1)",
  },
}));

const StyledAmountChip = styled(Chip)<{ amount: number }>(
  ({ theme, amount }) => ({
    fontWeight: 700,
    position: "relative",
    left: "9px",
    // top: "-9px",
    color: "black",
    // color: theme.palette.getContrastText(
    //   amount < 0 ? theme.palette.error.light : theme.palette.success.light
    // ),
    color: amount > 0 ? "green" : "darkred",
    backgroundColor: amount > 0 ? "lightgreen" : "salmon", //"transparent",
    border: `4px solid ${amount > 0 ? "lightgreen" : "salmon"}`,
  })
);

const StyledIconPlaceholder = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(136, 51, 255, 0.2)"
      : "rgba(136, 51, 255, 0.1)",
  marginRight: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const categoryIcons: { [key: string]: React.ReactNode } = {
  "Food and Drink": <Utensils size={20} />,
  Travel: <Plane size={20} />,
  Shops: <ShoppingBag size={20} />,
  Transfer: <DollarSign size={20} />,
  Recreation: <Coffee size={20} />,
};

// Mock data for demonstration
const mockTransactions: PlaidTransaction[] = [
  {
    plaidTransactionId: "1",
    category: "Food and Drink",
    subcategory: "Restaurants",
    type: "place",
    name: "Starbucks",
    amount: -4.5,
    isoCurrencyCode: "USD",
    date: "2023-05-15",
    year: 2023,
    month: 5,
    pending: false,
    categoryUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    plaidTransactionId: "2",
    category: "Travel",
    subcategory: "Airlines",
    type: "special",
    name: "United Airlines",
    amount: -350.0,
    isoCurrencyCode: "USD",
    date: "2023-05-10",
    year: 2023,
    month: 5,
    pending: true,
    categoryUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    plaidTransactionId: "3",
    category: "Transfer",
    subcategory: "Deposit",
    type: "special",
    name: "Payroll Deposit",
    amount: 1500.0,
    isoCurrencyCode: "USD",
    date: "2023-05-01",
    year: 2023,
    month: 5,
    pending: false,
    categoryUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    plaidTransactionId: "4",
    category: "Shops",
    subcategory: "Clothing",
    type: "place",
    name: "Nike Store",
    amount: -89.99,
    isoCurrencyCode: "USD",
    date: "2023-04-28",
    year: 2023,
    month: 4,
    pending: false,
    categoryUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    plaidTransactionId: "5",
    category: "Food and Drink",
    subcategory: "Groceries",
    type: "place",
    name: "Whole Foods",
    amount: -65.32,
    isoCurrencyCode: "USD",
    date: "2023-04-25",
    year: 2023,
    month: 4,
    pending: false,
    categoryUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    plaidTransactionId: "6",
    category: "Recreation",
    subcategory: "Gym",
    type: "place",
    name: "LA Fitness",
    amount: -49.99,
    isoCurrencyCode: "USD",
    date: "2023-04-20",
    year: 2023,
    month: 4,
    pending: false,
    categoryUrl: "/placeholder.svg?height=40&width=40",
  },
];

interface Props {
  transactions: PlaidTransaction[];
}

export default function TransactionTable({ transactions }: Props) {
  const [darkMode, setDarkMode] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const customTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#8833ff",
          },
          secondary: {
            main: "#511e99",
          },
          background: {
            default: darkMode ? "#352068" : "#f5f5f5",
            paper: darkMode ? "#352068" : "#ffffff",
          },
        },
      }),
    [darkMode]
  );

  const useTransactions = transactions
    ? reshapeTransactionsForDb(transactions)
    : mockTransactions;

  const displayedTransactions = showAll
    ? useTransactions
    : useTransactions.slice(0, 5);

  return (
    <ThemeProvider theme={customTheme}>
      <StyledContainer>
        <StyledHeader>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{
              color: darkMode ? "white" : "#8833ff",
              fontWeight: 700,
              position: "relative",
              top: "10px",
              left: "25px",
              width: "100%",
            }}
          >
            Transactions
          </Typography>
        </StyledHeader>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            right: "25px",
            top: "25px",
          }}
        >
          <Sun size={20} />
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="primary"
          />
          <Moon size={20} />
        </Box>
        <AnimatePresence>
          {displayedTransactions.map((transaction: PlaidTransaction) => (
            <StyledTransaction
              key={transaction.plaidTransactionId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StyledIconPlaceholder>
                  {categoryIcons[transaction.category] || (
                    <ShoppingBag size={20} />
                  )}
                </StyledIconPlaceholder>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color={darkMode ? "white" : "black"}
                  >
                    {transaction.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <StyledAmountChip
                  amount={transaction.amount}
                  label={`${
                    transaction.amount < 0 ? "-" : "+"
                  } ${new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: transaction.isoCurrencyCode,
                  }).format(Math.abs(transaction.amount))}`}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "end",
                    justifyContent: "flex-end",
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {transaction.category} • {transaction.subcategory}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    {transaction.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.subcategory}
                  </Typography> */}

                  {/* {transaction.categoryUrl && (
                    <Box
                      component="img"
                      src={transaction.categoryUrl}
                      alt={transaction.category}
                      sx={{ width: 20, height: 20, ml: 1, borderRadius: "50%" }}
                    />
                  )} */}
                </Box>
              </Box>
            </StyledTransaction>
          ))}
        </AnimatePresence>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowAll(!showAll)}
            startIcon={showAll ? <ChevronUp /> : <ChevronDown />}
          >
            {showAll ? "Show Less" : "See All"}
          </Button>
        </Box>
      </StyledContainer>
    </ThemeProvider>
  );
}

const reshapeTransactionsForDb = (
  transactions,
  userId?: string,
  linkId?: string
) => {
  return transactions?.map((transaction: Transaction) => {
    const {
      account_id: plaidAccountId,
      transaction_id: plaidTransactionId,
      category_id: plaidCategoryId,
      category: categories,
      transaction_type: transactionType,
      name: transactionName,
      amount,
      iso_currency_code: isoCurrencyCode,
      unofficial_currency_code: unofficialCurrencyCode,
      authorized_date: authorizedDate,
      date: transactionDate,
      pending,
      account_owner: accountOwner,
      logo_url: logoUrl,
      personal_finance_category_icon_url: categoryUrl,
      personal_finance_category: personalFinanceCategory,
      website,
      //   merchant_name: merchantName,
      // payment_channel: paymentChannel // e.g. in_store
    } = transaction;

    const [category, subcategory] = categories || ["", ""];

    const { primary: primaryCategory, detailed: subCategory } =
      personalFinanceCategory ?? { primaryCategory: "", detailed: "" };

    const date = authorizedDate
      ? new Date(authorizedDate)
      : new Date(transactionDate);
    const year = date?.getFullYear();
    const month = date?.getMonth();

    const transactionRow = {
      plaidTransactionId,
      // original categorization:
      category: category,
      subcategory: subcategory,
      // newer improved categorization:
      type: primaryCategory ?? "",
      subtype: subCategory ?? "",
      name: transactionName,
      amount: amount * -1,
      isoCurrencyCode,
      unofficialCurrencyCode,
      date: date,
      year,
      month,
      pending,
      accountId: plaidAccountId,

      // to add:
      logoUrl: logoUrl ?? "",
      categoryUrl: categoryUrl ?? "",
      //   website,
      //   accountCategory = "PERSONAL" || "BUSINESS" || "MIXED" - set in next stage...,
      userId,
      itemId: linkId,
    };

    return transactionRow;
  });
};
