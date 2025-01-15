import { Address } from "viem";
import { AssetId } from "../assets/assets";

export interface SwapRequest {
  account: {
    accountAddress: Address;
    sessionAddress: Address;
    adminAddress: Address;
  };
  fromTokenAmount: string;
  fromAggregatedAssetId: AssetId;
  toAggregatedAssetId: AssetId;
  recipientAccountId?: string;
}

export const fetchSwapBTCQuote = (
  swapRequest: SwapRequest
): Promise<{
  id: string;
  userAddress: string;
  psbt: string;
}> => {
  const url = new URL(
    "/api/quotes/btc/swap-quote",
    process.env.NEXT_PUBLIC_ONEBALANCE_API
  );

  return fetch(url, {
    method: "post",
    body: JSON.stringify(swapRequest),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_ONEBALANCE_API_KEY!,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
