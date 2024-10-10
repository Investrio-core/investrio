import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
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
  Coins,
  FileText,
  BarChart2,
  Download,
  CheckCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  overflow: "hidden",
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: `linear-gradient(to right, #8833FF, #5E00FF)`,
  color: "white",
  "& .MuiCardHeader-avatar": {
    marginRight: theme.spacing(2),
  },
  "& .MuiCardHeader-action": {
    alignSelf: "center",
    marginTop: 0,
    marginRight: 0,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "& .MuiTableHead-root": {
    "& .MuiTableCell-head": {
      backgroundColor: theme.palette.grey[100],
      fontWeight: "bold",
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      "&:hover": {
        backgroundColor: theme.palette.grey[50],
      },
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  "& .MuiChip-icon": {
    color: "inherit",
  },
  padding: "4px 8px",
  // display: "flex",
  // alignItems: "center",
  // justifyContent: "center",
  "& .MuiChip-label": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    position: "relative",
    top: "2px",
  },
}));

// Bank logos table (mock data)
const bankLogos = {
  "Bank of America": "/images/banks/Bank of America.jpg",
  "Wells Fargo": "https://example.com/wellsfargo-logo.png",
  Chase: "/images/banks/Chase.jpg",
  Citibank: "https://example.com/citi-logo.png",
  HSBC: "https://example.com/hsbc-logo.png",
  Barclays: "https://example.com/barclays-logo.png",
  "Deutsche Bank": "https://example.com/deutschebank-logo.png",
  "BNP Paribas": "https://example.com/bnpparibas-logo.png",
  // Add more banks as needed
};

// Icon map for account types
const typeIcons = (key: string, color = "black") => {
  const icons = {
    investment: <TrendingUp size={16} color={color} />,
    credit: <CreditCard size={16} color={color} />,
    depository: <Landmark size={16} color={color} />,
    loan: <FileText size={16} color={color} />,
    brokerage: <BarChart2 size={16} color={color} />,
    other: <Inbox size={16} color={color} />,
  };
  return icons[key];
};

