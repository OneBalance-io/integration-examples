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
    process.env.NEXT_PUBLIC_ONEBALANCE_API
  );

  return fetch(url, {
    method: "post",
    body: JSON.stringify({
      sessionAddress: addressRequest.sessionAddress,
      adminAddress: addressRequest.adminAddress,
    }),
    headers: {
      "x-api-key": process.env.NEXT_PUBLIC_ONEBALANCE_API_KEY!,
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};
