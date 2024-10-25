import { Account, Hex, TypedData } from "viem";
import { AssetId } from "../assets/assets";

interface SerializedUserOperation {
  signature: Hex;
}

export interface ChainOperation {
  userOp: SerializedUserOperation;
  typedDataToSign: TypedData;
  assetType: AssetId;
  amount: string;
}

export interface Quote {
  id: string;
  account: Account;
  originChainsOperations: ChainOperation[];
  destinationChainOperation?: ChainOperation;
  expirationTimestamp: string;
  tamperProofSignature: string;
}
