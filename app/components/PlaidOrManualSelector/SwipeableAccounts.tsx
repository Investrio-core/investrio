import usePlaidLinks from "@/app/hooks/plaid/usePlaidLinks";
import ItemSwiper from "../ItemSwiper/ItemSwiper";
import { Account } from "./RenderPlaidLinksTable";
import SwipeableAccountFront from "./SwipeableAccountFront";

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
  logo: string;
  category: string;
  date: string;
  note: string;
  recurring: string;
  accountCategory?: string;
  createdAt?: string;
  subtype?: string;
}

const convertAccountToSwipeable = (
  institutionName: string,
  account: Item,
  date: Date
) => {
  return {
    id: account.id,
    itemId: account.itemId,
    plaidAccountId: account.plaidAccountId,
    name: `${account.name}`,
    type: account.type,
    tags: [account.subtype].filter((el) => el !== undefined),
    amount: "N / A",
    logo: `${institutionName?.slice(0, 1)}`,
    category: account.subtype,
    date: formatDate(date),
    note: "",
    recurring: "",
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
}

function SwipeableAccounts({ institutionName, accounts }: Props) {
  const { updateAccount } = usePlaidLinks();
  const handleSwipeAccount = (
    selectedCategory: "left" | "right" | "MIXED",
    account: Item
  ) => {
    console.log("SWIPED ACCOUNT", account);
    console.log(selectedCategory);
    updateAccount({
      id: account.id,
      itemId: account.itemId,
      accountCategory: selectCategory(selectedCategory),
    });
  };
  return (
    <ItemSwiper<Item>
      extraCategory={{ label: "Mixed Account", value: "MIXED" }}
      label={institutionName ? `${institutionName} Accounts` : "Accounts"}
      itemsToClassify={accounts
        ?.filter((acc: Item) => acc.accountCategory === null)
        ?.map((acc: Item) =>
          convertAccountToSwipeable(
            institutionName,
            acc,
            acc?.createdAt ? new Date(acc.createdAt) : new Date()
            // date
          )
        )}
      persistHandleSwipe={handleSwipeAccount}
      RenderToFront={SwipeableAccountFront}
      //   cardHeight={"390px"}
      maxHeight={"520px"}
    />
  );
}

export default SwipeableAccounts;
