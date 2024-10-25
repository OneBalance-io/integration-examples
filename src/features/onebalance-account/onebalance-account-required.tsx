import { PropsWithChildren } from "react";
import { useOneBalanceAccountAddress } from "./use-onebalance-account";

export const OneBalanceAccountRequired = ({ children }: PropsWithChildren) => {
  const oneBalanceAccountQuery = useOneBalanceAccountAddress();

  if (!oneBalanceAccountQuery.data) return null;

  return children;
};
