import { useState } from "react";
import { StyledTab, StyledTabs } from "../../budget/components/StyledTabs";

interface Props {
  tabIndex: number;
  setTabIndex: Function;
  setTab: Function;
  setSubTab: Function;
  Component: JSX.Element;
}
export default function BaseWrapper({
  setSubTab,
  tabIndex,
  setTabIndex,
  Component,
}: Props) {
  return (
    <>
      <StyledTabs
        value={tabIndex}
        onChange={(e, v) => {
          setTabIndex(v);
          if (v === 0) {
            setSubTab("PLANNER_STEP");
          }
          if (v === 1) {
            console.log(tabIndex);
            setSubTab("EDIT_STEP");
          }
        }}
      >
        <StyledTab label="Planner" />
        <StyledTab label="Edit" />
      </StyledTabs>
      {Component}
    </>
  );
}
