export interface Chain {
  chain: {
    chain: "eip155:42161";
    namespace: "eip155";
    reference: "42161";
  };
  isTestnet: boolean;
}

export const fetchSupportedChains = (): Promise<Chain[]> => {
  const url = new URL(
    "/api/chains/supported-list",
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
