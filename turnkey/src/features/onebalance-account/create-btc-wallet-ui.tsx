"use client";
import { useState } from "react";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { useBTCAccount } from "./use-btc-account";
import { useTurnkey } from "@turnkey/sdk-react";

export const BTCWalletUI = () => {
  const { passkeyClient } = useTurnkey();
  const { user } = useTurnkeyAuth();
  const [btcWallet, btcAddress, createBTCWallet] = useBTCAccount();

  return btcWallet._tag === "NoWallet" ? (
    createBTCWallet.status === "pending" ? (
      <p className="animate-pulse flex flex-col gap-1">
        <span>Creating your BTC wallet</span>
        <span className="text-sm">Please wait...</span>
      </p>
    ) : (
      <CreateBTCWalletUI
        onSubmit={async ({ email }) => {
          if (!user) return;

          const credential = await passkeyClient?.createUserPasskey({
            publicKey: {
              rp: {
                name: "BTC Wallet Passkey",
              },
              user: {},
            },
          });
          if (!credential) return;

          const { encodedChallenge: challenge, attestation } = credential;

          createBTCWallet.mutate({
            userName: user.username,
            apiKeys: [],
            authenticators: [
              {
                authenticatorName: "Default BTC Passkey",
                challenge: challenge,
                attestation: attestation,
              },
            ],
            oauthProviders: [],
            userEmail: email,
          });
        }}
      />
    )
  ) : btcAddress ? (
    <p className="flex flex-col gap-1">
      <span>Your OneBalance BTC wallet is ready</span>
      <code className="text-brand-orange text-sm">{btcAddress.address}</code>
    </p>
  ) : null;
};

const CreateBTCWalletUI = ({
  onSubmit,
}: {
  onSubmit: ({}: { email: string }) => void;
}) => {
  const [isCreating, setIsCreating] = useState(false);

  if (!isCreating)
    return (
      <button onClick={() => setIsCreating(true)}>Create BTC account</button>
    );

  return (
    <form
      className="flex flex-col w-fit justify-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        onSubmit({
          email: formData.get("email") as string,
        });
      }}
    >
      <input
        placeholder="Your BTC wallet email"
        type="email"
        name="email"
        required
        className="px-4 py-3 rounded-xl bg-surface-level-3 h-14"
      />

      <button type="submit">Create BTC account</button>
    </form>
  );
};
