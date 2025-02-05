"use client";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { createBTCWallet } from "./create-btc-wallet";
import { fetchBTCWalletAddress } from "./fetch-btc-wallet-address";
import { useEnvironment } from "../environment/environment";
import { usePersistedBTCWallet } from "./use-persisted-btc-wallet";

const useCreateBTCAccount = ({
  onSuccess,
}: {
  onSuccess?: (data: {
    organizationId: string;
    walletId: string;
    address: string;
  }) => void;
}) => {
  const { apiKey, apiUrl } = useEnvironment();

  return useMutation({
    mutationFn: createBTCWallet({
      apiUrl,
      apiKey,
    }),
    onSuccess,
  });
};

const useBTCWalletAddress = () => {
  const [btcWallet] = usePersistedBTCWallet();
  const { apiKey, apiUrl } = useEnvironment();

  return useQuery({
    queryKey: [
      "onebalance-btc-address",
      btcWallet?.walletId,
      btcWallet?.organizationId,
    ],
    queryFn:
      btcWallet?.organizationId && btcWallet.walletId
        ? () => {
            return fetchBTCWalletAddress(
              {
                walletId: btcWallet.walletId,
                organizationId: btcWallet.organizationId,
              },
              {
                apiKey,
                apiUrl,
              }
            );
          }
        : skipToken,
  });
};

export const useBTCAccount = () => {
  const [btcWallet, setBTCWallet] = usePersistedBTCWallet();
  const { data: btcWalletAddress } = useBTCWalletAddress();
  const createMutation = useCreateBTCAccount({
    onSuccess: (data) => {
      setBTCWallet({
        organizationId: data.organizationId,
        walletId: data.walletId,
      });
    },
  });

  const value = !btcWallet
    ? {
        _tag: "NoWallet" as const,
      }
    : {
        _tag: "ExistingWallet" as const,
        btcWallet,
      };

  return [value, btcWalletAddress, createMutation] as const;
};
