import { Quote } from "./quote";

export const executeQuote = (
  quote: Quote & { _tag: "BTC" | "EVM" },
  {
    apiKey,
    apiUrl,
  }: {
    apiKey: string;
    apiUrl: string;
  }
) => {
  const url = new URL("/api/quotes/execute-quote", apiUrl);
  const { _tag, ...quoteToSend } = quote;

  return fetch(url, {
    method: "post",
    body: JSON.stringify(quoteToSend),
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
