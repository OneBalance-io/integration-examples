import { Asset } from "./assets";

export const fetchAssets = (): Promise<Asset[]> => {
  const url = new URL(
    `/api/assets/list`,
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
