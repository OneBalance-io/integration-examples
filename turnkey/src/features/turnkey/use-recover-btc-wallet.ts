"use client";
import { useMutation } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/sdk-react";
import { usePersistedBTCWallet } from "../onebalance-account/use-persisted-btc-wallet";

export const useRecoverBTCWallet = () => {
  const { turnkey } = useTurnkey();
  const {
    btc: [, setBTCWallet],
  } = usePersistedBTCWallet();

  const { mutate: btcLogin } = useMutation({
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
            return;

          setBTCWallet({
            walletId: wallets[0].walletId,
            organizationId,
          });
        });
    },
  });

  return {
    btcLogin,
  };
};
