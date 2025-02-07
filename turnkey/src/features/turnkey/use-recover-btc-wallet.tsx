"use client";
import { useMutation } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/sdk-react";
import { usePersistedBTCWallet } from "../onebalance-account/use-persisted-btc-wallet";
import { toast } from "sonner";

export const useRecoverBTCWallet = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const { turnkey } = useTurnkey();
  const {
    btc: [, setBTCWallet],
  } = usePersistedBTCWallet();

  const { mutate: btcLogin, status } = useMutation({
    mutationFn: async ({ rootOrgId }: { rootOrgId: string }) => {
      return turnkey
        ?.passkeyClient()
        .getWhoami({
          organizationId: rootOrgId,
        })
        .then((result) => {
          return turnkey
            ?.passkeyClient()
            .getWallets({
              organizationId: result.organizationId,
            })
            .then((wallets) => {
              return [wallets, result] as const;
            });
        })
        .then(([{ wallets }, { organizationId }]) => {
          if (!wallets[0].walletName.toLowerCase().includes("btc wallet"))
            throw new Error("BTC wallet not found in Turnkey");

          setBTCWallet({
            walletId: wallets[0].walletId,
            organizationId,
          });
        });
    },
    onSuccess,
    onError: (error) => {
      console.error(error);

      toast.error(
        <span className="flex flex-col">
          <span>Failed to recover wallet. Wrong Passkey used.</span>
          <span>Please try again. Make sure to use your BTC Passkey.</span>
          <span>Prefixed with [BTC]</span>
        </span>,
        {
          duration: 15_000,
        }
      );
    },
  });

  return {
    status,
    btcLogin,
  };
};
