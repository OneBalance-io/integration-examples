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
  recipientAccountId: string;
  userAddress: string;
}

export const fetchSwapBTCQuote = (
  swapRequest: SwapRequest,
  {
    apiUrl,
    apiKey,
  }: {
    apiUrl: string;
    apiKey: string;
  }
): Promise<{
  id: string;
  userAddress: string;
  psbt: string;
  tamperProofSignature: string;
}> => {
  const url = new URL("/api/quotes/btc/swap-quote", apiUrl);

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
