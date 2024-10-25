import { Address } from "viem";

interface PredictAddressRequest {
  sessionAddress: Address;
  adminAddress: Address;
}

export const fetchPredictAddress = (
  addressRequest: PredictAddressRequest
): Promise<{
  predictedAddress: Address;
}> => {
  const url = new URL(
    "/api/account/predict-address",
    import.meta.env.VITE_ONEBALANCE_API
  );

  return fetch(url, {
    method: "post",
    body: JSON.stringify({
      sessionAddress: addressRequest.sessionAddress,
      adminAddress: addressRequest.adminAddress,
    }),
    headers: {
      "x-api-key": import.meta.env.VITE_ONEBALANCE_API_KEY,
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
