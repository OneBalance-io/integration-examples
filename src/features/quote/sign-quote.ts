import { Hex, TypedData } from "viem";
import { ChainOperation, Quote } from "./quote";

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

export const signQuoteWithPrivySigner = (
  signTypedDataWithPrivy: (typedData: any) => Promise<string>
) =>
  signQuoteWithSigner(({ typedData }) =>
    signTypedDataWithPrivy(typedData).then((signature) => signature as Hex)
  );
