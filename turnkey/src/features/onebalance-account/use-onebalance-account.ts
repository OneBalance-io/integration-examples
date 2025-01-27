"use client";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { fetchPredictAddress } from "./fetch-predict-address";
import { useEnvironment } from "../environment/environment";

// below is a random ETH address, please change this as per your requirements.
export const ADMIN_ADDRESS = "0xc162a3cE45ad151eeCd0a5532D6E489D034aB3B8";

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
