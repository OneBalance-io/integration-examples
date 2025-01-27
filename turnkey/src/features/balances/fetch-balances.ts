import { Address } from "viem";
import { UserBalance } from "./balances";

export const fetchBalances = async ({
  address,
  apiKey,
  apiUrl,
}: {
  address: Address;
  apiUrl: string;
  apiKey: string;
}): Promise<UserBalance> => {
  const params = new URLSearchParams();
  params.set("address", address);
  const url = new URL(`/api/balances/aggregated-balance?${params}`, apiUrl);

  return fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
