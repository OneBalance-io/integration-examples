export const createBTCWallet = (user: {
  userName: string;
  userEmail?: string;
  userPhoneNumber?: string;
  apiKeys: any[];
  authenticators: any[];
  oauthProviders: any[];
}): Promise<{
  organizationId: string;
  walletId: string;
  address: string;
}> => {
  const url = new URL(
    "/api/account/create-btc-wallet",
    process.env.NEXT_PUBLIC_ONEBALANCE_API
  );

  return fetch(url, {
    method: "post",
    body: JSON.stringify({
      user,
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
