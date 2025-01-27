export interface Chain {
  chain: {
    chain: "eip155:42161";
    namespace: "eip155";
    reference: "42161";
  };
  isTestnet: boolean;
}

export const fetchSupportedChains = ({
  apiKey,
  apiUrl,
}: {
  apiKey: string;
  apiUrl: string;
}): Promise<Chain[]> => {
  const url = new URL("/api/chains/supported-list", apiUrl);

  return fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
