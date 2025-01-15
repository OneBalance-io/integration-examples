import { useMutation } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/sdk-react";
import { FormEvent } from "react";
import { Address } from "viem";
import { AssetId } from "../assets/assets";
import { useBalances } from "../balances/use-balances";
import {
  ADMIN_ADDRESS,
  useEmbeddedWallet,
  useOneBalanceAccountAddress,
} from "../onebalance-account/use-onebalance-account";
import { executeQuote } from "../quote/execute-quote";
import { signQuoteWithTurnkeySigner } from "../quote/sign-quote";
import { fetchSwapQuote, SwapRequest } from "./fetch-swap-quote";
import { useBTCAccount } from "../onebalance-account/use-btc-account";
import { signPSBTWithTurnkey } from "../quote/sign-btc-quote";
import { fetchSwapBTCQuote } from "./fetch-swap-btc-quote";
import { TurnkeyPasskeyClient } from "../turnkey/use-turnkey-auth";
import { executeBTCQuote } from "../quote/execute-btc-quote";

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
  const btcData = useBTCAccount();
  const embeddedWallet = useEmbeddedWallet();
  const { passkeyClient } = useTurnkey();

  return useMutation({
    mutationFn: async (request: SwapRequest) => {
      const isBTC = request.fromAggregatedAssetId === ("BTC" as any);

      if (isBTC) {
        return btcSwap({
          btcData,
          passkeyClient: passkeyClient!,
        })(request);
      }

      return evmSwap({
        embeddedWallet,
        passkeyClient: passkeyClient!,
      })(request);
    },
  });
};

const evmSwap = ({
  embeddedWallet,
  passkeyClient,
}: {
  embeddedWallet: ReturnType<typeof useEmbeddedWallet>;
  passkeyClient: TurnkeyPasskeyClient;
}) => {
  return async (request: SwapRequest) => {
    if (!embeddedWallet) throw new Error("No embedded wallet found");

    const quote = await fetchSwapQuote(request);
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
  };
};

const btcSwap =
  ({
    btcData,
    passkeyClient,
  }: {
    btcData: ReturnType<typeof useBTCAccount>;
    passkeyClient: TurnkeyPasskeyClient;
  }) =>
  async (request: SwapRequest) => {
    const [btcWallet, btcAddress] = btcData;
    if (btcWallet._tag === "NoWallet") throw new Error("No BTC wallet found");
    if (!btcAddress) throw new Error("No BTC address");

    const quote = await fetchSwapBTCQuote(request);
    const signature = await signPSBTWithTurnkey({
      walletAddress: btcAddress.address,
      publicKey: btcAddress.publicKey,
      passkeyClient: passkeyClient!,
      organizationId: btcWallet.btcWallet.organizationId,
    })(quote.psbt);

    const executionResult = await executeBTCQuote({
      ...quote,
      psbt: signature,
    });
    return {
      result: executionResult,
      quoteId: quote.id,
    };
  };
