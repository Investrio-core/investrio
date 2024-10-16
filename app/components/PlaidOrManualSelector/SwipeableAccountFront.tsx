import React from "react";
// import { subtypeIcons } from "./RenderPlaidLinksTable";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  styled,
} from "@mui/material";

import {
  Wallet,
  CreditCard,
  Briefcase,
  GraduationCap,
  Car,
  Building,
  PiggyBank,
  Heart,
  Home,
  DollarSign,
  Smartphone,
  Gift,
  Landmark,
  TrendingUp,
  ShoppingBag,
  Coffee,
  Zap,
  Activity,
  Shield,
  Inbox,
} from "lucide-react";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 350,
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  //   background: "linear-gradient(135deg, #00b9ff 0%, #00d1c4 100%)",
  //   background: "linear-gradient(135deg, #8833ff 0%,  #00d1c4 100%)",
  background: "linear-gradient(135deg, #00d1c4 0%,   #8833ff 100%)",
  color: "white",
  overflow: "visible",
  position: "relative",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 14,
  right: 20,
  width: 60,
  height: 60,
  borderRadius: "50%",
  backgroundColor: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
}));

const AccountName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: "1.5rem",
  marginBottom: theme.spacing(2),
}));

const AccountBalance = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 700,
  fontSize: "2rem",
  marginBottom: theme.spacing(1),
}));

const AccountNumber = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto Mono', monospace",
  fontSize: "0.9rem",
  opacity: 0.8,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  fontWeight: 500,
  marginTop: theme.spacing(2),
}));

