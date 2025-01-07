import { skipToken, useQuery } from "@tanstack/react-query";
import { useOneBalanceAccountAddress } from "../onebalance-account/use-onebalance-account";
import { fetchTransactionHistory } from "./fetch-transaction-history";
import { fetchAssets } from "../assets/fetch-assets";

export const useTransactionHistory = () => {
  const account = useOneBalanceAccountAddress();

  return useQuery({
    queryKey: ["transaction-history"],
    queryFn: account.data
      ? async () => {
          const [history, assets] = await Promise.all([
            fetchTransactionHistory({
              address: account.data.predictedAddress,
            }),
            fetchAssets(),
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
