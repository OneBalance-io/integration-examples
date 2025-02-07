"use client";
import { useLocalStorage } from "@uidotdev/usehooks";

export const usePersistedBTCWallet = () => {
  // persisting these values in local storage is not advisable.
  // they should be persisted in a database against your user.
  // this integration example uses local storage to simulate
  // database persistance. Please exercise caution if copying this example
  const [btcValue, setBtcValue] = useLocalStorage<
    { walletId: string; organizationId: string } | "null"
  >("btc-wallet", "null");
  const [evmOrgId, setEvmOrgId] = useLocalStorage<
    { evmOrgId: string } | "null"
  >("evm-org-id", "null");

  const returnedBtcValue =
    btcValue === "null" || !btcValue || Object.keys(btcValue).length === 0
      ? ([null, setBtcValue] as const)
      : ([btcValue, setBtcValue] as const);

  const returnedEvmOrgId =
    evmOrgId === "null" || !evmOrgId || Object.keys(evmOrgId).length === 0
      ? ([null, setEvmOrgId] as const)
      : ([evmOrgId, setEvmOrgId] as const);

  return {
    btc: returnedBtcValue,
    evm: returnedEvmOrgId,
  };
};
