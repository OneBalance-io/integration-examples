import { Address } from "viem";
import { UserBalance } from "./balances";

export const fetchBalances = async ({
  address,
}: {
  address: Address;
}): Promise<UserBalance> => {
  const params = new URLSearchParams();
  params.set("address", address);
  const url = new URL(
    `/api/balances/aggregated-balance?${params}`,
    process.env.NEXT_PUBLIC_ONEBALANCE_API
  );

  return fetch(url, {
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_ONEBALANCE_API_KEY!,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
