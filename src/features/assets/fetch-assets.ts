import { Asset } from "./assets";

export const fetchAssets = (): Promise<Asset[]> => {
  const url = new URL(`/api/assets/list`, import.meta.env.VITE_ONEBALANCE_API);

  return fetch(url, {
    headers: {
      "x-api-key": import.meta.env.VITE_ONEBALANCE_API_KEY,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
