import { ConnectedWallet } from "@privy-io/react-auth";
import {
  Address,
  createWalletClient,
  custom,
  Hash,
  Hex,
  TypedData,
} from "viem";
import { sequentialPromises } from "../promise/promise-sequential";
import { ChainOperation, Quote } from "./quote";

export const signQuoteWithSigner = (
  signTypedData: (_: { typedData: TypedData }) => Promise<Hex>
) => {
  const signOperation =
    (operation: ChainOperation): (() => Promise<ChainOperation>) =>
    async () => {
      const signature = await signTypedData({
        typedData: operation.typedDataToSign,
      });

      return {
        ...operation,
        userOp: { ...operation.userOp, signature },
      };
    };

  return async (quote: Quote): Promise<Quote> => {
    const signedQuote = {
      ...quote,
    };
    signedQuote.originChainsOperations = await sequentialPromises(
      quote.originChainsOperations.map(signOperation)
    );
    if (quote.destinationChainOperation) {
      signedQuote.destinationChainOperation = await signOperation(
        quote.destinationChainOperation
      )();
    }
    return signedQuote;
  };
};

const signTypedDataWithPrivy =
  (embeddedWallet: ConnectedWallet) =>
  async (typedData: any): Promise<Hash> => {
    const provider = await embeddedWallet.getEthereumProvider();
    const walletClient = createWalletClient({
      transport: custom(provider),
      account: embeddedWallet.address as Address,
    });

    return walletClient.signTypedData(typedData);
  };

export const signQuoteWithPrivySignerProvider = (
  embeddedWallet: ConnectedWallet
) =>
  signQuoteWithSigner(({ typedData }) =>
    signTypedDataWithPrivy(embeddedWallet)(typedData)
  );
