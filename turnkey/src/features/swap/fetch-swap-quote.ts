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

export const fetchSwapQuote = (
  swapRequest: SwapRequest,
  {
    apiKey,
    apiUrl,
  }: {
    apiKey: string;
    apiUrl: string;
  }
): Promise<Quote> => {
  const url = new URL("/api/quotes/swap-quote", apiUrl);

  return fetch(url, {
    method: "post",
    body: JSON.stringify(swapRequest),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
