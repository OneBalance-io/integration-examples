import { useMutation } from "@tanstack/react-query";
import { FormEvent } from "react";
import { Address } from "viem";
import { AssetId } from "../assets/assets";
import { useBalances } from "../balances/use-balances";
import {
  ADMIN_ADDRESS,
  useEmbeddedWallet,
  useOneBalanceAccountAddress,
} from "../onebalance-account/use-onebalance-account";
import { useAsyncSignTypedData } from "../privy/use-async-sign-message";
import { executeQuote } from "../quote/execute-quote";
import { signQuoteWithPrivySigner } from "../quote/sign-quote";
import { fetchSwapQuote, SwapRequest } from "./fetch-swap-quote";

export const useSwap = () => {
  const balancesQuery = useBalances();
  const swapMutation = useSwapMutation();
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
      swapMutation.mutate({
        account: {
          accountAddress: oneBalanceAccountAddress.data.predictedAddress,
          sessionAddress: embeddedWallet.address as Address,
          adminAddress: ADMIN_ADDRESS,
        },
        fromTokenAmount: payload.amount as string,
        fromAggregatedAssetId: payload.from as AssetId,
        toAggregatedAssetId: payload.to as AssetId,
      });
    },
    mutation: swapMutation,
  };
};

const useSwapMutation = () => {
  const { signTypedDataAsync } = useAsyncSignTypedData();

  return useMutation({
    mutationFn: async (request: SwapRequest) => {
      const quote = await fetchSwapQuote(request);
      const signedQuote = await signQuoteWithPrivySigner(signTypedDataAsync)(
        quote
      );
      const executionResult = await executeQuote(signedQuote);
      return executionResult;
    },
  });
};