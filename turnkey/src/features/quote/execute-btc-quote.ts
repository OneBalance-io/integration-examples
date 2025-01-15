export const executeBTCQuote = (quote: {
  id: string;
  userAddress: string;
  psbt: string;
}) => {
  const url = new URL(
    "/api/quotes/btc/execute-quote",
    process.env.NEXT_PUBLIC_ONEBALANCE_API
  );

  return fetch(url, {
    method: "post",
    body: JSON.stringify(quote),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_ONEBALANCE_API_KEY!,
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
