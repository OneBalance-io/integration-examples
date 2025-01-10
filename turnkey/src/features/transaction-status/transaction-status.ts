import { Address } from "viem";

export type TransactionStatus =
  | {
      _tag: "TransactionStatus";
      quoteId: string;
      status: string;
      user: Address;
      recipientAccountId: string;
      originChainOperations: {
        hash: string;
        chainId: number;
        explorerUrl: string;
      }[];
      destinationChainOperations: {
        hash: string;
        chainId: number;
        explorerUrl: string;
      }[];
    }
  | {
      _tag: "Empty";
    };
