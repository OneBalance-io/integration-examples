"use client";
import { useTurnkey } from "@turnkey/sdk-react";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { useBTCAccount } from "./use-btc-account";
import { useRecoverBTCWallet } from "../turnkey/use-recover-btc-wallet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

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
        rootOrgId=""
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

export const CreateBTCWalletUI = ({
  onSubmit,
  rootOrgId,
}: {
  onSubmit: () => void;
  rootOrgId: string;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { btcLogin, status } = useRecoverBTCWallet({
    onSuccess: () => {
      setIsDialogOpen(false);
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="p-5 text-left w-1/2 border border-surface-level-2 rounded-r-xl flex flex-col gap-2">
        <button
          className={`flex aria-selected:bg-surface-level-2`}
          onClick={() => onSubmit()}
        >
          Create BTC account
        </button>
        <span className="text-gray">or</span>
        <DialogTrigger asChild>
          <button className="text-left text-gray">
            Recover previously created OneBalance BTC wallet
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Recover previously created OneBalance BTC wallet
            </DialogTitle>
          </DialogHeader>
          <DialogDescription />

          <div className="flex flex-col gap-2">
            <p>
              During the recovery flow you will be asked to present your BTC
              Passkey{" "}
              <span className="font-bold underline-offset-2 underline decoration-brand-orange">
                twice
              </span>
              .
            </p>
            <p>
              Please make sure you use the same Passkey for both prompts, and
              that that is a Passkey created when creating the BTC wallet you
              are trying to recover.
            </p>
            <span>Prefixed with [BTC].</span>
          </div>

          <DialogFooter>
            <button
              onClick={() => btcLogin({ rootOrgId })}
              className="h-14 px-10 text-base bg-brand-orange rounded-full text-black"
            >
              {status === "pending" ? "Recovering..." : "Recover BTC wallet"}
            </button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};
