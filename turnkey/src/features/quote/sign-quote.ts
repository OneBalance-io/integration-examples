import {
  Address,
  fromHex,
  Hash,
  hashTypedData,
  Hex,
  recoverAddress,
  serializeSignature,
  toHex,
} from "viem";
import { TurnkeyPasskeyClient } from "../turnkey/use-turnkey-auth";
import { Quote } from "./quote";

export const signQuoteWithSigner = (
  signHashes: (hashes: Hash[]) => Promise<Hex[]>
) => {
  return async (quote: Quote): Promise<Quote> => {
    const signedQuote = {
      ...quote,
    };
    const payloadsToSign: Hash[] = [];

    quote.originChainsOperations.forEach((operation) => {
      payloadsToSign.push(hashTypedData(operation.typedDataToSign as any));
    });
    if (quote.destinationChainOperation) {
      payloadsToSign.push(
        hashTypedData(quote.destinationChainOperation.typedDataToSign as any)
      );
    }

    const signatures = await signHashes(payloadsToSign);
    signedQuote.originChainsOperations.forEach((operation, index) => {
      operation.userOp.signature = signatures[index];
    });
    if (signedQuote.destinationChainOperation) {
      signedQuote.destinationChainOperation.userOp.signature =
        signatures[signatures.length - 1];
    }

    return signedQuote;
  };
};

const signTypedDataWithTurnkey =
  (
    passkeyClient: TurnkeyPasskeyClient,
    address: Address,
    organizationId: string
  ) =>
  async (hashes: Hash[]): Promise<Hex[]> => {
    const signed = await passkeyClient.signRawPayloads({
      payloads: hashes,
      signWith: address,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_NO_OP",
      organizationId,
    });

    if (!signed.signatures)
      throw new Error("No signatures returned from Turnkey");

    const signatures = signed.signatures.map(serializeTurnkeySignature);

    return signatures;
  };

export const signQuoteWithTurnkeySigner = (
  passkeyClient: TurnkeyPasskeyClient,
  address: Address,
  organizationId: string
) =>
  signQuoteWithSigner((hashes) =>
    signTypedDataWithTurnkey(passkeyClient, address, organizationId)(hashes)
  );

const serializeTurnkeySignature = (signature: {
  r: string;
  s: string;
  v: string;
}): Hex => {
  const signatureBytes = fromHex(`0x${signature.r + signature.s}`, "bytes");

  const r = signatureBytes.slice(0, 32);
  const s = signatureBytes.slice(32, 64);
  const yParity = convertVToYParity(signature.v);

  return serializeSignature({
    r: toHex(r),
    s: toHex(s),
    yParity,
  });
};

const convertVToYParity = (v: string) => {
  switch (v) {
    case "00":
    case "1b":
      return 0;
    case "01":
    case "1c":
      return 1;
    default:
      throw new Error(`Invalid v value: ${v}`);
  }
};
