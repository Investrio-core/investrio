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
import SwipeableAccounts from "./SwipeableAccounts";
import PlaidItemLoading from "./PlaidItemLoading";

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
