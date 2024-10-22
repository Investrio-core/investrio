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
import RenderTransactionsTable from "./RenderTransactionsTable";
import { link } from "fs";
import { useEffect, useState } from "react";

const TEST_ID = "cm2h4mki200015qng3h44hldb";

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

// const selectCategory = (category: "left" | "right" | "MIXED") => {
//   if (category === "left") {
//     return "Business";
//   } else if (category === "right") {
//     return "Personal";
//   } else {
//     return "Mixed";
//   }
// };

const PlaidOrManualSelector = ({ title, blurb, setShow }: Props) => {
  const {
    plaidLinks,
    refetch: refetchLinks,
    updateAccount,
    allAccountsClassified,
    getUnclassifiedAccounts,
    resetAccountCategory,
    resetItemAccountsCategories,
  } = usePlaidLinks();

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
    isAccountLoaded,
  } = usePlaidItem(newLinkItemId);

  // useEffect(() => {
  //   console.log("all accounts are classfied?");
  //   if (newLinkItemId) console.log(allAccountsClassified(newLinkItemId));

  //   if (
  //     linkSuccessful &&
  //     newLinkItemId &&
  //     !loadingData &&
  //     accounts &&
  //     accounts?.length > 0 &&
  //     !isAccountLoaded(newLinkItemId) &&
  //     // allAccountsClassified(newLinkItemId)
  //     classifiedAccountsMap[newLinkItemId]
  //     //  &&
  //     // !linkCreating &&
  //     // !loadingData
  //   ) {
  //     console.log("-- IN HERE TO LOAD ALL DATA --");
  //     loadAllDataFromLinkId(newLinkItemId);
  //   }
  // }, [linkSuccessful, newLinkItemId, loadingData, accounts]);

  console.log("Plaid Links Data Success");
  console.log(plaidLinks?.data?.success);

  console.log("Transactions data success");
  console.log(transactions);

  const [classifiedAccountsMap, setClassifiedAccountsMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [unclassifiedAccounts, setUnclassifiedAccounts] = useState<Item[]>([]);

  useEffect(() => {
    if (newLinkItemId) {
      const classified = allAccountsClassified(newLinkItemId);
      if (classified) {
        setClassifiedAccountsMap((prevState) => {
          return {
            ...prevState,
            [newLinkItemId]: classified,
          };
        });
      }
    } else {
      const unclassifiedAccounts = getUnclassifiedAccounts();
      console.log("there are unclassified accounts");
      console.log(unclassifiedAccounts);
      console.log(unclassifiedAccounts?.length);
      setUnclassifiedAccounts(unclassifiedAccounts);
    }
  }, [plaidLinks?.data?.success, newLinkItemId]);

  const onContinue = async () => {
    if (newLinkItemId && classifiedAccountsMap[newLinkItemId]) {
      await loadAllDataFromLinkId(newLinkItemId);
      setShow(false);
    } else {
      setShow(false);
    }
  };

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
      {(!linkCreating && !loadingData && unclassifiedAccounts?.length === 0) ||
      (newLinkItemId && classifiedAccountsMap?.[newLinkItemId]) ? (
        <PlaidOrManualForm
          title={title}
          blurb={blurb}
          open={open}
          setShow={setShow}
          ready={ready}
          key={0}
          showManualOption={!(plaidLinks?.data?.success?.length > 0)}
        />
      ) : null}

      <div className="px-[31px]">
        <div>
          {linkCreating || loadingData ? (
            <div className="mx-[-56px] rounded-[100px]">
              <PlaidItemLoading
                linkCreating={linkCreating}
                linkSuccessful={linkSuccessful}
                loadStepInProgress={loadStepInProgress}
                loadingData={loadingData}
              />
            </div>
          ) : null}

          {/* {plaidLinks?.data?.success ? (
            <SwipeableAccounts
              institutionName={plaidLinks?.data?.success?.[0]?.institutionName}
              accounts={plaidLinks?.data?.success?.[0]?.accounts}
            />
          ) : null} */}

          {plaidLinks?.data?.success ? (
            <>
              {plaidLinks?.data?.success?.map(
                (nextResult: ConnectedAccounts, idx: number) => (
                  <SwipeableAccounts
                    institutionName={nextResult?.institutionName}
                    accounts={nextResult?.accounts as Item[]}
                    isLastAccount={
                      idx === plaidLinks?.data?.success?.length - 1
                    }
                    handleProceed={onContinue}
                  />
                )
              )}
            </>
          ) : null}

          {/* {unclassifiedAccounts?.length > 0 ? (
            <>
              <SwipeableAccounts
                institutionName={""}
                accounts={unclassifiedAccounts as Item[]}
                isLastAccount={true}
                handleProceed={onContinue}
              />
            </>
          ) : null} */}

          {plaidLinks?.data?.success?.length > 0 &&
          unclassifiedAccounts?.length === 0 ? (
            <div className="mx-[-64px]">
              <RenderPlaidLinksTable
                connectedAccounts={
                  plaidLinks?.data?.success as ConnectedAccounts[]
                }
                resetAccountCategory={resetAccountCategory}
                resetItemAccountsCategories={resetItemAccountsCategories}
                
              />
            </div>
          ) : null}

          {unclassifiedAccounts?.length === 0 ? (
            <div className="mx-[-55px] mt-[18px]">
              <RenderTransactionsTable
                transactions={transactions?.success?.accounts?.added}
              />
            </div>
          ) : null}

          {unclassifiedAccounts?.length === 0 ? (
            <TestComponent
              linkSuccessful={linkSuccessful}
              getAccounts={getAccounts}
              getDebts={getDebts}
              getTransactions={getTransactions}
              id={newLinkItemId ?? plaidLinks?.data?.success?.linkId}
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
  id,
}: {
  linkSuccessful: boolean;
  getAccounts: Function;
  getDebts: Function;
  getTransactions: Function;
  id: string;
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
          onClick={() => getAccounts(id)}
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
          onClick={() => getDebts(id)}
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
          onClick={() => getTransactions(id)}
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