// Icon map for account subtypes
const subtypeIcons = {
  "401a": <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "401k": <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "403B": <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "457b": <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  529: <GraduationCap size={16} className="min-h-[16px] min-w-[16px]" />,
  auto: <Car size={16} className="min-h-[16px] min-w-[16px]" />,
  brokerage: <TrendingUp size={16} className="min-h-[16px] min-w-[16px]" />,
  business: <Building size={16} className="min-h-[16px] min-w-[16px]" />,
  "cash isa": <PiggyBank size={16} className="min-h-[16px] min-w-[16px]" />,
  "cash management": (
    <DollarSign size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  cd: <Landmark size={16} className="min-h-[16px] min-w-[16px]" />,
  checking: <Wallet size={16} className="min-h-[16px] min-w-[16px]" />,
  commercial: <Building size={16} className="min-h-[16px] min-w-[16px]" />,
  construction: <Home size={16} className="min-h-[16px] min-w-[16px]" />,
  consumer: <ShoppingBag size={16} className="min-h-[16px] min-w-[16px]" />,
  "credit card": <CreditCard size={16} className="min-h-[16px] min-w-[16px]" />,
  "crypto exchange": <Zap size={16} className="min-h-[16px] min-w-[16px]" />,
  ebt: <CreditCard size={16} className="min-h-[16px] min-w-[16px]" />,
  "education savings account": (
    <GraduationCap size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  "fixed annuity": <Landmark size={16} className="min-h-[16px] min-w-[16px]" />,
  gic: <Landmark size={16} className="min-h-[16px] min-w-[16px]" />,
  "health reimbursement arrangement": (
    <Heart size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  "home equity": <Home size={16} className="min-h-[16px] min-w-[16px]" />,
  hsa: <Heart size={16} className="min-h-[16px] min-w-[16px]" />,
  isa: <PiggyBank size={16} className="min-h-[16px] min-w-[16px]" />,
  ira: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  keogh: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  lif: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "life insurance": <Shield size={16} className="min-h-[16px] min-w-[16px]" />,
  "line of credit": (
    <CreditCard size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  lira: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  loan: <DollarSign size={16} className="min-h-[16px] min-w-[16px]" />,
  lrif: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  lrsp: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "money market": (
    <TrendingUp size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  mortgage: <Home size={16} className="min-h-[16px] min-w-[16px]" />,
  "mutual fund": <TrendingUp size={16} className="min-h-[16px] min-w-[16px]" />,
  "non-custodial wallet": (
    <Wallet size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  "non-taxable brokerage account": (
    <TrendingUp size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  other: <Inbox size={16} className="min-h-[16px] min-w-[16px]" />,
  "other insurance": <Shield size={16} className="min-h-[16px] min-w-[16px]" />,
  "other annuity": <Landmark size={16} className="min-h-[16px] min-w-[16px]" />,
  overdraft: <Activity size={16} className="min-h-[16px] min-w-[16px]" />,
  paypal: <CreditCard size={16} className="min-h-[16px] min-w-[16px]" />,
  payroll: <DollarSign size={16} className="min-h-[16px] min-w-[16px]" />,
  pension: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  prepaid: <CreditCard size={16} className="min-h-[16px] min-w-[16px]" />,
  prif: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "profit sharing plan": (
    <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  rdsp: <Heart size={16} className="min-h-[16px] min-w-[16px]" />,
  resp: <GraduationCap size={16} className="min-h-[16px] min-w-[16px]" />,
  retirement: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  rlif: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  roth: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "roth 401k": <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  rrif: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  rrsp: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  sarsep: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  savings: <PiggyBank size={16} className="min-h-[16px] min-w-[16px]" />,
  "sep ira": <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "simple ira": <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  sipp: <Briefcase size={16} className="min-h-[16px] min-w-[16px]" />,
  "stock plan": <TrendingUp size={16} className="min-h-[16px] min-w-[16px]" />,
  student: <GraduationCap size={16} className="min-h-[16px] min-w-[16px]" />,
  "thrift savings plan": (
    <PiggyBank size={16} className="min-h-[16px] min-w-[16px]" />
  ),
  tfsa: <PiggyBank size={16} className="min-h-[16px] min-w-[16px]" />,
  trust: <Shield size={16} className="min-h-[16px] min-w-[16px]" />,
  ugma: <Gift size={16} className="min-h-[16px] min-w-[16px]" />,
  utma: <Gift size={16} className="min-h-[16px] min-w-[16px]" />,
  "variable annuity": (
    <Landmark size={16} className="min-h-[16px] min-w-[16px]" />
  ),
};
// Mock data for connected accounts
const connectedAccounts = [
  {
    institutionName: "Chase",
    accounts: [
      {
        id: "XWZWBKrpVmiVll4E6e9EU8qmpjvX1Nf1ro56Q",
        name: "Plaid Checking",
        type: "depository",
        subtype: "checking",
        imported: true,
      },
      {
        id: "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPp1234",
        name: "Savings Account",
        type: "depository",
        subtype: "savings",
        imported: false,
      },
    ],
  },
  {
    institutionName: "Bank of America",
    accounts: [
      {
        id: "QqRrSsTtUuVvWwXxYyZz9876543210AbCd",
        name: "Credit Card",
        type: "credit",
        subtype: "credit card",
        imported: true,
      },
      {
        id: "ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKk5678",
        name: "401k Plan",
        type: "investment",
        subtype: "401k",
        imported: false,
      },
    ],
  },
  // Add more institutions and accounts as needed
];

const typeColors = {
  investment: { bg: "#e8f5e9", text: "#1b5e20" },
  credit: { bg: "#ffebee", text: "#b71c1c" },
  depository: { bg: "#e3f2fd", text: "#0d47a1" },
  loan: { bg: "#fff3e0", text: "#e65100" },
  brokerage: { bg: "#f3e5f5", text: "#4a148c" },
  other: { bg: "#f5f5f5", text: "#212121" },
};

export interface ConnectedAccounts {
  institutionName: string;
  accounts: {
    id: string;
    name: string;
    type: string;
    subtype: string;
    imported: boolean;
  }[];
}

interface Props {
  connectedAccounts: {
    institutionName: string;
    accounts: {
      id: string;
      name: string;
      type: string;
      subtype: string;
      imported: boolean;
    }[];
  }[];
}

export default function Component({ connectedAccounts }: Props) {
  const [expandedBanks, setExpandedBanks] = useState<{
    [key: string]: boolean;
  }>({});

  const handleExpandClick = (institutionName: string) => {
    setExpandedBanks((prev) => ({
      ...prev,
      [institutionName]: !prev[institutionName],
    }));
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 8px" }}>
      {connectedAccounts.map((institution) => (
        <StyledCard key={institution.institutionName}>
          <StyledCardHeader
            avatar={
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                }}
              >
                <Image
                  src={
                    bankLogos[
                      institution.institutionName as keyof typeof bankLogos
                    ] || "/placeholder.svg"
                  }
                  alt={`${institution.institutionName} logo`}
                  width={32}
                  height={32}
                  style={{ objectFit: "contain" }}
                />
              </Box>
            }
            action={
              <IconButton
                onClick={() => handleExpandClick(institution.institutionName)}
                sx={{ color: "white" }}
              >
                {expandedBanks[institution.institutionName] ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </IconButton>
            }
            title={
              <Typography variant="h6">
                {institution.institutionName}
              </Typography>
            }
          />
          <Collapse in={expandedBanks[institution.institutionName]}>
            <CardContent sx={{ padding: 0 }}>
              <StyledTableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Account Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Subtype</TableCell>
                      <TableCell align="right">Import</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {institution.accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {subtypeIcons[
                              account.subtype as keyof typeof subtypeIcons
                            ] || <Inbox size={16} />}
                            <span>{account.name}</span>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            icon={typeIcons(
                              account.type,
                              typeColors[
                                account.type as keyof typeof typeColors
                              ].text
                            )}
                            label={account.type.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: typeColors[account.type].bg,
                              color:
                                typeColors[
                                  account.type as keyof typeof typeColors
                                ].text,
                              "& .MuiChip-icon": {
                                color:
                                  typeColors[
                                    account.type as keyof typeof typeColors
                                  ].text,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <StyledChip
                            icon={
                              subtypeIcons[
                                account.subtype as keyof typeof subtypeIcons
                              ]
                            }
                            label={account.subtype.toUpperCase()}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {account.imported ? (
                            <IconButton disabled>
                              <CheckCircle
                                sx={{ color: "#4caf50", width: 16, height: 16 }}
                              />
                            </IconButton>
                          ) : (
                            <IconButton>
                              <Download sx={{ width: 16, height: 16 }} />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </CardContent>
          </Collapse>
        </StyledCard>
      ))}
    </Box>
  );
}
