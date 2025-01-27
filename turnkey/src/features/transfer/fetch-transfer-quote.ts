import { Address } from "viem";
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
  transferRequest: TransferRequest,
  {
    apiKey,
    apiUrl,
  }: {
    apiKey: string;
    apiUrl: string;
  }
): Promise<Quote> => {
  const url = new URL("/api/quotes/transfer-quote", apiUrl);

  return fetch(url, {
    method: "post",
    body: JSON.stringify(transferRequest),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
