"use client";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useOneBalanceAccountAddress } from "../onebalance-account/use-onebalance-account";
import { fetchBalances, fetchBTCBalance } from "./fetch-balances";
import { fetchAssets } from "../assets/fetch-assets";
import { useEnvironment } from "../environment/environment";
import { useBTCAccount } from "../onebalance-account/use-btc-account";

export const useBalances = () => {
  const { data: account } = useOneBalanceAccountAddress();
  const { apiUrl, apiKey } = useEnvironment();
  const [, address] = useBTCAccount();

  return useQuery({
    queryKey: ["balances", account, apiKey, apiUrl, address?.address],
    queryFn: account?.predictedAddress
      ? async () => {
          const [balances, assets, maybeBTCBalance] = await Promise.all([
            fetchBalances({
              address: account.predictedAddress,
              apiKey,
              apiUrl,
            }),
            fetchAssets({
              apiUrl,
              apiKey,
            }),
            ...(address
              ? [
                  fetchBTCBalance({
                    address: address.address,
                    apiKey,
                    apiUrl,
                  }),
                ]
              : []),
          ]);

          const assetsMap = new Map(
            assets.map((asset) => [asset.aggregatedAssetId, asset])
          );

          const balancesByAssetWithDecimals = balances.balanceByAsset.flatMap(
            (byAsset) => {
              const asset = assetsMap.get(byAsset.aggregatedAssetId);
              if (!asset) return [];

              return [
                {
                  ...byAsset,
                  decimals: asset.decimals,
                  name: asset.name,
                  symbol: asset.symbol,
                },
              ];
            }
          );

          return {
            balances: {
              ...balances,
              balanceByAsset: balancesByAssetWithDecimals,
            },
            btcBalance: maybeBTCBalance as typeof maybeBTCBalance | undefined,
            assets,
          };
        }
      : skipToken,
  });
};
