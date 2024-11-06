import { getRuntimeConfig } from "../../get-config";
import { TransactionStatus } from "./transaction-status";

export const fetchTransactionStatus = async ({
  quoteId,
}: {
  quoteId: string;
}): Promise<TransactionStatus> => {
  const config = getRuntimeConfig();
  const params = new URLSearchParams();
  params.set("quoteId", quoteId);
  const url = new URL(
    `/api/status/get-execution-status?${params}`,
    config.VITE_ONEBALANCE_API
  );

  return fetch(url, {
    headers: {
      "x-api-key": config.VITE_ONEBALANCE_API_KEY,
    },
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return response.json();
    })
    .then((data) => {
      if (Object.keys(data).length > 0) {
        return {
          _tag: "TransactionStatus",
          ...data,
        };
      } else {
        return {
          _tag: "Empty",
        };
      }
    });
};
