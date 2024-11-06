import { Address } from "viem";
import { Quote } from "../quote/quote";
import { getRuntimeConfig } from "../../get-config";

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

const config = getRuntimeConfig();

export const fetchTransferQuote = (
  transferRequest: TransferRequest
): Promise<Quote> => {
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
