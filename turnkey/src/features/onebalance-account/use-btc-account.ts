import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { createBTCWallet } from "./create-btc-wallet";
import { fetchBTCWalletAddress } from "./fetch-btc-wallet-address";

const usePersistedBTCWallet = () =>
  // persisting these values in local storage is not advisable.
  // they should be persisted in a database against your user.
  // this integration example uses local storage to simulate
  // database persistance. Please exercise caution if copying this example
  useLocalStorage<{ walletId: string; organizationId: string } | null>(
    "btc-wallet",
    null
  );

const useCreateBTCAccount = ({
  onSuccess,
}: {
  onSuccess?: (data: {
    organizationId: string;
    walletId: string;
    address: string;
  }) => void;
}) => {
  return useMutation({
    mutationFn: createBTCWallet,
    onSuccess,
  });
};

const useBTCWalletAddress = () => {
  const [btcWallet] = usePersistedBTCWallet();

  return useQuery({
    queryKey: [
      "onebalance-btc-address",
      btcWallet?.walletId,
      btcWallet?.organizationId,
    ],
    queryFn:
      btcWallet?.organizationId && btcWallet.walletId
        ? () => {
            return fetchBTCWalletAddress({
              walletId: btcWallet.walletId,
              organizationId: btcWallet.organizationId,
            });
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
