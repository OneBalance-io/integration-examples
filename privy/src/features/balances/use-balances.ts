import { skipToken, useQuery } from "@tanstack/react-query";
import { useOneBalanceAccountAddress } from "../onebalance-account/use-onebalance-account";
import { fetchBalances } from "./fetch-balances";
import { fetchAssets } from "../assets/fetch-assets";

export const useBalances = () => {
  const { data: account } = useOneBalanceAccountAddress();

  return useQuery({
    queryKey: ["balances", account],
    queryFn: account?.predictedAddress
      ? async () => {
          const [balances, assets] = await Promise.all([
            fetchBalances({
              address: account.predictedAddress,
            }),
            fetchAssets(),
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
            assets,
          };
        }
      : skipToken,
  });
};
