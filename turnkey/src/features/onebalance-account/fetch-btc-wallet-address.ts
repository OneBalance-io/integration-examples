interface BTCWalletAddressRequest {
  walletId: string;
  organizationId: string;
}

export const fetchBTCWalletAddress = (
  addressRequest: BTCWalletAddressRequest
): Promise<{
  address: string;
  publicKey: string;
}> => {
  const url = new URL(
    "/api/account/btc-wallet-address",
    process.env.NEXT_PUBLIC_ONEBALANCE_API
  );

  return fetch(url, {
    method: "post",
    body: JSON.stringify({
      walletId: addressRequest.walletId,
      organizationId: addressRequest.organizationId,
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
