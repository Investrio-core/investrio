import usePlaidLinks from "@/app/hooks/plaid/usePlaidLinks";
import ItemSwiper from "../ItemSwiper/ItemSwiper";
import { Account } from "./RenderPlaidLinksTable";
import SwipeableAccountFront from "./SwipeableAccountFront";
import { useEffect, useMemo } from "react";

function getOrdinal(day: number) {
  if (day > 3 && day < 21) return day + "th";
  switch (day % 10) {
    case 1:
      return day + "st";
    case 2:
      return day + "nd";
    case 3:
      return day + "rd";
    default:
      return day + "th";
  }
}

function formatDate(date: Date) {
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

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const formattedDay = getOrdinal(day);

  return `${month} ${formattedDay}, ${year}`;
}

interface Item {
  id: string;
  itemId: string;
  plaidAccountId: string;
  name: string;
  type: string;
  tags: string[];
  amount: string;
  currentBalance?: number;
  availableBalance?: number;
  logo: string;
  category: string;
  date: string;
  note: string;
  recurring: string;
  accountCategory?: string;
  createdAt?: string;
  subtype?: string;
  mask?: string;
}

const convertAccountToSwipeable = (
  institutionName: string,
  account: Item,
  date: Date
) => {
  const amount = account?.availableBalance ?? account?.currentBalance;

  return {
    id: account.id,
    itemId: account.itemId,
    plaidAccountId: account.plaidAccountId,
    name: `${account.name}`,
    type: account.type,
    subtype: account.subtype,
    tags: [account.subtype].filter((el) => el !== undefined),
    balance: amount ?? "N / A",
    logo: `${institutionName?.slice(0, 1)}`,
    category: account.subtype,
    date: formatDate(date),
    note: "",
    recurring: "",
    mask: account?.mask,
  };
};

const selectCategory = (category: "left" | "right" | "MIXED") => {
  if (category === "left") {
    return "Business";
  } else if (category === "right") {
    return "Personal";
  } else {
    return "Mixed";
  }
};

interface Props {
  institutionName: string;
  accounts: Item[];
  isLastAccount: boolean;
  handleProceed: Function;
}

function SwipeableAccounts({
  institutionName,
  accounts,
  isLastAccount,
  handleProceed,
}: Props) {
  const { updateAccount } = usePlaidLinks();

  const handleSwipeAccount = (
    selectedCategory: "left" | "right" | "MIXED",
    account: Item
  ) => {
    updateAccount({
      id: account.id,
      itemId: account.itemId,
      accountCategory: selectCategory(selectedCategory),
    });
  };

  const itemsToClassify = useMemo(
    () =>
      accounts
        ?.filter(
          (acc: Item) => acc.accountCategory === null
          //   ||
          // (acc.accountCategory !== "Mixed" &&
          //   acc.accountCategory !== "Business" &&
          //   acc.accountCategory !== "Personal")
        )
        ?.map((acc: Item) =>
          convertAccountToSwipeable(
            institutionName,
            acc,
            acc?.createdAt ? new Date(acc.createdAt) : new Date()
            // date
          )
        ),
    [accounts]
  );

  if (!isLastAccount && itemsToClassify?.length === 0) {
    return <></>;
  }

  useEffect(() => {
    console.log("accounts changed");
    console.log(accounts);
  }, [accounts]);

  useEffect(() => {
    console.log("items to classify changed");
    console.log(itemsToClassify);
    console.log(itemsToClassify?.length);
  }, [itemsToClassify]);
  return (
    <ItemSwiper<Item>
      extraCategory={{ label: "Mixed", value: "Mixed" }}
      label={institutionName ? `${institutionName} Accounts` : "Accounts"}
      itemsToClassify={itemsToClassify}
      persistHandleSwipe={handleSwipeAccount}
      RenderToFront={SwipeableAccountFront}
      //   cardHeight={"390px"}
      maxHeight={"545px"}
      handleProceed={handleProceed}
    />
  );
}

export default SwipeableAccounts;
