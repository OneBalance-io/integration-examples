import {
  Address,
  createWalletClient,
  custom,
  Hash,
  Hex,
  TypedData,
} from "viem";
import { ChainOperation, Quote } from "./quote";
import { ConnectedWallet } from "@privy-io/react-auth";

export const signQuoteWithSigner = (
  signTypedData: (_: { typedData: TypedData }) => Promise<Hex>
) => {
  const signOperation = async (
    operation: ChainOperation
  ): Promise<ChainOperation> => {
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
    signedQuote.originChainsOperations = await Promise.all(
      quote.originChainsOperations.map(signOperation)
    );
    if (quote.destinationChainOperation) {
      signedQuote.destinationChainOperation = await signOperation(
        quote.destinationChainOperation
      );
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
