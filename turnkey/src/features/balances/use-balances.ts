import { skipToken, useQuery } from "@tanstack/react-query";
import { useOneBalanceAccountAddress } from "../onebalance-account/use-onebalance-account";
import { fetchBalances } from "./fetch-balances";
import { fetchAssets } from "../assets/fetch-assets";
import { useEnvironment } from "../environment/environment";

export const useBalances = () => {
  const { data: account } = useOneBalanceAccountAddress();
  const { apiUrl, apiKey } = useEnvironment();

  return useQuery({
    queryKey: ["balances", account, apiKey, apiUrl],
    queryFn: account?.predictedAddress
      ? async () => {
          const [balances, assets] = await Promise.all([
            fetchBalances({
              address: account.predictedAddress,
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
