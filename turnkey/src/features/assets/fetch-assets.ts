import { Asset } from "./assets";

export const fetchAssets = ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}): Promise<Asset[]> => {
  const url = new URL(`/api/assets/list`, apiUrl);

  return fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
