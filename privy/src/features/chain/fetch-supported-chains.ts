import { getRuntimeConfig } from "../../get-config";

export interface Chain {
  chain: {
    chain: "eip155:42161";
    namespace: "eip155";
    reference: "42161";
  };
  isTestnet: boolean;
}

export const fetchSupportedChains = (): Promise<Chain[]> => {
  const config = getRuntimeConfig();
  const url = new URL("/api/chains/supported-list", config.VITE_ONEBALANCE_API);

  return fetch(url, {
    headers: {
      "x-api-key": config.VITE_ONEBALANCE_API_KEY,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
