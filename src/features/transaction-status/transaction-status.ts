import { Address } from "viem";

export type TransactionStatus =
  | {
      _tag: "TransactionStatus";
      quoteId: string;
      status: string;
      user: Address;
      recipientAccountId: string;
      originChainOperations: string[];
      destinationChainOperations: string[];
    }
  | {
      _tag: "Empty";
    };
