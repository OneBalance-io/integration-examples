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
    console.log("cp1", psbtString, publicKey);
    const psbt = bitcoin.Psbt.fromHex(psbtString);
    console.log("cp2", psbt);
    const pair = ECPair.fromPublicKey(Buffer.from(publicKey, "hex"));
    console.log("cp3", pair);

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
    console.log("direct 0", psbt.txInputs[0].hash);
    console.log("direct 1", psbt.txInputs[1].hash);
    console.log("direct 2", psbt.txInputs[2].hash);
    console.log("direct 3", psbt.txInputs[3].hash);
    await Promise.all(signPromises);

    return psbt.finalizeAllInputs().extractTransaction().toHex();
  };
