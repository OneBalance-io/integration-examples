import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import { toHex } from "viem";
import { TurnkeyPasskeyClient } from "../turnkey/use-turnkey-auth";
import { executeBTCQuote } from "./execute-btc-quote";

const ECPair = ECPairFactory(ecc);

export const signPSBTWithTurnkey =
  ({
    walletAddress,
    publicKey,
    passkeyClient,
    organizationId,
    quoteId,
    walletId,
    apiKey,
    apiUrl,
    tamperProofSignature,
  }: {
    walletAddress: string;
    publicKey: string;
    passkeyClient: TurnkeyPasskeyClient;
    organizationId: string;
    quoteId: string;
    walletId: string;
    apiKey: string;
    apiUrl: string;
    tamperProofSignature: string;
  }) =>
  async (psbtString: string) => {
    const psbt = bitcoin.Psbt.fromHex(psbtString);
    const pair = ECPair.fromPublicKey(Buffer.from(publicKey, "hex"));

    const expectedHashesLength = psbt.inputCount;
    const hashesToSign: Buffer[] = [];

    let mockPromiseReject: (() => void) | undefined;
    const mockPromise = new Promise<Buffer>((resolve, reject) => {
      mockPromiseReject = reject;
    });

    // Mock signer that collects all buffers into an array,
    // and returns a promise that never resolves, and rejects when all populated
    class MockSigner {
      constructor(public publicKey: Buffer) {}

      async sign(hash: Buffer, _lowrR: boolean): Promise<Buffer> {
        hashesToSign.push(hash);
        if (hashesToSign.length === expectedHashesLength) {
          mockPromiseReject?.();
        }

        return mockPromise;
      }

      async signSchnorr(hash: Buffer): Promise<Buffer> {
        hashesToSign.push(hash);
        if (hashesToSign.length === expectedHashesLength) {
          mockPromiseReject?.();
        }

        return mockPromise;
      }
    }

    try {
      await psbt.signAllInputsAsync(
        new MockSigner(Buffer.from(pair.publicKey))
      );
    } catch (error) {}
    const signRawPayloadsResult = await signRawPayloads(
      passkeyClient,
      organizationId,
      hashesToSign,
      walletAddress
    );

    const executionResult = await executeBTCQuote(
      {
        userAddress: walletAddress,
        fingerprint: signRawPayloadsResult.activity.fingerprint,
        activityId: signRawPayloadsResult.activity.id,
        organizationId,
        id: quoteId,
        walletId,
        psbt: psbtString,
        tamperProofSignature,
        addressPublicKey: publicKey,
      },
      {
        apiKey,
        apiUrl,
      }
    );

    return executionResult;
  };

const signRawPayloads = async (
  passkeyClient: TurnkeyPasskeyClient,
  organizationId: string,
  hashes: Buffer[],
  address: string
): ReturnType<typeof passkeyClient.signRawPayloads> => {
  const payload = {
    type: "ACTIVITY_TYPE_SIGN_RAW_PAYLOADS",
    timestampMs: Date.now().toString(),
    parameters: {
      payloads: hashes.map((hash) => toHex(hash)),
      signWith: address,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL" as const,
      hashFunction: "HASH_FUNCTION_NO_OP" as const,
    },
    organizationId,
  };

  const stamp = await passkeyClient.stampSignRawPayloads(payload as any);

  if (!stamp) throw new Error("Failed to initiate signing");

  return fetch(stamp.url, {
    method: "post",
    body: stamp.body,
    headers: {
      "Content-Type": "application/json",
      [stamp.stamp.stampHeaderName]: stamp.stamp.stampHeaderValue,
    },
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return response.json();
    })
    .then((response) => {
      if (typeof response === "object" && response.error)
        throw new Error(response.error);
      return response;
    });
};
