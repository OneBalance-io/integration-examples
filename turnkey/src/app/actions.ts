"use server";

import { DEFAULT_ETHEREUM_ACCOUNTS, Turnkey } from "@turnkey/sdk-server";

if (!process.env.TURNKEY_API_PRIVATE_KEY) {
  throw new Error("TURNKEY_API_PRIVATE_KEY is required");
}
if (!process.env.TURNKEY_API_PUBLIC_KEY) {
  throw new Error("TURNKEY_API_PUBLIC_KEY is required");
}

// Initialize the Turnkey Server Client on the server-side
const turnkeyServer = new Turnkey({
  apiBaseUrl: "https://api.turnkey.com",
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY,
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY,
  defaultOrganizationId: process.env.PUBLIC_TURNKEY_ORGANIZATION_ID!,
}).apiClient();

type TAttestation = {
  credentialId: string;
  clientDataJson: string;
  attestationObject: string;
  transports: (
    | "AUTHENTICATOR_TRANSPORT_BLE"
    | "AUTHENTICATOR_TRANSPORT_INTERNAL"
    | "AUTHENTICATOR_TRANSPORT_NFC"
    | "AUTHENTICATOR_TRANSPORT_USB"
    | "AUTHENTICATOR_TRANSPORT_HYBRID"
  )[];
};

export const createSubOrganization = async (
  preState: any,
  {
    credential,
    attestation,
    userName,
  }: {
    email: string | undefined;
    credential: string;
    attestation: TAttestation;
    userName: string;
  }
) => {
  const createSubOrgResponse = await turnkeyServer.createSubOrganization({
    subOrganizationName: `User Sub Org - ${userName}`,
    rootUsers: [
      {
        userName,
        userEmail: email,
        apiKeys: [],
        authenticators: [
          {
            authenticatorName: "Default Passkey",
            challenge: credential,
            attestation: attestation,
          },
        ],
        oauthProviders: [],
      },
    ],
    rootQuorumThreshold: 1,
    wallet: {
      walletName: "Default EVM Wallet",
      accounts: DEFAULT_ETHEREUM_ACCOUNTS,
    },
  });

  return createSubOrgResponse;
};
