import { Address } from "viem";

interface PredictAddressRequest {
  sessionAddress: Address;
  adminAddress: Address;
}

export const fetchPredictAddress = (
  addressRequest: PredictAddressRequest,
  {
    apiKey,
    apiUrl,
  }: {
    apiKey: string;
    apiUrl: string;
  }
): Promise<{
  predictedAddress: Address;
}> => {
  const url = new URL("/api/account/predict-address", apiUrl);

  return fetch(url, {
    method: "post",
    body: JSON.stringify({
      sessionAddress: addressRequest.sessionAddress,
      adminAddress: addressRequest.adminAddress,
    }),
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
