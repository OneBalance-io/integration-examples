import { OneBalanceAccountUI } from "../ui/onebalance-account-ui";
import { useOneBalanceAccountAddress } from "./use-onebalance-account";

export const OneBalanceAccount = () => {
  const oneBalanceAccountQuery = useOneBalanceAccountAddress();

  return <OneBalanceAccountUI query={oneBalanceAccountQuery} />;
};
