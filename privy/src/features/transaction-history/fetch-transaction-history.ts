import { Address, Hash, Hex } from "viem";
import { getRuntimeConfig } from "../../get-config";
import { AssetId } from "../assets/assets";

export interface TransactionHistory {
  transactions: {
    user: Address;
    type: string;
    timestamp: string;
    status: string;
    quoteId: Hex;
    originToken: {
      aggregatedAssetId: AssetId;
      amount: string;
      assetType: string;
    };
    destinationToken: {
      aggregatedAssetId: AssetId;
      amount: string;
      assetType: string;
      minimumAmount: string;
    };
    originChainOperations: {
      hash: Hash;
      explorerUrl: string;
      chainId: number;
    }[];
    destinationChainOperations: {
      hash: Hash;
      explorerUrl: string;
      chainId: number;
    }[];
  }[];
}

export const fetchTransactionHistory = ({
  address,
}: {
  address: Address;
}): Promise<TransactionHistory> => {
  const config = getRuntimeConfig();
  const params = new URLSearchParams();
  params.set("user", address);
  const url = new URL(
    `/api/status/get-tx-history?${params}`,
    config.VITE_ONEBALANCE_API
  );

  return fetch(url, {
    headers: {
      "x-api-key": config.VITE_ONEBALANCE_API_KEY,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