// Icon map for account subtypes
// const subtypeIcons = {
//   checking: <Wallet size={32} color="#00b9ff" />,
//   savings: <PiggyBank size={32} color="#00b9ff" />,
//   credit: <CreditCard size={32} color="#00b9ff" />,
//   investment: <TrendingUp size={32} color="#00b9ff" />,
//   loan: <DollarSign size={32} color="#00b9ff" />,
//   mortgage: <Home size={32} color="#00b9ff" />,
//   brokerage: <Briefcase size={32} color="#00b9ff" />,
//   default: <Inbox size={32} color="#00b9ff" />,
// };
export const subtypeIcons = (category: string) => {
  const icons = {
    "401a": <Briefcase size={32} color="#00b9ff" />,
    "401k": <Briefcase size={32} color="#00b9ff" />,
    "403B": <Briefcase size={32} color="#00b9ff" />,
    "457b": <Briefcase size={32} color="#00b9ff" />,
    529: <GraduationCap size={32} color="#00b9ff" />,
    auto: <Car size={32} color="#00b9ff" />,
    brokerage: <TrendingUp size={32} color="#00b9ff" />,
    business: <Building size={32} color="#00b9ff" />,
    "cash isa": <PiggyBank size={32} color="#00b9ff" />,
    "cash management": <DollarSign size={32} color="#00b9ff" />,
    cd: <Landmark size={32} color="#00b9ff" />,
    checking: <Wallet size={32} color="#00b9ff" />,
    commercial: <Building size={32} color="#00b9ff" />,
    construction: <Home size={32} color="#00b9ff" />,
    consumer: <ShoppingBag size={32} color="#00b9ff" />,
    "credit card": <CreditCard size={32} color="#00b9ff" />,
    "crypto exchange": <Zap size={32} color="#00b9ff" />,
    ebt: <CreditCard size={32} color="#00b9ff" />,
    "education savings account": <GraduationCap size={32} color="#00b9ff" />,
    "fixed annuity": <Landmark size={32} color="#00b9ff" />,
    gic: <Landmark size={32} color="#00b9ff" />,
    "health reimbursement arrangement": <Heart size={32} color="#00b9ff" />,
    "home equity": <Home size={32} color="#00b9ff" />,
    hsa: <Heart size={32} color="#00b9ff" />,
    isa: <PiggyBank size={32} color="#00b9ff" />,
    ira: <Briefcase size={32} color="#00b9ff" />,
    keogh: <Briefcase size={32} color="#00b9ff" />,
    lif: <Briefcase size={32} color="#00b9ff" />,
    "life insurance": <Shield size={32} color="#00b9ff" />,
    "line of credit": <CreditCard size={32} color="#00b9ff" />,
    lira: <Briefcase size={32} color="#00b9ff" />,
    loan: <DollarSign size={32} color="#00b9ff" />,
    lrif: <Briefcase size={32} color="#00b9ff" />,
    lrsp: <Briefcase size={32} color="#00b9ff" />,
    "money market": <TrendingUp size={32} color="#00b9ff" />,
    mortgage: <Home size={32} color="#00b9ff" />,
    "mutual fund": <TrendingUp size={32} color="#00b9ff" />,
    "non-custodial wallet": <Wallet size={32} color="#00b9ff" />,
    "non-taxable brokerage account": <TrendingUp size={32} color="#00b9ff" />,
    other: <Inbox size={32} color="#00b9ff" />,
    "other insurance": <Shield size={32} color="#00b9ff" />,
    "other annuity": <Landmark size={32} color="#00b9ff" />,
    overdraft: <Activity size={32} color="#00b9ff" />,
    paypal: <CreditCard size={32} color="#00b9ff" />,
    payroll: <DollarSign size={32} color="#00b9ff" />,
    pension: <Briefcase size={32} color="#00b9ff" />,
    prepaid: <CreditCard size={32} color="#00b9ff" />,
    prif: <Briefcase size={32} color="#00b9ff" />,
    "profit sharing plan": <Briefcase size={32} color="#00b9ff" />,
    rdsp: <Heart size={32} color="#00b9ff" />,
    resp: <GraduationCap size={32} color="#00b9ff" />,
    retirement: <Briefcase size={32} color="#00b9ff" />,
    rlif: <Briefcase size={32} color="#00b9ff" />,
    roth: <Briefcase size={32} color="#00b9ff" />,
    "roth 401k": <Briefcase size={32} color="#00b9ff" />,
    rrif: <Briefcase size={32} color="#00b9ff" />,
    rrsp: <Briefcase size={32} color="#00b9ff" />,
    sarsep: <Briefcase size={32} color="#00b9ff" />,
    savings: <PiggyBank size={32} color="#00b9ff" />,
    "sep ira": <Briefcase size={32} color="#00b9ff" />,
    "simple ira": <Briefcase size={32} color="#00b9ff" />,
    sipp: <Briefcase size={32} color="#00b9ff" />,
    "stock plan": <TrendingUp size={32} color="#00b9ff" />,
    student: <GraduationCap size={32} color="#00b9ff" />,
    "thrift savings plan": <PiggyBank size={32} color="#00b9ff" />,
    tfsa: <PiggyBank size={32} color="#00b9ff" />,
    trust: <Shield size={32} color="#00b9ff" />,
    ugma: <Gift size={32} color="#00b9ff" />,
    utma: <Gift size={32} color="#00b9ff" />,
    "variable annuity": <Landmark size={32} color="#00b9ff" />,
  };

  return (
    icons[category as keyof typeof icons] || <Inbox size={32} color="#00b9ff" />
  );
};

interface AccountProps {
  name: string;
  type: string;
  category: string;
  subtype: string;
  balance: number;
  currency: string;
  plaidAccountId: string;
  tags?: string[];
  //   currentBalance?: number;
  //   availableBalance?: number;
}

export default function SwipeableAccountFront({
  name,
  type,
  category,
  subtype,
  balance,
  currency,
  plaidAccountId,
  tags,
}: //   availableBalance,
//   currentBalance,
AccountProps) {
  console.log(balance);
  //   console.log("available");
  //   console.log(availableBalance);
  //   console.log("current");
  //   console.log(currentBalance);

  const formatBalance = (amount: number, curr: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      currency: curr,
    }).format(amount);
  };

  const getSubtypeIcon = (category: string) => {
    return subtypeIcons(category);
  };

  return (
    <StyledCard>
      <CardContent sx={{ pt: 12, pb: 3 }}>
        <IconWrapper>{getSubtypeIcon(category)}</IconWrapper>
        <AccountName variant="h5" gutterBottom>
          {name}
        </AccountName>
        <AccountBalance variant="h4">
          {balance
            ? `$ ${formatBalance(balance, currency)}`
            : `$ ••••••••.••••`}
        </AccountBalance>
        <AccountNumber variant="body2">
          •••• {plaidAccountId?.slice(-4)}
        </AccountNumber>
        <StyledChip label={type.toUpperCase()} size="small" />
      </CardContent>
    </StyledCard>
  );
}
