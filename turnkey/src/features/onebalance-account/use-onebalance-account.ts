"use client";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { fetchPredictAddress } from "./fetch-predict-address";
import { useEnvironment } from "../environment/environment";

export const ADMIN_ADDRESS = "0x771d3303f888E75bD24634967196b5ae87C7819D";

export const useEmbeddedWallet = () => {
  const { wallets } = useTurnkeyAuth();
  return wallets?.[0];
};

export const useOneBalanceAccountAddress = () => {
  const embeddedWallet = useEmbeddedWallet();

  return usePredictAddress({
    sessionKeyAddress: embeddedWallet?.address as Address | undefined,
    // below is a random ETH address, please change this as per your requirements.
    adminKeyAddress: ADMIN_ADDRESS,
  });
};

const usePredictAddress = ({
  sessionKeyAddress,
  adminKeyAddress,
}: {
  sessionKeyAddress: Address | undefined;
  adminKeyAddress: Address;
}) => {
  const { apiKey, apiUrl } = useEnvironment();
  return useQuery({
    queryKey: [
      "onebalance-account-address",
      sessionKeyAddress,
      adminKeyAddress,
    ],
    queryFn: sessionKeyAddress
      ? () => {
          return fetchPredictAddress(
            {
              sessionAddress: sessionKeyAddress,
              adminAddress: adminKeyAddress,
            },
            {
              apiUrl,
              apiKey,
            }
          );
        }
      : skipToken,
  });
};
