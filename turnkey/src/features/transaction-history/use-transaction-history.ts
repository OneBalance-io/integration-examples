"use client";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useOneBalanceAccountAddress } from "../onebalance-account/use-onebalance-account";
import { fetchTransactionHistory } from "./fetch-transaction-history";
import { fetchAssets } from "../assets/fetch-assets";
import { useEnvironment } from "../environment/environment";

export const useTransactionHistory = () => {
  const account = useOneBalanceAccountAddress();
  const { apiUrl, apiKey } = useEnvironment();

  return useQuery({
    queryKey: ["transaction-history", apiUrl, apiKey],
    queryFn: account.data
      ? async () => {
          const [history, assets] = await Promise.all([
            fetchTransactionHistory({
              address: account.data.predictedAddress,
              apiKey,
              apiUrl,
            }),
            fetchAssets({
              apiUrl,
              apiKey,
            }),
          ]);

          const assetsMap = new Map(
            assets.map((asset) => [asset.aggregatedAssetId, asset])
          );

          return history.transactions.flatMap((transaction) => {
            const originAsset = assetsMap.get(
              transaction.originToken.aggregatedAssetId
            );
            const destinationAsset = assetsMap.get(
              transaction.destinationToken.aggregatedAssetId
            );

            if (!originAsset || !destinationAsset) return [];

            return [
              {
                ...transaction,
                originAsset,
                destinationAsset,
              },
            ];
          });
        }
      : skipToken,
  });
};
