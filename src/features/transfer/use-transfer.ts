import { useMutation } from "@tanstack/react-query";
import { FormEvent } from "react";
import { Address } from "viem";
import { useBalances } from "../balances/use-balances";
import {
  ADMIN_ADDRESS,
  useEmbeddedWallet,
  useOneBalanceAccountAddress,
} from "../onebalance-account/use-onebalance-account";
import { useAsyncSignTypedData } from "../privy/use-async-sign-message";
import { executeQuote } from "../quote/execute-quote";
import { signQuoteWithPrivySignerHook } from "../quote/sign-quote";
import { fetchTransferQuote, TransferRequest } from "./fetch-transfer-quote";
import { AccountId } from "caip";

export const useTransfer = () => {
  const balancesQuery = useBalances();
  const transferMutation = useTransferMutation();
  const embeddedWallet = useEmbeddedWallet();
  const oneBalanceAccountAddress = useOneBalanceAccountAddress();

  return {
    submit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      if (!(form instanceof HTMLFormElement)) return;
      if (!balancesQuery.data) return;
      if (!embeddedWallet) return;
      if (!oneBalanceAccountAddress.data) return;

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      // We suggest you validate the payload before sending it to the API.
      // Validation is outside of the scope of this demo.

      const recipientAccountId = AccountId.format({
        chainId: payload.chain as string,
        address: payload.address as string,
      });

      // TODO: remove hardcoding, once and if assetType is removed
      const assetType =
        "eip155:42161/erc20:0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

      transferMutation.mutate({
        account: {
          accountAddress: oneBalanceAccountAddress.data.predictedAddress,
          sessionAddress: embeddedWallet.address as Address,
          adminAddress: ADMIN_ADDRESS,
        },
        amount: payload.amount as string,
        recipientAccountId,
        assetType,
      });
    },
    mutation: transferMutation,
  };
};

const useTransferMutation = () => {
  const { signTypedDataAsync } = useAsyncSignTypedData();

  return useMutation({
    mutationFn: async (request: TransferRequest) => {
      const quote = await fetchTransferQuote(request);
      const signedQuote = await signQuoteWithPrivySignerHook(
        signTypedDataAsync
      )(quote);
      const executionResult = await executeQuote(signedQuote);
      return executionResult;
    },
  });
};
