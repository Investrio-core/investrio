import * as React from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{
      children: (
        <span className="MuiTabs-indicatorSpan flex justify-space-around" />
      ),
    }}
  />
))({
  "& .MuiTabs-flexContainer": {
    justifyContent: "space-around",
  },
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

interface StyledTabProps {
  label: string;
}
// text-black text-[10px] font-semibold font-['Poppins'] uppercase tracking-tight
export const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  //   marginRight: theme.spacing(1),
  color: "black",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "-0.025em",
  "&.Mui-selected": {
    color: "black",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "-0.025em",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));
