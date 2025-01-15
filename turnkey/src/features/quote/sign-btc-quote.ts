import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import { toHex } from "viem";
import { TurnkeyPasskeyClient } from "../turnkey/use-turnkey-auth";

const ECPair = ECPairFactory(ecc);

class TurnkeySigner {
  constructor(
    public address: string,
    public publicKey: Buffer,
    public passkeyClient: TurnkeyPasskeyClient,
    public organizationId: string
  ) {}

  async sign(hash: Buffer, _lowrR: boolean): Promise<Buffer> {
    const { r, s } = await signRawPayload(
      this.passkeyClient,
      this.organizationId
    )(hash, this.address);
    return Buffer.from(r + s, "hex");
  }

  async signSchnorr(hash: Buffer): Promise<Buffer> {
    const { r, s } = await signRawPayload(
      this.passkeyClient,
      this.organizationId
    )(hash, this.address);

    return Buffer.from(r + s, "hex");
  }
}

const signRawPayload =
  (passkeyClient: TurnkeyPasskeyClient, organizationId: string) =>
  async (hash: Buffer, address: string) => {
    return passkeyClient.signRawPayload({
      payload: toHex(hash),
      signWith: address,
      encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
      hashFunction: "HASH_FUNCTION_NO_OP",
      organizationId,
    });
  };

export const signPSBTWithTurnkey =
  ({
    walletAddress,
    publicKey,
    passkeyClient,
    organizationId,
  }: {
    walletAddress: string;
    publicKey: string;
    passkeyClient: TurnkeyPasskeyClient;
    organizationId: string;
  }) =>
  async (psbtString: string) => {
    const psbt = bitcoin.Psbt.fromHex(psbtString);
    const pair = ECPair.fromPublicKey(Buffer.from(publicKey, "hex"));

    const signer = new TurnkeySigner(
      walletAddress,
      // @ts-expect-error
      pair.publicKey,
      passkeyClient,
      organizationId
    );

    const count = psbt.inputCount;
    const signPromises: Promise<any>[] = [];
    for (let i = 0; i < count; i++) {
      signPromises.push(psbt.signInputAsync(i, signer));
    }
    await Promise.all(signPromises);

    return psbt.finalizeAllInputs().extractTransaction().toHex();
  };
