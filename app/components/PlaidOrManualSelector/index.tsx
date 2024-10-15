import { LightButton, SimpleButton } from "../ui/buttons";
import usePlaidLink from "@/app/hooks/plaid/usePlaidLink";
import usePlaidLinks, {
  AccountCategory,
} from "@/app/hooks/plaid/usePlaidLinks";
import usePlaidItem from "@/app/hooks/plaid/usePlaidItem";
import RenderPlaidLinksTable, {
  ConnectedAccounts,
  Account,
} from "./RenderPlaidLinksTable";
import ItemSwiper from "../ItemSwiper/ItemSwiper";
import SwipeableAccounts from "./SwipeableAccounts";
import PlaidItemLoading from "./PlaidItemLoading";
// import { PlaidAccount } from "@prisma/client";

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

  // Helper function to add ordinal suffix to day

  const formattedDay = getOrdinal(day);

  return `${month} ${formattedDay}, ${year}`;
}

interface Item {
  id: string;
  itemId: string;
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
}

const convertAccountToSwipeable = (
  institutionName: string,
  account: Account,
  date: Date
) => {
  return {
    id: account.id,
    itemId: account.itemId,
    name: `${account.name}`,
    type: account.type,
    tags: [account.subtype],
    amount: "N / A",
    logo: `${institutionName?.slice(0, 1)}`,
    category: account.subtype,
    date: formatDate(date),
    note: "",
    recurring: "",
  };
};

interface Props {
  title: string;
  blurb: string;
  setShow: Function;
}

const selectCategory = (category: "left" | "right" | "MIXED") => {
  if (category === "left") {
    return "Business";
  } else if (category === "right") {
    return "Personal";
  } else {
    return "Mixed";
  }
};

const PlaidOrManualSelector = ({ title, blurb, setShow }: Props) => {
  const { plaidLinks, refetch: refetchLinks, updateAccount } = usePlaidLinks();
  const { open, ready, token, linkCreating, linkSuccessful } = usePlaidLink(
    undefined,
    refetchLinks
  );

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

  const {
    getAccounts,
    accounts,
    getTransactions,
    transactions,
    getDebts,
    debts,
  } = usePlaidItem();

  const date = new Date();

  return (
    <div
      className="px-[25px] mx-[17px] mb-[27px] mt-[36px]"
      style={{
        borderRadius: "18px",
        border: "1px solid #D2DAFF",
        background: "#FFF",
      }}
    >
      <div className="text-[#100d40] text-2xl font-semibold leading-[33.60px] mt-[46px] mb-[11px] text-center">
        {title}
      </div>
      <div className="text-[#747682] text-base font-normal mb-[41px] text-center">
        {blurb}
      </div>
      <div className="px-[31px]">
        <div className="text-[#03091d] text-xl font-medium text-center mb-[34px]">
          Enter your data:
        </div>
        <div className="mb-[80px]">
          <SimpleButton
            text="Manual"
            onClick={() => setShow(false)}
            className="mb-[8px]"
            loading={false}
          />
          {/* <LightButton text="Plaid" onClick={() => console.log("clicked")} /> */}
          <button
            style={{
              width: "100%",
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 8,
              border: "1px #8833FF solid",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              display: "inline-flex",
            }}
            onClick={() => open()}
            disabled={!ready}
          >
            <div
              style={{
                textAlign: "center",
                color: "#8833FF",
              }}
            >
              {ready ? "Plaid" : "Loading Plaid"}
            </div>
          </button>

          <div className="mx-[-56px] rounded-[100px]">
            <PlaidItemLoading />
          </div>

          <TestComponent
            linkSuccessful={linkSuccessful}
            getAccounts={getAccounts}
            getDebts={getDebts}
            getTransactions={getTransactions}
          />

          {plaidLinks?.data?.success ? (
            <div className="mx-[-55px]">
              <RenderPlaidLinksTable
                connectedAccounts={
                  plaidLinks?.data?.success as ConnectedAccounts[]
                }
              />
            </div>
          ) : null}

          {/* {plaidLinks?.data?.success ? (
            <ItemSwiper<Item>
              extraCategory={{ label: "Mixed Account", value: "MIXED" }}
              label={`${plaidLinks?.data?.success?.[0]?.institutionName} Accounts`}
              itemsToClassify={plaidLinks?.data?.success?.[0]?.accounts
                ?.filter((acc: Item) => acc.accountCategory === null)
                ?.map((acc: Item) =>
                  convertAccountToSwipeable(
                    plaidLinks?.data?.success?.[0]?.institutionName,
                    acc,
                    acc?.createdAt ? new Date(acc.createdAt) : new Date()
                    // date
                  )
                )}
              persistHandleSwipe={handleSwipeAccount}
            />
          ) : null} */}

          {plaidLinks?.data?.success ? (
            <SwipeableAccounts
              institutionName={plaidLinks?.data?.success?.[0]?.institutionName}
              accounts={plaidLinks?.data?.success?.[0]?.accounts}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const TestComponent = ({
  linkSuccessful,
  getAccounts,
  getDebts,
  getTransactions,
}: {
  linkSuccessful: boolean;
  getAccounts: Function;
  getDebts: Function;
  getTransactions: Function;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <br />
      {true ? (
        <button
          style={{
            width: "100%",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 8,
            border: "1px #8833FF solid",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginBottom: "8px",
            display: "inline-flex",
          }}
          onClick={() => getAccounts()}
        >
          <div
            style={{
              textAlign: "center",
              color: "#8833FF",
            }}
          >
            Get Accounts
          </div>
        </button>
      ) : null}
      {true ? (
        <button
          style={{
            width: "100%",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 8,
            border: "1px #8833FF solid",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginBottom: "8px",
            display: "inline-flex",
          }}
          onClick={() => getDebts()}
        >
          <div
            style={{
              textAlign: "center",
              color: "#8833FF",
            }}
          >
            Get Debts
          </div>
        </button>
      ) : null}
      {true ? (
        <button
          style={{
            width: "100%",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 8,
            border: "1px #8833FF solid",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            marginBottom: "8px",
            display: "inline-flex",
          }}
          onClick={() => getTransactions()}
        >
          <div
            style={{
              textAlign: "center",
              color: "#8833FF",
            }}
          >
            Get Transactions
          </div>
        </button>
      ) : null}
    </div>
  );
};

export default PlaidOrManualSelector;
