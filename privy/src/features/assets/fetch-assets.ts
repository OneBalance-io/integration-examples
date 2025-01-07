import { getRuntimeConfig } from "../../get-config";
import { Asset } from "./assets";

export const fetchAssets = (): Promise<Asset[]> => {
  const config = getRuntimeConfig();
  const url = new URL(`/api/assets/list`, config.VITE_ONEBALANCE_API);

  return fetch(url, {
    headers: {
      "x-api-key": config.VITE_ONEBALANCE_API_KEY,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
