import { Address } from "viem";
import { getRuntimeConfig } from "../../get-config";
import { Quote } from "../quote/quote";

export interface TransferRequest {
  account: {
    accountAddress: Address;
    sessionAddress: Address;
    adminAddress: Address;
  };
  aggregatedAssetId: string;
  amount: string;
  recipientAccountId: string;
}

export const fetchTransferQuote = (
  transferRequest: TransferRequest
): Promise<Quote> => {
  const config = getRuntimeConfig();
  const url = new URL("/api/quotes/transfer-quote", config.VITE_ONEBALANCE_API);

  return fetch(url, {
    method: "post",
    body: JSON.stringify(transferRequest),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.VITE_ONEBALANCE_API_KEY,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
