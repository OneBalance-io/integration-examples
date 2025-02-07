"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/sdk-react";
import { queryClient } from "../react-query";
import { toast } from "sonner";
import { usePersistedBTCWallet } from "../onebalance-account/use-persisted-btc-wallet";

type TurnkeyBrowserSDK = NonNullable<ReturnType<typeof useTurnkey>["turnkey"]>;
export type TurnkeyPasskeyClient = NonNullable<
  ReturnType<typeof useTurnkey>["passkeyClient"]
>;

export const useTurnkeyAuth = () => {
  const { turnkey, passkeyClient } = useTurnkey();
  const {
    evm: [previousEvmOrgId, setEvmOrgId],
    btc: [, setBtcOrgId],
  } = usePersistedBTCWallet();
  const { mutate: logout } = useMutation({
    mutationFn: (_turnkey: TurnkeyBrowserSDK) => {
      return _turnkey.logoutUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "authenticated" });
      refetch();
    },
  });

  const {
    data: user,
    refetch,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["authenticated"],
    queryFn: async () => {
      const result = await turnkey!.getCurrentUser();
      return result ?? null;
    },
    enabled: !!turnkey,
  });

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: async () => {
      const loginResult = await passkeyClient!.login().then((result) => {
        queryClient.invalidateQueries({ queryKey: "authenticated" });
        refetch();
        return result;
      });
      return loginResult;
    },
    onSuccess: (loginResult) => {
      setEvmOrgId({ evmOrgId: loginResult.organizationId });
      if (
        previousEvmOrgId &&
        previousEvmOrgId.evmOrgId !== loginResult.organizationId
      ) {
        setBtcOrgId("null");
      }
      toast.dismiss();
    },
  });

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      const currentUserSession = await turnkey!.currentUserSession();
      const wallets = await currentUserSession!.getWallets();
      const walletsWithAccounts = await Promise.all(
        wallets.wallets
          .map((wallet) => wallet.walletId)
          .map((walletId) =>
            currentUserSession!.getWalletAccounts({
              walletId,
            })
          )
      );
      return walletsWithAccounts.flatMap((wallet) => wallet.accounts);
    },
    enabled: !!turnkey,
  });

  return {
    logout: turnkey ? () => logout(turnkey) : () => Promise.resolve(),
    authenticated: !!user,
    user,
    login,
    wallets: wallets,
    isLoginPending,
    isUserLoading,
    refreshAuthStatus: refetch,
  };
};
