interface BTCWalletAddressRequest {
  walletId: string;
  organizationId: string;
}

export const fetchBTCWalletAddress = (
  addressRequest: BTCWalletAddressRequest,
  {
    apiUrl,
    apiKey,
  }: {
    apiUrl: string;
    apiKey: string;
  }
): Promise<{
  address: string;
  publicKey: string;
}> => {
  const url = new URL("/api/account/btc-wallet-address", apiUrl);

  return fetch(url, {
    method: "post",
    body: JSON.stringify({
      walletId: addressRequest.walletId,
      organizationId: addressRequest.organizationId,
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
