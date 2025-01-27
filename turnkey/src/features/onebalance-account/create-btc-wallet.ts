export const createBTCWallet =
  ({ apiKey, apiUrl }: { apiUrl: string; apiKey: string }) =>
  (user: {
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
    const url = new URL("/api/account/create-btc-wallet", apiUrl);

    return fetch(url, {
      method: "post",
      body: JSON.stringify({
        user,
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
