"use client";

import { useTabContext } from "@/app/context/TabContext/context";
import { motion } from "framer-motion";
import { GrOptimize } from "react-icons/gr";
import { TbChecklist } from "react-icons/tb";
import { AiOutlinePieChart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoAdd } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import { FaRegLightbulb } from "react-icons/fa";
import { GiExpense } from "react-icons/gi";
import { FaHandHoldingDollar } from "react-icons/fa6";
import BudgetIcon from "@/public/icons/budget.svg";
import InvestmentSvg from "@/public/icons/wealth-icon.svg";
import { MdOutlineDashboard } from "react-icons/md";
import {
  BUDGET_PAGE,
  DEBTS_PAGE,
  HOME_DASHBOARD_PAGE,
  WEALTH_PAGE,
} from "@/app/utils/constants";
// import { PLANNER_STEP } from "@/app/dashboard/debts/components/DebtTool";

//debt
export const DEBT_SUMMARY = "summary";
export const ADD_DEBT = "add";
export const SUGGESTIONS = "suggestions";
export const PRIORITIES = "priorities";
export const PLANNER_STEP = "PLANNER_STEP";
export const DEBT_STEPS = [DEBT_SUMMARY, ADD_DEBT, SUGGESTIONS, PRIORITIES];

//budget
export const INCOME_STEP = "income";
export const BREAKDOWN_STEP = "suggestedBreakdown";
export const BUDGET_STEP = "budget";
export const BUDGET_STEPS = [INCOME_STEP, BREAKDOWN_STEP, BUDGET_STEP];

const HomeSvg = ({ fill = "none" }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={fill}
  >
    <path
      d="M20.5092 10.2111L13.0086 3.39216C12.733 3.13989 12.373 2.99997 11.9995 3C11.6259 3.00003 11.2659 3.13999 10.9905 3.3923L3.4911 10.2111C3.33659 10.3518 3.21313 10.5232 3.12858 10.7143C3.04404 10.9054 3.00028 11.112 3.0001 11.321V19.9549C2.9958 20.3319 3.12953 20.6974 3.3761 20.9826C3.51657 21.1423 3.68954 21.27 3.88342 21.3574C4.07731 21.4448 4.28763 21.4897 4.50029 21.4892H8.9968C9.19572 21.4892 9.38648 21.4101 9.52713 21.2695C9.66779 21.1288 9.7468 20.9381 9.7468 20.7392V16.2385C9.7468 16.0396 9.82582 15.8488 9.96647 15.7081C10.1071 15.5675 10.2979 15.4885 10.4968 15.4885H13.4968C13.6957 15.4885 13.8865 15.5675 14.0271 15.7081C14.1678 15.8488 14.2468 16.0396 14.2468 16.2385V20.7392C14.2468 20.9381 14.3258 21.1288 14.4665 21.2695C14.6071 21.4101 14.7979 21.4892 14.9968 21.4892H19.5022C19.7486 21.4924 19.9918 21.4325 20.2085 21.3152C20.4477 21.186 20.6476 20.9946 20.7869 20.7612C20.9263 20.5278 20.9999 20.261 21.0001 19.9892V11.321C20.9999 11.1121 20.9561 10.9055 20.8716 10.7144C20.7871 10.5233 20.6637 10.3519 20.5092 10.2111Z"
      fill="#1F2C37"
    />
  </svg>
);

export const DebtSvg = ({ fill = "none" }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill={fill}
  >
    <path
      d="M12.5 12V3"
      stroke="#9CA4AB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20.294 7.5L4.70557 16.5"
      stroke="#9CA4AB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.65008 13.6454C3.26041 11.5366 3.63532 9.35796 4.70749 7.50072C5.77966 5.64348 7.47883 4.22933 9.49988 3.51221V10.268L3.65008 13.6454Z"
      stroke="#9CA4AB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.5002 3C14.077 3.00029 15.6261 3.41485 16.9923 4.20216C18.3585 4.98947 19.4938 6.1219 20.2847 7.48605C21.0755 8.8502 21.4941 10.3982 21.4985 11.975C21.5029 13.5518 21.0929 15.1021 20.3097 16.4706C19.5264 17.8391 18.3973 18.9779 17.0355 19.7728C15.6737 20.5676 14.127 20.9908 12.5502 20.9999C10.9734 21.0089 9.42191 20.6035 8.05108 19.8243C6.68024 19.0451 5.53818 17.9194 4.73926 16.56"
      stroke="#9CA4AB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const BudgetSvg = ({ fill = "none" }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill={fill}
  >
    <path
      d="M4.5 6V18C4.5 18.3978 4.65804 18.7794 4.93934 19.0607C5.22064 19.342 5.60218 19.5 6 19.5H21C21.1989 19.5 21.3897 19.421 21.5303 19.2803C21.671 19.1397 21.75 18.9489 21.75 18.75V8.25C21.75 8.05109 21.671 7.86032 21.5303 7.71967C21.3897 7.57902 21.1989 7.5 21 7.5H6C5.60218 7.5 5.22064 7.34196 4.93934 7.06066C4.65804 6.77936 4.5 6.39782 4.5 6ZM4.5 6C4.5 5.60218 4.65804 5.22064 4.93934 4.93934C5.22064 4.65804 5.60218 4.5 6 4.5H18.75"
      stroke="#9CA4AB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M18 13.5C18 13.7071 17.8321 13.875 17.625 13.875C17.4179 13.875 17.25 13.7071 17.25 13.5C17.25 13.2929 17.4179 13.125 17.625 13.125C17.8321 13.125 18 13.2929 18 13.5Z"
      stroke="#9CA4AB"
      stroke-width="1.5"
    />
  </svg>
);

