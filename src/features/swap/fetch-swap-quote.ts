import { Address } from "viem";
import { AssetId } from "../assets/assets";
import { Quote } from "../quote/quote";

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

export const fetchSwapQuote = (swapRequest: SwapRequest): Promise<Quote> => {
  const url = new URL(
    "/api/quotes/swap-quote",
    import.meta.env.VITE_ONEBALANCE_API
  );

  return fetch(url, {
    method: "post",
    body: JSON.stringify(swapRequest),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ONEBALANCE_API_KEY,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
