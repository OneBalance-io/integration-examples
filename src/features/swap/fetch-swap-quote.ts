import { Address } from "viem";
import { getRuntimeConfig } from "../../get-config";
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
  const config = getRuntimeConfig();
  const url = new URL("/api/quotes/swap-quote", config.VITE_ONEBALANCE_API);

  return fetch(url, {
    method: "post",
    body: JSON.stringify(swapRequest),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.VITE_ONEBALANCE_API_KEY,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
