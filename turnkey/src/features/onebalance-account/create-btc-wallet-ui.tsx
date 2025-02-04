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
        onSubmit={async () => {
          if (!user) return;

          const credential = await passkeyClient?.createUserPasskey({
            publicKey: {
              rp: {
                name: "BTC Wallet Passkey",
              },
              user: {
                name: `[BTC] ${user.username}`,
              },
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

export const CreateBTCWalletUI = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <button
      className={`flex aria-selected:bg-surface-level-2 p-5 text-left w-1/2 border border-surface-level-2 rounded-r-xl`}
      onClick={() => onSubmit()}
    >
      Create BTC account
    </button>
  );
};
