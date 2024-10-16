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
import PlaidOrManualForm from "./PlaidOrManualForm";

const TEST_ID = "cm2bb9mlp00009qw7iltorp6w";

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
  const { open, ready, token, linkCreating, linkSuccessful, newLinkItemId } =
    usePlaidLink(undefined, refetchLinks);

  const {
    getAccounts,
    accounts,
    getTransactions,
    transactions,
    getDebts,
    debts,
    loadAllDataFromLinkId,
    loadStepInProgress,
    loadingData,
  } = usePlaidItem();

  // console.log("Plaid Links");
  // console.log(plaidLinks);

  console.log("Plaid Links Data Success");
  console.log(plaidLinks?.data?.success);

  return (
    <div
      className="px-[25px] mx-[17px] mb-[27px] mt-[36px]"
      style={{
        borderRadius: "18px",
        border: "1px solid #D2DAFF",
        background: "#FFF",
      }}
    >
      {/* STEP 1: Form (Choose Manual or Plaid) */}
      <PlaidOrManualForm
        title={title}
        blurb={blurb}
        open={open}
        setShow={setShow}
        ready={ready}
        key={0}
      />
      {/* <div className="text-[#100d40] text-2xl font-semibold leading-[33.60px] mt-[46px] mb-[11px] text-center">
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
          </button> */}
      <div className="px-[31px]">
        <div>
          <div className="mx-[-56px] rounded-[100px]">
            <PlaidItemLoading
              linkCreating={linkCreating}
              linkSuccessful={linkSuccessful}
              loadStepInProgress={loadStepInProgress}
              loadingData={loadingData}
            />
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
          onClick={() => getAccounts(TEST_ID)}
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
          onClick={() => getDebts(TEST_ID)}
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
          onClick={() => getTransactions(TEST_ID)}
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
