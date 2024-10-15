import React, { useCallback, useState } from "react";

import {
  usePlaidLink,
  PlaidLinkOnSuccess,
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOptions,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/app/hooks/useAxiosAuth";

const PlaidLink = (itemId?: string, refetchLinks?: Function) => {
  const axiosAuth = useAxiosAuth();
  const [token, setToken] = useState<string | null>(null);
  const [linkSuccessful, setLinkSuccessful] = useState(false);
  const [linkCreating, setLinkCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const session = useSession();
  const userId = session.data?.user?.id; // .email

  // get a link_token from your API when component mounts
  const createLinkToken = async () => {
    //   const response = await fetch("/api/plaid/generateToken", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       userId,
    //       itemId: itemId ?? null,
    //     }),
    //   });
    console.log("making request");
    setLinkSuccessful(false);
    const response = await axiosAuth.post(`/plaid/generateToken`, {
      userId,
      // itemId: itemId ?? null,
    });
    //   const { link_token } = await response.json();
    const link_token = response?.link_token ?? response?.data?.link_token;
    setToken(link_token);

    console.log("successfully got response");
    console.log(response);

    console.log("successfully got link token");
    console.log(link_token);
  };

  React.useEffect(() => {
    createLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken, metadata: PlaidLinkOnSuccessMetadata) => {
      // send public_token to your server
      // https://plaid.com/docs/api/tokens/#token-exchange-flow
      console.log("-- successfully got public token --");
      console.log(publicToken, metadata);
      setLinkCreating(true);
      // TODO: use the bank/connections name to store it with the private token to distinguish between accounts...
      // NOTE: NEVER return the private token to the client
      const response = (await axiosAuth.post("/plaid/exchangePublicToken", {
        userId,
        publicToken,
        institutionName: metadata.institution?.name,
        institutionID: metadata.institution?.institution_id,
        accounts: metadata.accounts,
        // account: metadata?.account,
      })) as { success?: string; error?: string };
      setLinkCreating(false);
      refetchLinks && refetchLinks();
      if (response?.success) {
        setLinkSuccessful(true);
        console.log("-- exchanged token successful --");
      } else {
        setErrorMessage("Something went wrong linking your account");
      }
      console.log(response);
    },
    []
  );

  const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
    // log onEvent callbacks from Link
    // https://plaid.com/docs/link/web/#onevent
    console.log(eventName, metadata);
  }, []);
  const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
    // log onExit callbacks from Link, handle errors
    // https://plaid.com/docs/link/web/#onexit
    console.log(error, metadata);
  }, []);

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    onEvent,
    onExit,
  };

  const {
    open,
    ready,
    // error,
    // exit
  } = usePlaidLink(config);

  return { open, ready, token, linkSuccessful, linkCreating };
};

export default PlaidLink;
