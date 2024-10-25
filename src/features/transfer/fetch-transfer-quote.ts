import { Address } from "viem";
import { Quote } from "../quote/quote";

export interface TransferRequest {
  account: {
    accountAddress: Address;
    sessionAddress: Address;
    adminAddress: Address;
  };
  assetType: string;
  amount: string;
  recipientAccountId: string;
}

export const fetchTransferQuote = (
  transferRequest: TransferRequest
): Promise<Quote> => {
  const url = new URL(
    "/api/quotes/transfer-quote",
    import.meta.env.VITE_ONEBALANCE_API
  );

  return fetch(url, {
    method: "post",
    body: JSON.stringify(transferRequest),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ONEBALANCE_API_KEY,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
