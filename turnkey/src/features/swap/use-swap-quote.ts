import { skipToken, useQuery } from "@tanstack/react-query";
import { fetchSwapQuote, SwapRequest } from "./fetch-swap-quote";
import {
  ADMIN_ADDRESS,
  useEmbeddedWallet,
  useOneBalanceAccountAddress,
} from "../onebalance-account/use-onebalance-account";
import { Address } from "viem";
import { AssetId } from "../assets/assets";
import { useEnvironment } from "../environment/environment";

export const useSwapQuote = ({
  isFormValid,
  fromTokenAmount,
  fromAggregatedAssetId,
  toAggregatedAssetId,
}: {
  fromTokenAmount: string;
  fromAggregatedAssetId: AssetId;
  toAggregatedAssetId: AssetId;
  isFormValid: boolean;
}) => {
  const oneBalanceAccountAddress = useOneBalanceAccountAddress();
  const embeddedWallet = useEmbeddedWallet();
  const { apiKey, apiUrl } = useEnvironment();

  return useQuery({
    queryKey: ["swap-quote"],
    queryFn:
      oneBalanceAccountAddress.data && !!embeddedWallet && isFormValid
        ? () => {
            const request: SwapRequest = {
              account: {
                accountAddress: oneBalanceAccountAddress.data.predictedAddress,
                sessionAddress: embeddedWallet.address as Address,
                adminAddress: ADMIN_ADDRESS,
              },
              fromTokenAmount,
              fromAggregatedAssetId,
              toAggregatedAssetId,
            };
            return fetchSwapQuote(request, { apiUrl, apiKey });
          }
        : skipToken,
  });
};