const ProfileSvg = ({ fill = "none" }: { fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={fill}
  >
    <path
      d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
      stroke="#9CA4AB"
      stroke-width="1.5"
      stroke-miterlimit="10"
    />
    <path
      d="M2.90527 20.2491C3.82736 18.6531 5.15322 17.3278 6.74966 16.4064C8.34611 15.485 10.1569 15 12.0002 15C13.8434 15 15.6542 15.4851 17.2506 16.4065C18.8471 17.3279 20.1729 18.6533 21.0949 20.2493"
      stroke="#9CA4AB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

// const InvestmentSvg = ({ fill = "none" }: { fill?: string }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="25"
//     height="24"
//     viewBox="0 0 25 24"
//     fill={fill}
//   >
//     <path
//       d="M4.375 19.5V12.75H9.625"
//       stroke="#9CA4AB"
//       stroke-width="1.5"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//     />
//     <path
//       d="M21.625 19.5H2.875"
//       stroke="#9CA4AB"
//       stroke-width="1.5"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//     />
//     <path
//       d="M9.625 19.5V8.25H14.875"
//       stroke="#9CA4AB"
//       stroke-width="1.5"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//     />
//     <path
//       d="M20.125 3.75H14.875V19.5H20.125V3.75Z"
//       stroke="#9CA4AB"
//       stroke-width="1.5"
//       stroke-linecap="round"
//       stroke-linejoin="round"
//     />
//   </svg>
// );

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const tabs = [
  {
    name: "Dashboard",
    route: HOME_DASHBOARD_PAGE,
    Icon: () => <MdOutlineDashboard className="relative top-[4px]" />, // HomeSvg
  },
  {
    name: "Budget",
    route: BUDGET_PAGE,
    defaultTab: BUDGET_STEP,
    Icon: () => <BudgetIcon className="relative left-[-4px] top-[-6px]" />, // BudgetSvg
    subTabs: [
      {
        name: "Income",
        subTab: INCOME_STEP,
        Icon: BsCashCoin,
      },
      {
        name: "Suggestions",
        subTab: BREAKDOWN_STEP,
        Icon: FaRegLightbulb,
      },
      {
        name: "Planner",
        subTab: BUDGET_STEP,
        Icon: GiExpense,
      },
      // { name: "Checklist", subTab: SUGGESTIONS, Icon: TbChecklist },
    ],
  },
  {
    name: "Debt",
    route: DEBTS_PAGE,
    defaultTab: PLANNER_STEP,
    Icon: () => (
      <FaHandHoldingDollar className="relative left-[4px] top-[2px]" />
    ), //DebtSvg,
    subTabs: [
      {
        name: "Summary",
        subTab: DEBT_SUMMARY,
        Icon: AiOutlinePieChart,
      },
      {
        name: "Add",
        subTab: ADD_DEBT,
        Icon: IoAdd,
      },
      {
        name: "Optimize",
        subTab: PRIORITIES,
        Icon: GrOptimize,
      },
      { name: "Checklist", subTab: SUGGESTIONS, Icon: TbChecklist },
    ],
  },
  {
    name: "Wealth",
    route: WEALTH_PAGE,
    Icon: InvestmentSvg,
    subTabs: [],
  },
  {
    name: "Profile",
    Icon: ProfileSvg,
    subTabs: [],
  },
];

export default function MobileNavigator() {
  const { setTabs, setSubTab, subTab, tab, state } = useTabContext();
  const [tabSelected, setTabSelected] = useState(false);
  const { push } = useRouter();
  const asPath = usePathname();

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.route === asPath);

    if (
      currentTab &&
      currentTab?.subTabs?.length !== undefined &&
      currentTab.subTabs?.length > 0
    ) {
      setTabs(currentTab.name, currentTab?.subTabs?.[0]?.subTab);
      setTabSelected(true);
    } else if (currentTab) {
      setTabs(currentTab.name, "");
    }
  }, [asPath]);

  const selectedTab = tabs.find((_tab) => {
    return _tab.name === tab;
  });
  const tabMatches = selectedTab?.["route"] === asPath;

  const BaseTabs = tabs.map(({ name, Icon, route, subTabs, defaultTab }) => {
    return (
      <div
        className={`${
          route === asPath
            ? "bg-violet-100 border border-primary rounded"
            : "bg-white"
        } px-[10px] py-[4px]`}
      >
        <motion.div
          animate={tab !== name}
          variants={innerTabsVariants}
          className={`flex-col items-center inline-flex`}
          onClick={() => {
            setTabs(name, defaultTab ?? "");
            setTabSelected(true);
            if (route) push(route);
          }}
        >
          <div className="w-6 h-6 relative">
            <Icon />
          </div>
          <div className="text-center text-gray-800 text-xs font-medium leading-tight tracking-tight">
            {name}
          </div>
        </motion.div>
      </div>
    );
  });
  return (
    <div className="bg-white w-[100vw] fixed bottom-[-1px] z-[1000] shadow-lg px-9 pt-1 pb-[0px] rounded-tl-[40px] rounded-tr-[40px] border border-zinc-200 justify-between items-start inline-flex">
      {BaseTabs}
    </div>
  );
  // return (
  //   <div className="bg-white w-[100vw] fixed bottom-[-1px] z-[9999] shadow-lg px-9 pt-1 pb-[0px] rounded-tl-[40px] rounded-tr-[40px] border border-zinc-200 justify-between items-start inline-flex">
  //     {tabSelected &&
  //     selectedTab?.subTabs?.length !== undefined &&
  //     selectedTab?.subTabs?.length > 0 ? (
  //       <>
  //         <div className="px-[4px] py-[4px] mr-[6px]">
  //           <motion.div
  //             // animate={tab === name}
  //             variants={innerTabsVariants}
  //             className="min-width-[100%] flex-col justify-start items-center inline-flex"
  //             onClick={() => {
  //               // setSubTab("");
  //               setTabSelected(false);
  //             }}
  //           >
  //             <div className="w-6 h-6 justify-self-center align-center">
  //               <motion.span variants={actionIconVariants}>
  //                 {/* <IoMdArrowRoundBack /> */}
  //                 <HomeSvg />
  //               </motion.span>
  //             </div>
  //             <div className="text-center text-gray-800 text-xs font-medium leading-tight tracking-tight">
  //               Back
  //             </div>
  //           </motion.div>
  //         </div>
  //         {selectedTab?.subTabs.map(({ name, Icon, subTab: st }) => {
  //           return (
  //             <div
  //               className={`${
  //                 st === subTab
  //                   ? "bg-violet-100 border border-primary rounded"
  //                   : "bg-white"
  //               } px-[4px] py-[4px] flex flex-col justify-between items-start inline-flex min-w-[60px] flex justify-center align-items`}
  //             >
  //               <motion.div
  //                 animate={tab === name}
  //                 variants={innerTabsVariants}
  //                 className={`min-width-[100%] flex-col justify-center items-center inline-flex self-center justify-self-center`}
  //                 onClick={() => {
  //                   setSubTab(st);
  //                 }}
  //               >
  //                 <div className="w-6 h-6 justify-self-center align-center pl-[4px]">
  //                   <motion.span variants={actionIconVariants}>
  //                     <Icon />
  //                   </motion.span>
  //                 </div>
  //                 <div className="text-gray-800 text-xs font-medium leading-tight tracking-tight">
  //                   {name}
  //                 </div>
  //               </motion.div>
  //             </div>
  //           );
  //         })}
  //       </>
  //     ) : (
  //       <>{BaseTabs}</>
  //     )}
  //   </div>
  // );
}

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};

const innerTabsVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

// const wrapperVariants = {
//     open: {
//       scaleY: 1,
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.1,
//       },
//     },
//     closed: {
//       scaleY: 0,
//       transition: {
//         when: "afterChildren",
//         staggerChildren: 0.1,
//       },
//     },
//   };
