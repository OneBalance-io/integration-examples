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
import { useEnvironment } from "../environment/environment";

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
  const { apiKey, apiUrl } = useEnvironment();

  return useMutation({
    mutationFn: async (request: SwapRequest) => {
      const isBTC = request.fromAggregatedAssetId === ("BTC" as any);

      if (isBTC) {
        return btcSwap({
          btcData,
          passkeyClient: passkeyClient!,
          apiKey,
          apiUrl,
        })(request);
      }

      return evmSwap({
        embeddedWallet,
        passkeyClient: passkeyClient!,
        apiKey,
        apiUrl,
      })(request);
    },
  });
};

const evmSwap = ({
  embeddedWallet,
  passkeyClient,
  apiKey,
  apiUrl,
}: {
  embeddedWallet: ReturnType<typeof useEmbeddedWallet>;
  passkeyClient: TurnkeyPasskeyClient;
  apiKey: string;
  apiUrl: string;
}) => {
  return async (request: SwapRequest) => {
    if (!embeddedWallet) throw new Error("No embedded wallet found");

    const quote = await fetchSwapQuote(request, { apiKey, apiUrl });
    const signedQuote = await signQuoteWithTurnkeySigner(
      passkeyClient!,
      embeddedWallet.address as Address,
      embeddedWallet.organizationId
    )(quote);
    const executionResult = await executeQuote(signedQuote, {
      apiKey,
      apiUrl,
    });
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
    apiKey,
    apiUrl,
  }: {
    btcData: ReturnType<typeof useBTCAccount>;
    passkeyClient: TurnkeyPasskeyClient;
    apiKey: string;
    apiUrl: string;
  }) =>
  async (request: SwapRequest) => {
    const [btcWallet, btcAddress] = btcData;
    if (btcWallet._tag === "NoWallet") throw new Error("No BTC wallet found");
    if (!btcAddress) throw new Error("No BTC address");

    const quote = await fetchSwapBTCQuote(
      {
        ...request,
        // userAddress: btcAddress.address,
        // // TODO: Replace with the actual recipient account ID
        // recipientAccountId: '',
        userAddress: "bc1qg37pd4vt82lfg3m7nkmllhgkpudmtg55k5fxlt",
        recipientAccountId:
          "eip155:8453:0xA311bD47CAC52fD370421714EA81d8D25aF169dC",
        // recipientAccountId: `bip122:000000000019d6689c085ae165831e93:${btcAddress.address}`,
      },
      {
        apiKey,
        apiUrl,
      }
    );
    const signature = await signPSBTWithTurnkey({
      walletAddress: btcAddress.address,
      publicKey: btcAddress.publicKey,
      passkeyClient: passkeyClient!,
      organizationId: btcWallet.btcWallet.organizationId,
    })(quote.psbt);

    const executionResult = await executeBTCQuote(
      {
        ...quote,
        psbt: signature,
      },
      {
        apiKey,
        apiUrl,
      }
    );
    return {
      result: executionResult,
      quoteId: quote.id,
    };
  };
