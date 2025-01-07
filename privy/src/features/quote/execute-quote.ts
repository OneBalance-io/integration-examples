import { getRuntimeConfig } from "../../get-config";
import { Quote } from "./quote";

export const executeQuote = (quote: Quote) => {
  const config = getRuntimeConfig();
  const url = new URL("/api/quotes/execute-quote", config.VITE_ONEBALANCE_API);

  return fetch(url, {
    method: "post",
    body: JSON.stringify(quote),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.VITE_ONEBALANCE_API_KEY,
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
