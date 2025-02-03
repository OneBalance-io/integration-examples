export const executeBTCQuote = (
  quote: {
    id: string;
    userAddress: string;
    addressPublicKey: string;
    activityId: string;
    fingerprint: string;
    organizationId: string;
    walletId: string;
    psbt: string;
    tamperProofSignature: string;
  },
  {
    apiKey,
    apiUrl,
  }: {
    apiKey: string;
    apiUrl: string;
  }
) => {
  const url = new URL("/api/quotes/btc/execute-quote", apiUrl);

  return fetch(url, {
    method: "post",
    body: JSON.stringify(quote),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return response.json();
    })
    .then((response) => {
      if (typeof response === "object" && response.error)
        throw new Error(response.error);
      return response;
    });
};
