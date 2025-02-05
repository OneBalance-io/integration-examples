import { useMutation, useQuery } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/sdk-react";
import { FormEvent } from "react";
import { Address } from "viem";
import { AssetId } from "../assets/assets";
import { useBalances } from "../balances/use-balances";
import { useEnvironment } from "../environment/environment";
import { useBTCAccount } from "../onebalance-account/use-btc-account";
import {
  ADMIN_ADDRESS,
  useEmbeddedWallet,
  useOneBalanceAccountAddress,
} from "../onebalance-account/use-onebalance-account";
import { executeQuote } from "../quote/execute-quote";
import { signPSBTWithTurnkey } from "../quote/sign-btc-quote";
import { signQuoteWithTurnkeySigner } from "../quote/sign-quote";
import { TurnkeyPasskeyClient } from "../turnkey/use-turnkey-auth";
import { fetchSwapBTCQuote } from "./fetch-swap-btc-quote";
import { fetchSwapQuote } from "./fetch-swap-quote";

export const useSwap = () => {
  const balancesQuery = useBalances();
  const swapMutation = useSwapMutation();
  const embeddedWallet = useEmbeddedWallet();
  const oneBalanceAccountAddress = useOneBalanceAccountAddress();

  return {
    submit: (
      event: FormEvent<HTMLFormElement>,
      data: {
        from: AssetId;
        to: AssetId;
        amount: bigint;
      },
      quote: any
    ) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      if (!(form instanceof HTMLFormElement)) return;
      if (!balancesQuery.data) return;
      if (!embeddedWallet) return;
      if (!oneBalanceAccountAddress.data) return;

      swapMutation.mutate({
        quote,
      });
    },
    mutation: swapMutation,
  };
};

export const useSwapQuote = (
  request:
    | {
        amount: bigint;
        fromAggregatedAssetId: AssetId;
        toAggregatedAssetId: AssetId;
      }
    | undefined
) => {
  const embeddedWallet = useEmbeddedWallet();
  const { apiKey, apiUrl } = useEnvironment();
  const btcData = useBTCAccount();
  const { data: accountAddress } = useOneBalanceAccountAddress();

  return useQuery({
    queryKey: [
      "swapQuote",
      request?.amount.toString(),
      request?.fromAggregatedAssetId,
      request?.toAggregatedAssetId,
      embeddedWallet?.address,
      accountAddress?.predictedAddress,
    ],
    queryFn: async () => {
      if (!request) throw new Error("No swap request provided");
      if (!embeddedWallet) throw new Error("No embedded wallet found");

      const isBTC = request.fromAggregatedAssetId === ("BTC" as any);

      if (isBTC) {
        const [_, btcAddress] = btcData;
        if (!btcAddress) throw new Error("No BTC address");
        if (!accountAddress) throw new Error("No account address");

        return fetchSwapBTCQuote(
          {
            account: {
              accountAddress: accountAddress.predictedAddress,
              sessionAddress: embeddedWallet.address as Address,
              adminAddress: ADMIN_ADDRESS,
            },
            fromTokenAmount: request.amount.toString(),
            fromAggregatedAssetId: request.fromAggregatedAssetId,
            toAggregatedAssetId: request.toAggregatedAssetId,
            userAddress: btcAddress.address,
            recipientAccountId: `eip155:8453:${accountAddress.predictedAddress}`,
          },
          {
            apiKey,
            apiUrl,
          }
        ).then((result) => {
          return {
            _tag: "BTC" as const,
            ...result,
          };
        });
      }

      return fetchSwapQuote(
        {
          account: {
            accountAddress: accountAddress!.predictedAddress,
            sessionAddress: embeddedWallet.address as Address,
            adminAddress: ADMIN_ADDRESS,
          },
          fromTokenAmount: request.amount.toString(),
          fromAggregatedAssetId: request.fromAggregatedAssetId,
          toAggregatedAssetId: request.toAggregatedAssetId,
        },
        { apiKey, apiUrl }
      ).then((result) => {
        return {
          _tag: "EVM" as const,
          ...result,
        };
      });
    },
    enabled: !!request && request.amount > BigInt(0),
    // 30 seconds
    staleTime: 30_000,
    refetchInterval: 30_001,
    retry: false,
  });
};

const useSwapMutation = () => {
  const btcData = useBTCAccount();
  const embeddedWallet = useEmbeddedWallet();
  const { passkeyClient } = useTurnkey();
  const { apiKey, apiUrl } = useEnvironment();

  return useMutation({
    mutationFn: async ({ quote }: { quote: any }) => {
      const isBTC = !!quote.psbt;

      if (!embeddedWallet) throw new Error("No embedded wallet found");

      if (isBTC) {
        return btcSwap({
          btcData,
          passkeyClient: passkeyClient!,
          apiKey,
          apiUrl,
        })(quote);
      }

      return evmSwap({
        embeddedWallet,
        passkeyClient: passkeyClient!,
        apiKey,
        apiUrl,
      })(quote);
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
  return async (quote: any) => {
    if (!embeddedWallet) throw new Error("No embedded wallet found");

    const signedQuote = await signQuoteWithTurnkeySigner(
      passkeyClient!,
      embeddedWallet.address as Address,
      embeddedWallet.organizationId
    )(quote);
    const executionResult = await executeQuote(signedQuote as any, {
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
  async (quote: any) => {
    const [btcWallet, btcAddress] = btcData;
    if (btcWallet._tag === "NoWallet") throw new Error("No BTC wallet found");
    if (!btcAddress) throw new Error("No BTC address");

    const result = await signPSBTWithTurnkey({
      walletAddress: btcAddress.address,
      publicKey: btcAddress.publicKey,
      passkeyClient: passkeyClient!,
      organizationId: btcWallet.btcWallet.organizationId,
      quoteId: quote.id,
      walletId: btcWallet.btcWallet.walletId,
      apiKey,
      apiUrl,
      tamperProofSignature: quote.tamperProofSignature,
    })(quote.psbt);

    return {
      result,
      quoteId: quote.id,
    };
  };
