import { useMutation } from "@tanstack/react-query";
import { AccountId } from "caip";
import { FormEvent } from "react";
import { Address } from "viem";
import { useBalances } from "../balances/use-balances";
import {
  ADMIN_ADDRESS,
  useEmbeddedWallet,
  useOneBalanceAccountAddress,
} from "../onebalance-account/use-onebalance-account";
import { executeQuote } from "../quote/execute-quote";
import { signQuoteWithTurnkeySigner } from "../quote/sign-quote";
import { fetchTransferQuote, TransferRequest } from "./fetch-transfer-quote";
import { useTurnkey } from "@turnkey/sdk-react";

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

      transferMutation.mutate({
        account: {
          accountAddress: oneBalanceAccountAddress.data.predictedAddress,
          sessionAddress: embeddedWallet.address as Address,
          adminAddress: ADMIN_ADDRESS,
        },
        amount: payload.amount as string,
        recipientAccountId,
        aggregatedAssetId: payload.asset as string,
      });
    },
    mutation: transferMutation,
  };
};

const useTransferMutation = () => {
  const embeddedWallet = useEmbeddedWallet();
  const { passkeyClient } = useTurnkey();

  return useMutation({
    mutationFn: async (request: TransferRequest) => {
      if (!embeddedWallet) throw new Error("No embedded wallet found");

      const quote = await fetchTransferQuote(request);
      const signedQuote = await signQuoteWithTurnkeySigner(
        passkeyClient!,
        embeddedWallet.address as Address,
        embeddedWallet.organizationId
      )(quote);
      const executionResult = await executeQuote(signedQuote);
      return {
        result: executionResult,
        quoteId: quote.id,
      };
    },
  });
};
