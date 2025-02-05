"use client";
import { useLocalStorage } from "@uidotdev/usehooks";

export const usePersistedBTCWallet = () => {
  // persisting these values in local storage is not advisable.
  // they should be persisted in a database against your user.
  // this integration example uses local storage to simulate
  // database persistance. Please exercise caution if copying this example
  const [value, setValue] = useLocalStorage<
    { walletId: string; organizationId: string } | "null"
  >("btc-wallet", "null");

  if (value === "null" || !value || Object.keys(value).length === 0)
    return [null, setValue] as const;

  return [value, setValue] as const;
};
